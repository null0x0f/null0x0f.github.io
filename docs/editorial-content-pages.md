# 内容页统一设计交付

2026-11-21。在第一阶段首页/文章归档交付后，按用户要求继续使用 `new--blog`，完成剩余页面统一并正常提交推送。

## 本轮完成

- 13 篇文章详情：编辑式标题封面，760px 正文栏，桌面 18px / 1.85、手机 16px / 1.8；可滚动侧目录、手机折叠目录、相邻文章导航。
- 周报归档：WEEKLY 大字、动态最新期号、月份索引；保留搜索、年份、重置、无结果和计数交互。
- 5 篇周报详情：动态 WEEK 封面，复用阅读组件，保留前后期导航和日期工具。
- About：SUBJECT / 0x0F 档案排版，保留已有简介、原则、技术方向；项目入口取现有文章。
- 404：FILE NOT FOUND 海报，首页/归档入口和 noindex。
- 所有页面共用品牌、导航、页脚、搜索、字体、主题和焦点规则。旧资源暂留仓库，但没有公开页面再使用 BaseLayout 或旧桌面脚本。

## 变更文件

| 文件 | 作用 |
| --- | --- |
| `src/layouts/EditorialLayout.astro` | 增加 article 元信息和 noindex 透传 |
| `src/components/editorial/ReadingFrame.astro` | 正文、桌面/手机目录及尾部插槽 |
| `src/styles/reading.css` | 文章/周报阅读系统、代码/表格、Shiki 深色主题 |
| `src/pages/blog/[...slug].astro` | 文章详情模板迁移 |
| `src/pages/weekly/[...slug].astro` | 周报详情模板迁移 |
| `src/pages/weekly/index.astro` | 周报归档迁移 |
| `src/styles/weekly-archive.css` | 周报归档样式 |
| `src/pages/about.astro` | 作者档案页面 |
| `src/pages/404.astro` | 自定义 404 |
| `src/styles/profile.css` | About/404 样式 |
| `public/app.js` | 代码滚动区域支持键盘聚焦与可访问名称 |
| `docs/editorial-content-pages.md` | 本记录 |

## 验证

- `pnpm build`（包含 `astro check`）：46 文件，0 errors / warnings / hints，23 页面生成成功。
- `node --check public/app.js`、`git diff --check`：通过。
- 23 个页面逐一检查 320px 深色和 1440px 浅色视口：根页面无横向溢出、全部存在新布局与主内容入口。另检查了 390px 长文章和 768px 周报；404 窄屏句点溢出已修正。
- 实测文章目录跳转、手机目录展开；250ETS 的 82 个目录项限制为内部滚动。
- 实测代码复制后粘贴与原文相符；代码可键盘聚焦、保持横向滚动。宽表格在自身区域内滚动，深色代码使用 Shiki 深色配色。
- 实测周报 Qt 搜索为 4/5；未匹配词为 0/5 并显示空态；恢复/年份筛选为 5/5，重置隐藏。
- 18 篇正文的 257 个代码块、23 张表格、29 张图片和 48 个兼容锚点与基线相同。480 个桌面/手机目录链接均命中。
- 18 个详情页均保留 BlogPosting、作者及发布日期/更新日期。25 个 HTML 产物（含两个旧链接跳转）没有加载旧 CSS、桌面动画或宠物脚本。
- 内容、collection schema、日期函数和旧链接跳转逻辑未修改；没有新增依赖。

## 保留事项

未运行 Lighthouse 或完整 WCAG 审计，不声明达到特定分数。减少动效沿用公共 CSS 规则，没有通过系统设置模拟该媒体条件。

原文的既有内容问题未混入本次视觉迁移：操作系统文章有 41 处缺图提示；部分文章手写片段链接与标题不匹配，工业后端文章中的 3 个同域 SVG 不在当前仓库。内容审计已区分这些问题与本轮回归。缺图提示已设为独立块，避免挤压相邻文字。

后续可单独整理原文缺图/失效片段链接，并在设计稳定后清理不再引用的旧布局和资源。
