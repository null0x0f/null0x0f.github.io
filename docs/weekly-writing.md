# 周报写作与发布指南

周报用于记录一周的工作推进、遇到的问题、学习收获和下周计划。它是独立于技术文章的内容集合：技术文章继续放在 `src/content/blog/`，周报放在 `src/content/weekly/`。

公开页面包括 `/weekly/` 归档和 `/weekly/{文件名}/` 详情。首页展示周报入口与最新一期，导航、页脚和站内搜索也可进入周报。没有已发布周报时，页面显示空状态；项目自带模板不会被当作一篇正式周报。

## 1. 准备环境

在项目根目录，也就是包含 `package.json` 的目录中操作。正式项目目录为 `D:\jackie null\blog-github`。

推荐 Node.js 24 和 pnpm 11.25.0，与项目及部署环境一致：

```powershell
Set-Location -LiteralPath "D:\jackie null\blog-github"
node --version
pnpm.cmd --version
pnpm.cmd install --frozen-lockfile
```

若系统找不到 pnpm，安装 Node.js 后执行：

```powershell
npm.cmd install --global pnpm@11.25.0
```

PowerShell 使用 `.cmd` 入口可以避开 `npm.ps1` / `pnpm.ps1` 执行策略限制。其他终端直接使用 `pnpm` 即可。

## 2. 从模板创建一篇周报

模板文件为 `src/content/weekly/_template.md`，其中 `draft: true`，会保留在源码中，但不生成公开详情页，也不进入首页、归档或搜索。

复制模板，文件名推荐使用该周周一的日期：

```powershell
Copy-Item -LiteralPath "src/content/weekly/_template.md" -Destination "src/content/weekly/2026-10-12.md"
```

编辑新文件，保留模板本身供以后使用。不要直接把 `_template.md` 改为公开内容。

示例 frontmatter：

```yaml
---
title: "周报：工业通信调试与博客整理"
description: "记录本周的通信问题排查、技术笔记整理和下周计划。"
weekOf: "2026-10-12"
publishedAt: 2026-10-18
tags: [C++, Qt, Modbus]
draft: true
---
```

这里的日期仅为模板示例。新建下一期时要同时检查文件名、`weekOf` 和 `publishedAt`，填写实际日期。

## 3. 字段说明

| 字段 | 必填 | 格式与作用 |
| --- | --- | --- |
| `title` | 是 | 周报标题，建议写明本周主题，便于归档和搜索。 |
| `description` | 是 | 简短摘要，显示在列表和搜索结果中。 |
| `weekOf` | 是 | 严格使用 `YYYY-MM-DD`，必须是有效日期且当天为周一。建议加引号。 |
| `publishedAt` | 是 | 发布日期，可以使用 `YYYY-MM-DD`，也支持可解析的完整日期时间。 |
| `updatedAt` | 否 | 最后修改日期，可在补充周报时填写。 |
| `tags` | 否 | 字符串数组，例如 `[Qt, C++]`，默认空数组。 |
| `draft` | 否 | `true` 为草稿；默认 `false`，省略即视为公开。 |

`weekOf` 表示周报覆盖的那一周，`publishedAt` 表示这篇周报的发布日期，两者可以不同。例如补写十月第一周的记录时，仍将 `weekOf` 填为那一周的周一，而不是补写当天。

周报的日期计算和页面日期展示统一使用 UTC，以保证本地与 GitHub Actions 构建结果一致。只记录日期时，推荐使用 `YYYY-MM-DD`；若填写带时区的完整时间，页面显示其对应的 UTC 日期。

系统根据 `weekOf` 自动计算周一至周日的日期范围和 ISO 周次，不需要手动输入周日或期号。例如：

| `weekOf` | 覆盖范围 | ISO 周次 | 归档归属 |
| --- | --- | --- | --- |
| `2026-10-12` | 2026-10-12 至 2026-10-18 | 2026-W42 | 2026 年 10 月 |
| `2025-12-29` | 2025-12-29 至 2026-01-04 | 2026-W01 | 2025 年 12 月 |

归档按周一所属的日历年月分组，按 `weekOf` 从新到旧排序。跨年周的 ISO 周所属年份与归档年份可能不同，这是两种日期规则的正常结果。

同一个 `weekOf` 只能有一篇公开周报。允许保留同周草稿，但如果两篇都设为 `draft: false`，构建会报错。修订内容时优先编辑现有周报，不要复制成第二篇公开周报。

## 4. 正文建议

模板提供四个二级标题，可根据实际内容增删：

```markdown
## 本周推进

- 完成了什么，得到什么结果。

## 问题与解法

- 遇到的问题、排查过程和最终处理方式。

## 输入与收获

- 阅读、学习、实验，以及值得保留的链接。

## 下周计划

- 下一步准备推进的事项。
```

