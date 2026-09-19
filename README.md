# World.execute(me); — 歌词 × 代码

把 Mili 的《world.execute(me);》拆成 **86 句**，每一句歌词配一段由它联想展开的 Java 代码，逐句对照。

> 歌名本身就是一个 Java 函数调用：`World.execute(me);` —— 世界是对象，我是参数。

**在线体验：** https://user-lqt.github.io/world-execute-me/

---

## 它长什么样

```
┌─ World.execute(me);▌  Mili ·《Miracle Milk》 ──────────────────────┐
│ ▁▃▅▂█▆▁▃  [载入音频] 站点音频 · audio.mp3 · 03:31  [原版时间轴][导入LRC] │
├───────────────────────────────────────────────────────────────────┤
│  ┌── 歌词卡 34 / 86 ──────────┐  ┌─ Vegetable.java   L107–115 ──┐  │
│  │ If I'm an eggplant        │  │ public sealed interface      │  │
│  │ 如果我是一根茄子            │  │     Vegetable permits        │  │
│  │ [SVG: 蔬菜轮廓 + 叶子]      │  │     Eggplant, Tomato, ...    │  │
│  └────────────────────────────┘  └──────────────────────────────┘  │
│  ◀◀  ▶  ▶▶  ▓▓▓▓▓░░░░░░░  34/86  [逐句模式][打点][单句循环]        │
└───────────────────────────────────────────────────────────────────┘
```

* **86 句 → 44 个 Java 文件**：`Boot.java`、`Geometry.java`、`DisjointSet.java`、`Isolation.java`、`Deadlock.java`……
  代码不是随便贴的片段，而是顺着歌词语义推演出来的：`If I'm a circle` → `if (this instanceof Circle)`；
  `Then you can be my LIMITATIONS` → `return lim(x -> f(x), x -> INF);   // 你是我的边界`；
  五遍 `You have left` → 五次 `poll();`，注释依次写「对象已不存在 / 仍返回空 / 连接超时 / 重复的日志行 / 确认」。
