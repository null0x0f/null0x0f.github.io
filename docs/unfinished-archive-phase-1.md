# NULL / 0x0F：设计系统、首页与归档交付记录

日期：2026-11-21。依据 `E:\blog\design.md`，本轮范围由用户确认：先完成设计系统、首页与文章归档，风格确认后再迁移阅读页和其他页面。

## 完成范围

- 从干净的 `new--blog` 基线 `fc05318` 创建 `codex/unfinished-archive`。本轮未提交、未推送，未改写历史。
- 品牌、设计 Token、自托管英文字体、公共布局、编号导航、搜索对话框、封底及专属分享图。
- 首页八段结构：海报、宣言、精选文章、最新索引、周报、项目记录、After Hours、封底。
- 文章归档：13 篇文章按年份排列，主题筛选、即时计数、键盘聚焦和触屏摘要。
- 保留搜索、主题切换、GitHub 活动、动态周数、SEO 和旧文章 URL。

## 设计与实现决策

品牌使用 NULL / 0x0F，作者继续读取 `siteInfo` 的 Felix Ding。纸白、油墨黑、橙色组成基本语言，蓝色用于 After Hours 和焦点。版式以大字、留白、分隔线及非对称栏目形成节奏。

精选文章优先读取 `featured`，不足时按发布日期补齐至 3 篇。目前没有标记精选的文章，使用最新 3 篇。项目区域链接已有的真实复盘文章，不使用未注册的 projects 文件或未经核实的指标。周报期号通过现有日期函数计算。

BLEACH 图片复用 `public/images/bleach` 中的原图，延迟加载并放在首页后段拼贴区。首页不加载旧桌面拖拽、壁纸图库或宠物脚本。旧页面保留原布局与资源，方便后续分阶段迁移。

英文采用 Barlow Condensed、Space Grotesk 和 IBM Plex Mono，4 个 WOFF2 文件合计 74,328 字节，使用 `font-display: swap`，仅预加载 Display 字体。来源、版本、校验值和开源许可见 `public/fonts/README.md`。中文使用 Noto Sans SC / PingFang SC / Microsoft YaHei 系统回退，尚未打包中文字体。

## 文件变更清单

| 文件 | 用途 |
| --- | --- |
| `src/pages/index.astro` | 首页结构及真实内容查询 |
| `src/pages/blog/index.astro` | 按年份归档、标签筛选入口 |
| `src/layouts/EditorialLayout.astro` | 新公共布局、字体与主题初始化 |
| `src/components/editorial/Brand.astro` | 品牌标记 |
| `src/components/editorial/Masthead.astro` | 导航、移动菜单、搜索与主题按钮 |
| `src/components/editorial/Cover.astro` | 首页海报 |
| `src/components/editorial/SectionHeading.astro` | 可复用章节标题 |
| `src/components/editorial/Colophon.astro` | 封底与页脚导航 |
| `src/components/editorial/SearchDialog.astro` | 搜索对话框 |
| `src/styles/tokens.css` | 色彩、字体、网格与深色主题 |
| `src/styles/editorial.css` | 公共组件、响应式、焦点与减少动效 |
| `src/styles/home.css` | 首页各段版式 |
| `src/styles/archive.css` | 归档列表与筛选版式 |
| `public/app.js` | 兼容新旧筛选、菜单键盘关闭、主题存储异常与复制失败处理 |
| `src/components/SEO.astro` | 可选 editorial 分享图和图标，旧页面默认行为保持 |
| `src/pages/og/archive.png.ts` | 1200×630 分享图静态生成 |
| `public/archive-mark.svg` | 新品牌图标 |
| `public/fonts/fonts.css` | 自托管字体声明 |
| `public/fonts/barlow-condensed-latin-700-normal.woff2` | Display 字体 |
| `public/fonts/space-grotesk-latin-wght-normal.woff2` | UI 可变字体 |
| `public/fonts/ibm-plex-mono-latin-400-normal.woff2` | 常规等宽字体 |
| `public/fonts/ibm-plex-mono-latin-500-normal.woff2` | 中等字重等宽字体 |
| `public/fonts/BARLOW-CONDENSED-LICENSE.txt` | Barlow 原始许可 |
| `public/fonts/SPACE-GROTESK-LICENSE.txt` | Space Grotesk 原始许可 |
| `public/fonts/IBM-PLEX-MONO-LICENSE.txt` | IBM Plex Mono 原始许可 |
| `public/fonts/README.md` | 字体来源、字重、大小、校验值 |
| `docs/unfinished-archive-phase-1.md` | 本交付记录 |

未修改文章与周报内容、Content Collection schema、`siteInfo`、`BaseLayout`、文章详情、周报页、About 和旧链接跳转。没有新增依赖。

## 实际验证

- `pnpm check`：44 个 Astro 文件，0 errors / 0 warnings / 0 hints。
- 最终 `pnpm build`：内含类型检查，结果相同；22 个页面成功生成。
- `node --check public/app.js`：通过；独立 Node VM 检查主题存储异常、新旧筛选、菜单关闭及复制失败分支通过。
- `git diff --check`：通过。
- 最终构建产物：56 处内部链接（27 个唯一目标、7 处锚点引用）、27 处资源引用（16 个唯一资源）、4 份 CSS 内 4 个字体 URL 均有效，无缺失。
- 首页与归档 canonical、OG、作者及 JSON-LD 核对正确；实际 OG 图为 1200×630，已视觉检查。
- 浏览器：首页在 320、390、768、1440 像素视口检查；归档在 320、390、1440 像素检查，根页面无横向溢出。320 像素品牌末尾换行问题已修正。
- 实测 Linux 筛选显示 2 篇，恢复全部显示 13 篇；空年份隐藏、计数随筛选更新。
- 实测搜索按钮、Ctrl+K、输入检索、方向键选中、Enter 跳转文章、Escape 关闭；移动菜单开关与 Escape 关闭；浅色/深色切换。
- 新页面仅加载新样式与必要脚本；生产预览控制台未见错误。
- 已修正封底链接及工具图标悬停对比度。CSS 已包含 `prefers-reduced-motion` 规则；未通过浏览器系统设置实际模拟该媒体条件。

首次在受限环境执行 pnpm 时出现 EPERM；使用已获准的本地执行后检查与构建成功。

## 已知限制与下一阶段

本轮没有运行 Lighthouse 或完整 WCAG AA 审计，因此不声明达到 90 分或全面符合 AA。中文字体仍随设备可用字体变化。GitHub 活动沿用现有接口与降级逻辑，数据时效取决于外部服务。

下一阶段先迁移文章阅读体验：封面标题、正文宽度与行高、目录、代码复制、表格与图片；之后统一周报、About 和 404。新旧布局暂时并存是阶段边界，后续迁移完成后再清理旧样式和脚本。

本地查看：运行 `pnpm dev --host 127.0.0.1`，以终端显示的地址打开首页和 `/blog/`。构建后可用 `pnpm preview --host 127.0.0.1` 查看静态产物。