正文支持与 Blog 相同的 Markdown / MDX 写作方式，包括列表、引用、表格、图片和代码块。普通文字记录优先使用 `.md`；需要组件时再使用 `.mdx`。代码块注明语言，例如 `cpp`、`c`、`bash`、`python`，页面会使用现有代码高亮与复制功能。

周报的长篇技术分析也可以整理为 Blog 文章，再在周报中添加链接：

```markdown
[查看完整操作系统笔记](/blog/operating-system/)
```

## 5. 添加图片

推荐按周创建图片目录：

```text
public/images/weekly/2026-10-12/
├── serial-trace.png
└── debug-result.webp
```

正文使用公共路径，不要写 `public/` 前缀：

```markdown
![串口调试记录](/images/weekly/2026-10-12/serial-trace.png)
```

图片文件名与引用的大小写必须完全一致，GitHub Actions 和线上服务器会区分大小写。不要引用 `D:\...` 这样的本机路径。已有图床也可使用完整 HTTPS 链接，但图片可用性会依赖对应图床。

图片和 Markdown 都需要随 Git 提交。仅在本地文件夹中增加图片，不会让线上页面自动更新。

## 6. 预览与发布

运行开发服务器：

```powershell
pnpm.cmd dev
```

根据终端提示打开本地地址，例如 `http://localhost:4321/weekly/`。草稿不会显示在公开页面中；需要检查新周报页面时，可以在本地暂时设为 `draft: false`。如果尚未准备发布，在提交前改回 `true`。

确认可以发布后，把新文件改为：

```yaml
draft: false
```

执行构建检查，确认没有字段错误、重复周报或 Markdown 问题：

```powershell
pnpm.cmd build
pnpm.cmd preview
```

假设文件为 `src/content/weekly/2026-10-12.md`，详情地址就是：

```text
/weekly/2026-10-12/
```

URL 由文件名决定，修改 `title` 或 `weekOf` 不会自动修改文件名。发布后建议保留文件名，避免已分享链接失效。

提交并推送到正式部署分支：

```powershell
git add src/content/weekly/2026-10-12.md
git commit -m "发布 2026-10-12 周报"
git push origin HEAD:new--blog
```

如果添加了图片，在 `git commit` 前再执行：

```powershell
git add public/images/weekly/2026-10-12/
```

项目已有 GitHub Pages Workflow，推送至 `new--blog` 后会构建并部署。在 GitHub 仓库的 **Actions** 页面确认最新运行成功，再访问 `https://null0x0f.github.io/weekly/`。本地构建成功只说明本地可以生成页面，线上要等待部署完成。

这个站点是静态网站，不会在服务器运行时扫描 Markdown，也没有在线上传或定时发布服务。把 `publishedAt` 写成未来日期不会延迟发布：只要 `draft: false` 并完成部署，内容就会公开。需要等到某一天发布时，先保持草稿，到时修改并重新提交部署。

## 7. 搜索与内容更新

已公开周报会进入站内搜索，结果标为“周报”。可以用标题、摘要、标签、周次或“周报”查找；目前不会检索完整正文。

周报归档还提供本页关键词搜索和年份筛选，年份按 `weekOf` 所属日历年计算；无匹配时可清除条件重新显示全部周报。详情页提供桌面目录、手机端折叠目录、返回归档和前后期导航，前后期按记录周期排列。

修改周报后，重新构建、提交和部署即可更新首页最新一期、归档、详情和搜索索引。设置 `updatedAt` 可以记录修改时间；排序仍取决于 `weekOf`，不会因为修改旧周报而把它放到最新一期。

## 8. 常见问题

### 只有模板，为什么周报列表是空的？

模板明确设置为草稿，这是初始状态。复制模板、填写真实内容并将新文件改为 `draft: false` 后，才会生成正式周报。

### weekOf 报错

先检查日期格式，再确认是否为周一。`2026-10-12` 是周一；`2026-10-18` 是周日，只能作为这个示例周的结束日期或发布日期，不能作为 `weekOf`。

### 构建提示同一周有多篇公开周报

查找 `src/content/weekly/` 中使用同一 `weekOf` 的文件。同一周保留一篇公开周报，把其他文件改为 `draft: true`，或合并到已有周报后再构建。

### 改了发布日期，但列表顺序没变

列表和首页最新一期按 `weekOf` 排序，`publishedAt` 只记录发布日期。补写往期周报不会挤掉最新一周。

### 本地正常，线上没有更新

确认文件已提交，推送目标为远端 `new--blog`，并查看 GitHub Actions 最新一次构建及部署是否成功。草稿不会出现在公开站点；仅修改文件或运行 `pnpm dev` 都不会自动发布。

### 图片只在本地显示

确认图片已提交到 `public/images/weekly/`，链接以 `/images/weekly/` 开头，文件名大小写一致，且最新部署成功。不要把图片只放进本地 `dist/`。

更多站点环境、GitHub Pages 与云服务器部署说明见 [README](../README.md)。
