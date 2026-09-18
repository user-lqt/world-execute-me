/**
 * 构建脚本：把字体 / 音频内联进 HTML，产出单文件。
 *
 *   node build.js --src <源HTML> --out <输出HTML>
 *                 [--font <字体.ttf|otf|woff2>] [--audio <音频>] [--mime audio/mpeg]
 *
 * · --font  注入到源码里的 占位注释（@font-face，base64 内嵌）
 *           占位符字面量见下面 FONT_MARK 常量
 * · --audio 注入到 </body> 前的 <script id="bundledAudio" type="text/plain">，
 *           页面运行时解成 Blob 交给 <audio>（避免超长 data: URI）
 * 两者都可省略；重复运行会先清掉旧块，结果幂等。
 */
const fs = require('fs');
const path = require('path');

const FONT_MARK = '/*__FONT__*/';

const args = {};
for (let i = 2; i < process.argv.length; i += 2){
  const k = process.argv[i].replace(/^--/, '');
  args[k] = process.argv[i + 1];
}
if (!args.src || !args.out){
  console.error('用法: node build.js --src <源HTML> --out <输出HTML> [--font x.ttf] [--audio x.mp3]');
  process.exit(1);
}

let html = fs.readFileSync(args.src, 'utf8');
const report = [];

/* ---------------- 字体 ---------------- */
html = html.replace(/@font-face\{font-family:'WEM Mono';[\s\S]*?\}\n?/g, '');
if (args.font){
  const ext = path.extname(args.font).toLowerCase();
  const FMT = { '.woff2':'woff2', '.woff':'woff', '.ttf':'truetype', '.otf':'opentype' };
  const fmt = FMT[ext];
  if (!fmt){ console.error('不认识的字体格式: ' + ext); process.exit(1); }
  const font = fs.readFileSync(args.font);
  const css =
    "@font-face{font-family:'WEM Mono';font-style:normal;font-weight:100 900;" +
    "src:url(data:font/" + ext.slice(1) + ";base64," + font.toString('base64') + ") format('" + fmt + "');" +
    "font-display:swap}\n";
  if (!html.includes(FONT_MARK)){ console.error('源码里找不到字体占位注释'); process.exit(1); }
  html = html.replace(FONT_MARK, css.trim());
  report.push('字体: ' + path.basename(args.font) + ' → ' + (font.length / 1024).toFixed(0) + 'KB (base64 ' +
              (css.length / 1024).toFixed(0) + 'KB)');
}

/* ---------------- 音频 ---------------- */
html = html.replace(/<script id="bundledAudio"[\s\S]*?<\/script>\n?/g, '');
html = html.replace(/<!-- ===== 内置音频[\s\S]*?-->\n?/g, '');
if (args.audio){
  const MIMES = { '.mp3':'audio/mpeg', '.m4a':'audio/mp4', '.aac':'audio/aac', '.ogg':'audio/ogg',
                  '.opus':'audio/ogg', '.wav':'audio/wav', '.flac':'audio/flac', '.webm':'audio/webm' };
  const audio = fs.readFileSync(args.audio);
  const mime = args.mime || MIMES[path.extname(args.audio).toLowerCase()] || 'audio/mpeg';
  const b64 = audio.toString('base64');
  const block =
    '<!-- ===== 内置音频（构建脚本注入，勿手改） =====\n' +
    '     源文件: ' + path.basename(args.audio) + '\n' +
    '     ' + (audio.length / 1048576).toFixed(2) + ' MB · ' + mime + ' · base64 ' + (b64.length / 1048576).toFixed(2) + ' MB\n' +
    '     运行时由 loadBundled() 解成 Blob 交给 <audio> -->\n' +
    '<script id="bundledAudio" type="text/plain">' + b64 + '</script>\n';
  const anchor = html.lastIndexOf('<script>');
  if (anchor === -1){ console.error('找不到主 <script> 锚点'); process.exit(1); }
  html = html.slice(0, anchor) + block + html.slice(anchor);
  report.push('音频: ' + path.basename(args.audio) + ' → ' + (audio.length / 1048576).toFixed(2) + 'MB (' + mime + ')');
}

html = html.replace(
  'Mili ·《Miracle Milk》',
  'Mili ·《Miracle Milk》' + (args.audio ? ' &nbsp;|&nbsp; <span style="color:#6ee7ff">音频已内嵌 · 单文件可离线播放</span>' : '')
);

fs.writeFileSync(args.out, html);
report.push('输出: ' + args.out + '  ' + (fs.statSync(args.out).size / 1048576).toFixed(2) + ' MB');
console.log(report.join('\n'));
