/**
 * 用 CDP 把页面录成视频帧。
 *
 *   node rec.js --url <URL> --out <帧目录> --dur <秒> [--w 1280 --h 720 --q 75]
 *               [--every 4] [--drive]
 *
 * --drive  注入一个按真实时间推进的时间轴循环（调用页面的 window.__seek），
 *          这样不依赖音频播放，录出来的节奏与音频一一对应。
 * --every  Nth：screencast 每 N 帧推一张，用来限流（默认 1 = 全部）。
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const has = k => argv.includes('--' + k);

const URL_    = arg('url', 'about:blank');
const OUT     = arg('out', './frames');
const DUR     = parseFloat(arg('dur', '6'));
const W       = parseInt(arg('w', '1280'), 10);
const H       = parseInt(arg('h', '720'), 10);
const Q       = parseInt(arg('q', '75'), 10);
const EVERY   = parseInt(arg('every', '1'), 10);
const PROFILE = arg('profile', './chrome-profile');

fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJSON = url => new Promise((res, rej) => {
  http.get(url, r => { let s = ''; r.on('data', d => s += d);
    r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej);
});

(async () => {
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=' + PORT,
    '--no-first-run', '--no-default-browser-check', '--disable-breakpad',
    '--disable-crash-reporter', '--noerrdialogs', '--disable-dev-shm-usage',
    '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--user-data-dir=' + path.resolve(PROFILE),
    '--window-size=' + W + ',' + H, 'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++){
    await sleep(250);
    try { target = (await getJSON('http://127.0.0.1:' + PORT + '/json/list')).find(t => t.type === 'page'); }
    catch (e) {}
  }
  if (!target){ console.error('连不上调试端口'); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(target.webSocketDebuggerUrl,
    { perMessageDeflate: false, maxPayload: 512 * 1024 * 1024 });
  let id = 0;
  const pending = new Map();
  const send = (method, params) => new Promise((res, rej) => {
    const m = ++id; pending.set(m, { res, rej });
    ws.send(JSON.stringify({ id: m, method, params: params || {} }));
  });

  let frames = 0, bytes = 0, skipped = 0;
  const stamps = [];
  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch (e) { return; }
    if (msg.id && pending.has(msg.id)){
      const p = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result);
      return;
    }
    if (msg.method === 'Page.screencastFrame'){
      const { data, sessionId, metadata } = msg.params;
      send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      if ((frames + skipped) % EVERY !== 0){ skipped++; return; }
      const name = String(frames).padStart(6, '0') + '.jpg';
      fs.writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'));
      bytes += data.length;
      stamps.push({ name, ts: metadata.timestamp });
      frames++;
    }
  });

  await new Promise(r => ws.on('open', r));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ });
  await sleep(2600);

  if (has('drive')){
    await send('Runtime.evaluate', { expression:
      'window.__t0 = performance.now();' +
      '(function loop(){ window.__seek((performance.now() - window.__t0)/1000); requestAnimationFrame(loop); })();' +
      '"driven"' });
    console.log('已注入时间轴驱动');
  }

  const t0 = Date.now();
  await send('Page.startScreencast',
    { format: 'jpeg', quality: Q, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  console.log('抓帧开始，目标 ' + DUR + 's（每 ' + EVERY + ' 帧取 1）…');

  let last = 0;
  while ((Date.now() - t0) / 1000 < DUR){
    await sleep(5000);
    const el = (Date.now() - t0) / 1000;
    if (el - last >= 9.5){
      last = el;
      let st = '';
      try {
        const r = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__state())', returnByValue: true });
        st = r.result && r.result.value ? r.result.value : '';
      } catch (e) {}
      console.log('  ' + el.toFixed(0) + 's  帧 ' + frames + '  ' + st);
      process.stdout.write('');
    }
    if (el >= DUR) break;
  }
  await send('Page.stopScreencast');

  const listPath = path.join(path.dirname(OUT), path.basename(OUT) + '.txt');
  const lines = [];
  let prev = null;
  for (const s of stamps){
    if (prev !== null){
      const d = Math.max(0.008, Math.min(0.6, s.ts - prev));
      lines.push("file '" + s.name + "'");
      lines.push('duration ' + d.toFixed(4));
    }
    prev = s.ts;
  }
  if (stamps.length) lines.push("file '" + stamps[stamps.length - 1].name + "'");
  fs.writeFileSync(listPath, lines.join('\n'));

  const el = (Date.now() - t0) / 1000;
  console.log('完成：' + frames + ' 帧 / ' + (bytes / 1048576).toFixed(1) + 'MB / ' +
              el.toFixed(1) + 's / ' + (frames / el).toFixed(1) + ' fps');
  console.log('清单：' + listPath);
  ws.close(); chrome.kill(); await sleep(500); process.exit(0);
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
