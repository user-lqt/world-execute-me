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
