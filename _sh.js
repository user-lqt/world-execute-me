const fs = require('fs');
const p = 'E:/deepseek_harness/workplace_test/world-execute-me-repo/';
const n = process.argv[2] || '1';
const clean = process.argv[3] === 'clean';   // clean: 关掉过渡与特效层，只看配色
let html = fs.readFileSync(p + 'index.html', 'utf8');

let css = ':root{transition:none!important}';
if (clean) css += '#fx{display:none!important}';
html = html.replace('</head>', '<style>' + css + '</style></head>');

const inject = `<script>
setTimeout(function(){
  var st = document.getElementById('stage');
  st.style.scrollBehavior = 'auto';
  st.scrollTop = Math.max(0, document.querySelector('.card.active').offsetTop - 18);
}, 250);
<\/script>`;
fs.writeFileSync(p + '_dbg.html', html.replace('</body>', inject + '</body>'));
console.log('n=' + n + (clean ? ' clean' : ''));
