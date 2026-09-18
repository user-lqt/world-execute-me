/**
 * 把抓好的帧编码成视频，并把原曲音轨合进去。
 *
 *   node encode.js --list <帧清单.txt> --audio <音频> --out <输出.mp4> [--crf 20] [--fps 25]
 *
 * 用 concat demuxer 按每帧真实时间戳还原节奏（抓帧率是浮动的），
 * 再交给 libx264 编成固定帧率。
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FFMPEG = process.env.FFMPEG ||
  'D:/Program_Files_D/ffmpeg-2025-07-01-git-11d1b71c31-full_build/bin/ffmpeg.exe';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };

const LIST  = arg('list');
const AUDIO = arg('audio');
const OUT   = arg('out', 'out.mp4');
const CRF   = arg('crf', '20');
const FPS   = arg('fps', '25');
const SCALE = arg('scale', '1600:900');

if (!LIST || !fs.existsSync(LIST)){ console.error('缺少帧清单: ' + LIST); process.exit(1); }

const args = ['-hide_banner', '-y',
  '-f', 'concat', '-safe', '0', '-i', LIST];
if (AUDIO) args.push('-i', AUDIO);
args.push(
  '-fps_mode', 'cfr', '-r', FPS,
  '-vf', 'scale=' + SCALE + ':flags=lanczos',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', CRF,
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
if (AUDIO) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
args.push(OUT);

console.log('编码中…');
const t0 = Date.now();
const p = spawn(FFMPEG, args, { stdio: ['ignore', 'ignore', 'inherit'] });
p.on('exit', code => {
  if (code !== 0){ console.error('ffmpeg 退出码 ' + code); process.exit(code); }
  const mb = fs.statSync(OUT).size / 1048576;
  console.log('完成: ' + OUT + '  ' + mb.toFixed(1) + ' MB  ' +
              ((Date.now() - t0) / 1000).toFixed(0) + 's');
});
