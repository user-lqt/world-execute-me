const fs=require('fs');
const s=fs.readFileSync('E:/deepseek_harness/workplace_test/world-execute-me-repo/src/index.html','utf8');
try{ [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).forEach(x=>new Function(x)); console.log('  语法 OK'); }catch(e){ console.log('  错误:', e.message); process.exit(1); }
const js=/<script>([\s\S]*?)<\/script>/.exec(s)[1];
const core=js.slice(0,js.indexOf('const cardsEl'));
const m=new Function(core+'\nreturn {LINES,HEAT};')();
const perf=[...js.matchAll(/^  (\d+): \(/gm)].map(x=>+x[1]).filter(n=>n<=86);
const persists={};
[...js.matchAll(/\[([\d,\s]+)\]\.forEach\(n => PERSIST\[n\] = '(\w+)'\)/g)].forEach(x=>{
  persists[x[2]]=x[1].split(',').map(Number);
});
const all=new Set([...perf, ...Object.values(persists).flat()]);
console.log('  一次性演出: ' + perf.length + ' 句');
console.log('  持续状态: ' + Object.entries(persists).map(([k,v])=>k+'('+v.length+')').join(' '));
console.log('  有专属编排: ' + all.size + ' / ' + m.LINES.length + ' 句，其余 ' + (m.LINES.length-all.size) + ' 句走通用冲击');
console.log('  覆盖句号: ' + [...all].sort((a,b)=>a-b).join(','));
