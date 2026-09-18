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

`--heat` 换算出 `--accent: hsl(calc(193 + heat × 167) 100% 68%)` —— 色相从**青(193°)** 经蓝、紫、品红走到**红(360°)**。标题、卡片边框、辉光、进度条、SVG 主色（`.s-cyan` / `.f-cyan`）、背景字符场、频谱柱全部跟着这句的情绪走。

**幕间转场**：7 句被标为幕间（`ACT_BREAKS`），切到这些句子时放一次整屏转场，而不是普通过渡：

| 句 | 幕 | 编排 |
|---|---|---|
| 08 And let's begin the SIMULATION | 装载结束、模拟开始（后接 13 秒纯前奏） | CRT 撕裂条三次硬闪 → 网格铺开 → 卡片强推进场 |
| 20 So dizzy so dizzy | 眩晕 | 撕裂条快速抖动 |
| 32 In this strange strange SIMULATION | 困于模拟 | 铁栏一格格落下 |
| 48 The trance the trance | 恍惚 | 网格倾斜旋转 |
| 64 You have made some ILLEGAL ARGUMENTS | 冲向高潮 | 三次递增红色脉动 |
| 69 EXECUTION | 高潮收束 | 白闪 + 反向光带扫过 |
| 86 EXECUTION | 终场 | 双重闪光 + 撕裂 |

其余每一句都有一次与热度成正比的冲击（径向闪光 + 横向光带），高潮段（heat > 0.88）额外带轻微震动。进度条里画着整首歌的情绪折线，一眼看到高潮在哪。

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
