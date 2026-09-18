const fs=require('fs');
const s=fs.readFileSync('E:/deepseek_harness/workplace_test/world-execute-me-repo/index.html','utf8');
const t={
 '栏杆容器 #cage':        /id="cage"[\s\S]*?cage-rail-top/,
 '栏杆圆杆高光':          /rgba\(226,248,255,\.60\) 48%/,
 '栏杆景深(边缘更粗)':     /const w = 11 \+ edge \* 11/,
 '隔离隧道视觉':          /\.fx-veil\{/,
 '恍惚旋转环':            /\.fx-trance b\{/,
 '高潮/爱色调层':         /\.fx-tint\{/,
 '整页色雾 #glow':        /id="glow"/,
 '--heat 可动画':         /@property --heat\{syntax/,
 '热度过渡':              /transition:--heat \.95s/,
 '饱和度随热度':          /--accent-s: calc\(68% \+ var\(--heat\) \* 32%\)/,
 '亮度随热度':            /--accent-l: calc\(42% \+ var\(--heat\) \* 30%\)/,
 '卡片被染色':            /\.card::before\{/,
 '页头被染色':            /inset 0 -30px 60px -40px var\(--accent\)/,
 '演出池(32格)':          /for \(let i = 0; i < 32; i\+\+\)/,
 '持续状态机':            /function applyPersist/,
 'setIndex 调用演出':     /perform\(i, heat\);\s*\n\s*applyPersist\(i \+ 1\);/
};
for(const k in t) console.log('  '+(t[k].test(s)?'✓':'✗')+' '+k);
