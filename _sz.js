const fs=require('fs');
const {execSync}=require('child_process');
for (const n of [1,33,65,85]) {
  const f='E:/deepseek_harness/workplace_test/world-execute-me-repo/_c'+n+'.png';
  if(!fs.existsSync(f)) { console.log(n+': 缺文件'); continue; }
  console.log(n + ': ' + (fs.statSync(f).size/1024).toFixed(0) + 'KB');
}