* **30 种程序化 SVG 图形**：正弦曲线是真的 `Math.sin`，切线用数值求导求出真实斜率，`infinity` 画的是伯努利双纽线，`heart` 用心形参数方程。
* **音频同步**：拖入音频即按时间轴跟随，内置 [LRCLIB](https://lrclib.net/) 的官方对轴。

## 动效

| 层 | 效果 |
|---|---|
| 歌词 | **乱码解码**：每个字符先在 `01<>{}[]()/*+-=%$#@!?;:~^&\|アカサタナ…` 里滚动，从左往右逐个落定，解析中的字符发青光 |
| 代码 | **打字机 + 方块光标**：逐字符吐出，光标是扫过源码的青色方块，走到哪亮到哪 |
| SVG | **自我绘制**：描边元素取 `getTotalLength()` 做 `strokeDashoffset` 归零，曲线一笔笔画出来；填充元素围绕自身中心弹入 |
| 卡片 | 环形跑马灯边框 + 换句扫描线 + 音频电平驱动的辉光 |
| 背景 | 全屏 canvas 字符场，代码字符缓缓下落、随机闪烁换字 |
| 其他 | 进度条彗星头、标题每 9 秒故障脉冲 |

字体为内嵌的 **Cascadia Mono**（拉丁）+ 系统中日韩等宽字形兜底，离线也不会退回比例字体。
所有动效在 `prefers-reduced-motion: reduce` 下自动关闭。

## 情绪曲线

整首歌被切成 86 个热度值（`HEAT` 数组），驱动全站配色与转场强度：

```
0.14 通电/初始化 → 0.32 几何 → 0.48 电流 → 0.64 满足 → 0.78 执行
     → 0.54 茄子·番茄·花猫（俏皮段回落）→ 0.68 性别·角色 → 0.84 失去
     → 0.96 非法参数 → 1.00 EXECUTION ×12（高潮）→ 0.55 骤静 ← 落差最大的那次切换
     → 0.72 学习爱 → 0.88 自由 → 1.00 最后的 EXECUTION
```

`--heat` 换算出整站配色，而且**色相、饱和度、亮度一起走**：

```css
--accent-h: calc(196 + var(--heat) * 164);   /* 青蓝 196° → 红 360° */
--accent-s: calc(68% + var(--heat) * 32%);   /* 越热越艳 */
--accent-l: calc(42% + var(--heat) * 30%);   /* 越热越亮 */
```

低热是又深又闷的蓝，高热是又亮又烫的红——拉开的不仅是色相。`--heat` 注册成 `@property` 并带 0.95s 过渡，所以换句时整站配色是**淌过去**的。

染色覆盖：整页上下两片色雾（`#glow`）、卡片表面、卡片边框与辉光、标题、进度条、SVG 主色、背景字符场、频谱柱。

**幕间转场**：7 句被标为幕间（`ACT_BREAKS`），切到这些句子时放一次整屏转场：

| 句 | 幕 | 编排 |
|---|---|---|
| 08 And let's begin the SIMULATION | 装载结束、模拟开始（后接 13 秒纯前奏） | CRT 撕裂条三次硬闪 → 网格铺开 → 卡片强推进场 |
| 20 So dizzy so dizzy | 眩晕 | 撕裂条快速抖动 |
| 32 In this strange strange SIMULATION | 困于模拟 | 铁栏一格格落下 |
| 48 The trance the trance | 恍惚 | 网格倾斜旋转 |
| 64 You have made some ILLEGAL ARGUMENTS | 冲向高潮 | 三次递增红色脉动 |
| 69 EXECUTION | 高潮收束 | 白闪 + 反向光带扫过 |
| 86 EXECUTION | 终场 | 双重闪光 + 撕裂 |

进度条里画着整首歌的情绪折线，一眼看到高潮在哪。

## 演出

页面会按歌词内容"演"出来。56 / 86 句有专属编排，其余走通用冲击。

**持续状态**（进入某几句时整页维持一种处境，离开才撤）：

| 状态 | 句 | 画面 |
|---|---|---|
| `cage` 囚笼 | 31 32 76 77 84 85 | **真的在页面上架起 11 根栏杆**，从中间向两侧依次落下；边缘的栏杆更粗更暗做出景深，杆身中段有高光，所以看着是圆的金属杆；上下两道横梁 + 四周暗角 |
| `isolate` 隔离 | 58 83 | 隧道视觉：中间一小圈亮着，其余沉入黑暗 |
| `trance` 恍惚 | 47 48 | 两层反向旋转的虚线大环 |
| `climax` 高潮 | 65–69 | 红光从画面底部漫上来 |
| `love` 爱 | 79–82 | 暖粉色雾 |
| `dim` 逐渐暗淡 | 53–57 | 五句「You have left」把画面一级级压暗到 0.66 |

**一次性演出**（42 句），例如：

| 句 | 歌词 | 演出 |
|---|---|---|
| 01 | Switch on the power line | 一道电涌从左往右推过，网格通电亮起 |
| 03 | Lay down your pieces | 24 枚方块落下吸附到位 |
| 05 | Fill in my data parameters | 竖排数据流灌进画面 |
| 09 | If I'm a set of points | 散点浮现，再被一条线连起来 |
| 11 | If I'm a circle | 三个圆环从中心推开 |
| 13 | If I'm a sine wave | 22 个点连成一道行进波 |
| 15 | If I approach infinity | 一圈圈推进，像掉进隧道 |
| 20 | **So dizzy so dizzy** | **整页模糊**（`filter:blur(7px)`）+ 卡片打转 + 三层螺旋环 |
| 30 | I will run the EXECUTION | 一枚巨大的执行标记砸下来 + 震动 |
| 38 | I will purr for your ENJOYMENT | 卡片以 68ms 周期轻颤 22 次（咕噜） |
| 39 | If I'm the only god | 16 道光芒从标题处推开 |
| 44 | From AM to PM | 一轮日头划过屏幕顶端 |
| 60 | erase all the pointless FRAGMENTS | 碎片四散飞走 |
| 65 | EXECUTION × 4 | X 齐射 + 强烈震动 |
| 68 | EIN DOS TROIS NE FEM LIU | 1–6 六个数字依次砸在中央 |
| 71 | give them all the EXECUTION | X 像雨一样落下 |
| 80 | Question me | 问号成排浮起 |
| 81 | I can answer all LO-O-OVE | 对勾成排打下 |
| 82 | algebraic expression of LO-O-OVE | 数学符号雨 |

所有演出只用 `transform` / `opacity`（眩晕的模糊是静态滤镜，只光栅化一次），元素复用 32 格池，换句时不增删 DOM。

## 节奏

所有动画时长、级联延迟、定时清理都乘同一个系数 `PACE`（源码第 1700 行附近）：

```js
const PACE = 1.6;                    // 1 = 原速，1.6 = 慢 60%，想更快就调小
const P = ms => Math.round(ms * PACE);
```

接入点：`fire()`（演出池动画）、`poolCleanup()`、`shakeCard()`、`typeEn()` 的逐字间隔、
`typeCode()` 的打字时长、`animateViz()` 的绘制与级联、`cardEnter()`、`fxPunch()` / `sceneFx()`、
`cageShow()`、`applyPersist()`，以及无音频时 7.2 秒一句的自动推进。

调一处即可整体变速，不用翻遍每个 `animate()`。

## 界面

只留主体：歌词、图形、代码。

已经拿掉的说明元素：页头副标题与右侧说明、页脚快捷键提示、音频条拖拽提示、
卡片序号角标、`JAVA` 徽标、行号区间、时间戳，以及图形内部那些把画面复述一遍的
文字标注（整流图上的「正弦/整流/削波/直流」、神经网络图的 `input/output` 等）。
只保留真正是内容的标签：`M/F`、`S/M`、`AC/DC`、`?/YES/no`、`A.D./B.C.`、数字 1–6、
`LO-O-OVE` 的重复、代数公式。

保留的控件（载入音频 / 原版时间轴 / 导入导出 LRC / 播放条 / 逐句·打点·循环）
在**空闲 3.2 秒后降到 14% 不透明度**，任何鼠标移动或按键立刻恢复——看内容时它们退到几乎看不见。

### 卡片入场方式

不是每句都从下往上推。按段落分派九种，改 `ENTER_RANGES` 里的区间即可：

| 方式 | 动作 | 用在 |
|---|---|---|
| `rise` | 自下而上推进 | 建立段 |
| `sink` | 自上而下沉入 | 下坠段、终章 |
| `left` / `right` | 侧向滑入 | 回忆、回归 |
| `zoom` | 从远处放大逼近 | 模拟开始 |
| `shrink` | 从近处收缩退远 | 孤独段 |
| `flip` | 沿 Y 轴翻转 | 转换 / 切换的主题 |
| `glitch` | 横向错位闪入 | 囚笼、执行 |
| `split` | 纵向裂开 | 碎片段 |

换幕时用大动作，同幕内用小动作（幅度与时长各收一半）。全部只用 `transform` + `opacity`，不碰布局。

## 导出视频

页面本身可以录成 MP4。仓库里的 `tools/` 是一套全自动管线：无头 Chrome 抓帧 → ffmpeg 编码 → 合入原曲音轨。

```bash
npm install ws                    # tools 只依赖这一个包
cd tools

# 1. 抓帧（213 秒，1600×900，约 25fps）
node record.js \
  --url "file:///<绝对路径>/index.html?rec=1" \
  --out ../frames --dur 213 --w 1600 --h 900 --q 80 --every 4 --drive

# 2. 编码 + 混音
node encode.js --list ../frames.txt --audio ../audio.mp3 \
  --out ../world-execute-me.mp4 --crf 20 --fps 25 --scale 1600:900
```

实测产出：**5377 帧 → 34.7 MB MP4**（1600×900 / 25fps / H.264 CRF 20 / AAC 192k，时长 3:31.9）。

两个关键设计：

- **`?rec=1`**：页面进入录制模式，不弹 toast、不自动加载音频，画面交给外部时钟驱动。
- **`--drive`**：向页面注入一个按真实时间推进的循环，每帧调用 `window.__seek(t)`。这样不依赖浏览器出声，抓帧的节奏与原曲严格一一对应，最后把音轨合进去即可。
- **抓帧率是浮动的**：页面静止时浏览器不重绘就没有新帧。所以 `record.js` 记录每帧的真实时间戳并写成 concat 清单，静止段落不浪费帧、动画段落不丢帧，编码时再统一成 25fps。

想更小就把 `--crf` 调到 24–26（约 15–25 MB），想更清晰用 `--w 1920 --h 1080 --every 2`。

## 性能

首屏约 600KB（含内嵌字体），真正的开销在合成层与逐帧重绘。用无头浏览器探针实测后逐项优化：

| 项 | 优化前 | 优化后 | 原因 |
|---|---|---|---|
| `backdrop-filter` 元素 | **89** | **3** | 86 张卡各自开一个背景采样层，是最大开销；卡片改用不透明渐变，只保留页头 / 音频条 / 页脚 |
| 边框跑马灯 | `conic-gradient` + `@property` 角度动画 | 光带 `transform` 平移 | 前者让整张卡每帧重新光栅化（约 60 万像素/帧），后者走合成器 |
| 换句扫描线 | 动画 `top` | 动画 `transform` | 避免每帧触发局部布局 |
| 频谱渐变 | 每帧新建 40 个 `LinearGradient` | 只建 1 次复用 | |
| 背景字符场 | 90 个 / 每字重设 `ctx.font` / 2x 缓冲 | 46 个 / 每帧设 1 次 / 1x | 纯装饰，锁 1x 省一半填充率 |
| 非当前卡的 SVG 动画 | 全在跑 | `animation-play-state: paused` | 全页近千个 SVG 元素 |
| 无限虚线动画 | 常驻 | 切走即 `pause()` | WAAPI 动画不受 CSS 控制，需手动暂停 |
| 音频电平 → 整卡辉光 | 每 3 帧 | 每 8 帧 + 量化到 0.1 | 减少整卡重绘 |
| 时间戳刷新 | 每秒全量刷 86 个 | 仅在时间轴变动时 | |
| 逐字 span 构建 | 切句瞬间同步建上千节点 | `requestIdleCallback` 预建前后各两张 | 消除切句掉帧 |
| 后台标签页 | 照常跑 | `visibilitychange` 全站暂停 | 省电 |
| 神经网络的虚线边 | **60 条**无限 `strokeDashoffset` | 静态边 + **6 条**信号流 | `strokeDashoffset` 每帧变都要重画整条线 |
| 密集图形的入场动画 | 84 个元素全动 | 超过 64 个时隔一个动一个 | 上百个动画同时起跑就是换句时掉帧的来源 |
| `filter:blur()` | 色带冲刷 / 光柱上各有大面积模糊 | 改多段渐变收边 | 大面积模糊在动画期间要逐帧重算 |
| 字符雨 | 16 列 × 14 字 | 10 列 × 10 字（`fxRain`） | 文字动画比纯 transform 贵 |
| 背景字符场 | 每帧 | 降到 30fps | 每帧要清一次全屏再画 46 个 `fillText` |

最新一次实测（真实时钟，1600×900，无头 Chrome）：

| 部位 | 最差帧 | 常驻动画 |
|---|---|---|
| 第 08 句（神经网络） | 37.7ms → **21.2ms** | 296 → **25** |
| 第 45 句（链条） | 23.2ms → 18.4ms | 311 → 9 |
| 第 66 句（高潮） | 37.4ms → 25.3ms | 392 → 8 |

稳态帧率 58.8–60.8 fps。

**踩过的两个坑：**

1. **`transform-box` 默认是 `view-box`。** SVG 子元素上 `scale()` 的原点是整块画布的
   中心，不是图形自己——于是每个图形入场都在「从画布中心飞出来」，扁平图形会被
   看成被挤扁变形（锁链那五个环最明显）。必须设
   `.viz svg *{transform-box:fill-box;transform-origin:50% 50%}`；
   需要绕画面中心转的图形（`.spin`）得用更具体的选择器把原点改回去。
2. **`new Function(js)` 只验证语法，验证不了运行时。** 一次 `const` 暂时性死区
   （`Cannot access 'N' before initialization`）让整个脚本在渲染卡片前就中断，
   页面只剩页头和页脚。验证一定要走真浏览器：挂 `window.error` 监听，
   并确认 `document.querySelectorAll('.card').length === 86`。

## 音频

**站点已内置 `audio.mp3`**（160kbps · 44.1kHz · 4.04MB，从 24bit/192kHz 无损压下来），
打开 https://user-lqt.github.io/world-execute-me/ 即自动载入并套用精确时间轴，按空格开始播放。

音频走同源流式加载，HTML 只有 573KB，首屏立刻可见；进度拖动交给 HTTP Range，不占内存。

想换成别的版本（翻唱/现场），直接把自己的文件拖进页面即可覆盖。

### 打包成离线单文件

`build.js` 可以把字体和音频一起内联，产出**双击即播、零外部依赖**的单个 HTML：

```bash
# 1. 无损压成适合内嵌的体积
ffmpeg -i "Mili - world.execute (me) ;.flac" -map 0:a:0 -vn -map_metadata -1 \
       -c:a libmp3lame -b:a 160k -ar 44100 -ac 2 audio.mp3

# 2. 字体 + 音频一起内联
node build.js --src src/index.html --out world-execute-me-standalone.html \
              --font fonts/CascadiaMono.ttf --audio audio.mp3
```

142MB 的 24bit/192kHz FLAC → 4.04MB MP3 → **5.96MB 单文件 HTML**。

### 时间轴来源

内置时间轴取自 [LRCLIB #37237659](https://lrclib.net/api/get/37237659)（Mili /《Miracle Milk》/ 212.0s），
96 行同步歌词与本项目的 86 句只有三处分段差异，已手工归并：

```
LRC 65 "You have made some" + 66 "Illegal arguments"  → 第 64 句
LRC 68~73 六组 "Execution, execution"                 → 第 65/66/67 句（每句 4 个 EXECUTION）
LRC 74~76 "Ein, dos" + "Trios, ne" + "Fem, liu"       → 第 68 句
```

导入 LRC 时不做行号硬塞，而是 **按歌词文本模糊对齐**（归一化 + 编辑距离，每句向后合并最多 4 个片段取最优），
所以翻唱版、德语填词版、任意分段方式都能对上。这条对齐器跑真实 LRCLIB 数据的结果与手工时间轴**逐句零误差**。

### 时间轴校准

| 手段 | 说明 |
|---|---|
| 原版时长自动匹配 | 载入即用内置轴，无需操作 |
| `[` / `]` | 整体偏移 ∓0.1s |
| 打点模式 | 播放中听到该句开头按 `T`，逐句记录，自动保证单调递增 |
| 导入 / 导出 LRC | 支持标准 `[mm:ss.xx]` 与 JSON 数组 |

## 快捷键

| 键 | 作用 |
|---|---|
| `空格` | 播放 / 暂停 |
| `← →` | 上一句 / 下一句（有音频时 seek 到该句起点） |
| `T` | 打点 |
| `L` | 单句循环 |
| `[` `]` | 全局偏移 −0.1s / +0.1s |
| `Home` `End` | 首句 / 末句 |
| 滚轮 | 手动浏览（自动暂停） |

## 本地开发

```bash
git clone https://github.com/user-lqt/world-execute-me.git
cd world-execute-me
# 改 src/index.html（里面的字体占位注释会被构建脚本替换）
node build.js --src src/index.html --out index.html --font fonts/CascadiaMono.ttf
```

* `src/index.html` —— 源码（102KB，无字体无音频，改这个）
* `index.html` —— 构建产物（586KB，内嵌字体，GitHub Pages 直接服务它）
* `build.js` —— 构建脚本，`--font` / `--audio` 都可省略，幂等可重复运行

## 部署

仓库根目录就是站点根目录，`main` 分支 `/` 已开启 GitHub Pages。
推送到 `main` 后一两分钟自动发布到 https://user-lqt.github.io/world-execute-me/

## 致谢与说明

* 原曲：**Mili — world.execute(me);**（专辑《Miracle Milk》）词曲版权归 Mili / 原作者所有
  仓库内的 `audio.mp3` 为个人非商业使用而内置，如版权方要求会立即移除
* 同步歌词时间轴：[LRCLIB](https://lrclib.net/)（开源歌词库）
* 内嵌字体：[Cascadia Code](https://github.com/microsoft/cascadia-code)（SIL Open Font License 1.1，见 `fonts/LICENSE-Cascadia.txt`）
* 页面代码与那 86 段 Java 联想代码：MIT，见 [LICENSE](LICENSE)

本项目是非商业的二次创作 / 学习作品，与 Mili 及其厂牌无关联。
