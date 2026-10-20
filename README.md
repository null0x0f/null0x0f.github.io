# Jackie Null 技术博客

这是一个基于 Astro 的个人技术博客，内容以 Markdown 文件为中心，主要记录 C++、Qt、Embedded、Modbus、CAN、RS485、工业软件和上位机开发经验。

当前产品范围：

- 首页：个人介绍、最新文章、周报入口与最新一期、GitHub 贡献活动
- Blog：文章归档、标签筛选和站内搜索
- Weekly / 周报：独立的周报归档、日期范围、ISO 周次和周报详情
- Article：Markdown 文章详情、目录、代码高亮和阅读进度
- About：个人介绍和技术方向

Projects 与 Notes 页面已经从当前站点移除。仓库中的 `src/content/projects/` 和 `src/content/notes/` 暂时保留为未发布素材，不会参与构建，也不会生成页面。

## 技术栈

- Astro 5：静态站点生成
- TypeScript：Astro 配置、组件和内容类型检查
- Markdown / MDX：文章格式
- Astro Content Collections：Blog 与 Weekly frontmatter 校验和类型生成
- Shiki：代码块语法高亮
- 原生 CSS：响应式布局、深色模式和视觉系统
- 原生浏览器 API：主题切换、搜索、筛选、目录高亮、代码复制和返回顶部
- pnpm：依赖安装和构建

站点是静态输出模式。构建完成后，`dist/` 是可以直接交给 Nginx、Caddy、对象存储或 CDN 的静态文件，不需要数据库，也不需要 Node.js 常驻运行。

## 环境要求

推荐使用：

- Node.js 24，与 GitHub Actions 构建环境保持一致
- pnpm 11.25.0，与 `package.json` 的 `packageManager` 字段保持一致
- Git

pnpm 11 要求 Node.js 至少为 22.13；本项目统一推荐 Node.js 24。不要继续沿用旧版文档中的 Node.js 20 / pnpm 9 环境。

检查版本：

```bash
node --version
pnpm --version
git --version
```

如果 PowerShell 提示 `pnpm` 或 `npm` 不是命令，先确认 Node.js 已加入 PATH。Windows PowerShell 还可能因为执行策略禁止 `npm.ps1`，此时可以使用：

```powershell
npm.cmd --version
npm.cmd install --global pnpm@11.25.0
pnpm.cmd --version
```

如果 PowerShell 也阻止运行 `pnpm.ps1`，后续命令用 `pnpm.cmd install`、`pnpm.cmd dev` 和 `pnpm.cmd build`。

也可以使用 Corepack：

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm --version
```

## 本地开发

第一次下载项目：

```bash
git clone --branch new--blog https://github.com/null0x0f/null0x0f.github.io.git blog-github
cd blog-github
pnpm install --frozen-lockfile
```

启动开发服务器：

```bash
pnpm dev
```

默认地址：<http://localhost:4321>

如果 4321 端口被占用，Astro 会自动尝试下一个端口，以终端显示的地址为准。

生产构建和本地预览：

```bash
pnpm build
pnpm preview
```

`pnpm build` 会依次执行 `astro check` 和 `astro build`。提交代码前建议至少运行一次完整构建。

## 目录结构

```text
.
├── .github/workflows/deploy.yml  # 推送 new--blog 后构建并部署 GitHub Pages
├── docs/
│   ├── weekly-writing.md         # 周报写作、发布与排错说明
│   └── legacy-article-migration.md
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HomeHero.astro
│   │   └── GitHubContributions.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── content/
│   │   ├── blog/                 # 技术文章
│   │   ├── weekly/               # 周报，支持 Markdown / MDX
│   │   │   └── _template.md      # 周报模板，draft: true，不公开
│   │   ├── projects/             # 暂存素材，不参与当前构建
│   │   └── notes/                # 暂存素材，不参与当前构建
│   ├── content.config.ts         # 注册 blog 与 weekly 集合
│   └── pages/
│       ├── index.astro           # 首页
│       ├── about.astro            # About
│       ├── blog/index.astro       # Blog 归档
│       ├── blog/[...slug].astro   # Article 详情
│       ├── weekly/index.astro     # 周报归档
│       ├── weekly/[...slug].astro # 周报详情
│       └── search-index.json.ts   # 公开文章与周报的搜索索引
├── public/
│   ├── styles.css
│   ├── weekly.css                 # 周报布局、归档及响应式样式
│   ├── reading.css                # 文章与周报共用的正文阅读样式
│   ├── app.js
│   ├── search-utils.js            # 全文匹配、排序与命中片段
│   ├── home-motion.js
│   ├── github-contributions.js
│   └── images/
│       ├── blog/                 # 文章图片
│       └── weekly/               # 周报图片，按需创建
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml           # esbuild、sharp 构建许可
├── tsconfig.json
└── README.md
```

不要提交以下自动生成目录：

```text
node_modules/
dist/
.astro/
.pnpm-store/
```

## 新增 Blog 文章

直接在 `src/content/blog/` 下新建 `.md` 或 `.mdx` 文件。文件名会成为 URL 的一部分，建议使用英文小写和连字符，例如：

```text
src/content/blog/qt-thread-safe-signal.md
```

最小 frontmatter：

```md
---
title: Qt 线程安全信号与槽
description: 记录跨线程通信中的连接类型、生命周期和常见误区。
publishedAt: 2026-09-30
tags: [Qt, C++]
---

文章正文写在这里。
```

完整字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | 字符串 | 是 | 文章标题 |
| `description` | 字符串 | 是 | Blog 列表和页面 SEO 摘要 |
| `publishedAt` | 日期 | 是 | 推荐使用 `YYYY-MM-DD` |
| `updatedAt` | 日期 | 否 | 最后修改日期 |
| `tags` | 字符串数组 | 否 | 例如 `[Qt, C++, Embedded]`，默认空数组 |
| `draft` | 布尔值 | 否 | `true` 时不生成公开文章，默认 `false` |
| `featured` | 布尔值 | 否 | 预留精选标记，默认 `false` |

文章 URL 由文件名生成：

```text
src/content/blog/qt-thread-safe-signal.md
        ↓
/blog/qt-thread-safe-signal/
```

新文章完成后：

```bash
pnpm build
git add src/content/blog/qt-thread-safe-signal.md
git commit -m "新增 Qt 线程安全文章"
git push origin HEAD:new--blog
```

开发服务器运行时保存 Markdown 后通常会自动刷新；如果内容类型缓存没有及时更新，停止并重新运行 `pnpm dev`。

## 新增周报

周报使用独立目录 `src/content/weekly/`，归档入口为 `/weekly/`。它与 Blog 文章分开归档，共用站内搜索和 Markdown 阅读体验。

推荐先复制模板，在项目根目录运行：

```powershell
Copy-Item -LiteralPath "src/content/weekly/_template.md" -Destination "src/content/weekly/2026-10-12.md"
```

然后修改标题、摘要、日期和正文，将复制出来的文件设为 `draft: false`。`weekOf` 必须是该周周一，例如 `2026-10-12`；系统自动显示对应周日 `2026-10-18` 和 ISO 周次。模板本身保持 `draft: true`。

每个 `weekOf` 只允许一篇公开周报，重复时构建会报错。未来的 `publishedAt` 不会自动延迟发布：需要暂存时使用 `draft: true`。初始模板不会出现在首页、周报归档、搜索或公开详情页中。

完整字段、图片规范、GitHub Pages 发布步骤、跨年周说明和常见错误见 [周报写作与发布指南](docs/weekly-writing.md)。

## Markdown 写作规范

支持标准 Markdown：标题、列表、引用、链接、图片、表格、行内代码和 fenced code block。

代码块建议写明语言：

````md
```cpp
auto result = readRegister(address);
```
````

常用语言标识：`cpp`、`c`、`bash`、`powershell`、`python`、`javascript`、`typescript`、`json`、`yaml`、`cmake`。

文章中的二级标题会生成目录和锚点。文章发布后尽量不要随意修改标题文字，否则外部链接可能失效。

站内文章链接示例：

```md
[阅读 250ETS 总结](/blog/250ets)
```

普通 Markdown 足够时优先使用 `.md`。只有需要 Astro 组件或 JSX 表达式时才使用 `.mdx`。

## 图片和静态资源

文章图片建议放到：

```text
public/images/blog/
```

Markdown 使用以 `/` 开头的公共路径：

```md
![串口调试界面](/images/blog/serial-monitor.webp)
```

也可以使用对象存储或 CDN：

```md
![设备照片](https://cdn.example.com/blog/device-photo.webp)
```

图片文件名建议使用英文、数字和连字符。不要把图片放进 `dist/`，不要提交密钥、内网地址、设备序列号或其他敏感信息。Linux 服务器区分文件名大小写。

当前写作流程统一使用 `public/` 下的公共图片路径：Blog 图片放在 `public/images/blog/`，周报图片放在 `public/images/weekly/YYYY-MM-DD/`。Markdown 链接不要带 `public/` 前缀。

## Jump 漫画背景

全站背景组件位于 `src/components/MangaBackground.astro`，接入现有橙黄漫画 UI，包含浅色、深色遮罩和手机端裁切设置。中间阅读区的遮罩较强，边缘保留漫画画面。

当前使用 `public/images/bleach.jpg` 作为全站背景，对应访问路径 `/images/bleach.jpg`。这是一张竖版《死神》群像：桌面端保持图片比例、按视口高度靠右显示，手机端居中裁切。浅色模式使用正片叠底融入米色背景，深色模式使用暗色遮罩，保留中间区域的阅读对比度。

更换图片时，可以直接替换 `public/images/bleach.jpg`，或修改 `src/components/MangaBackground.astro` 中的 `src` 路径。背景强度通过组件内的 `--edge-veil`（边缘遮罩）、`--reading-veil`（阅读区遮罩）和 `--art-opacity`（图片透明度）调整；修改后重新执行 `pnpm build` 并部署 `dist/`。备用生成提示词保存在 `output/imagegen/jump-manga.prompt.txt`，当前背景不需要 API Key。

## 右下角宠物：月薪喵

全站右下角显示月薪喵，使用本地透明 WebP 帧图，不需要 API、后端服务或额外动画库。待机时偶尔眨眼，鼠标移上去会挥手，点击后会有动作和简短回应；键盘也可以操作。点击宠物右上角的 `−` 可以收起，右下角保留“喵”按钮供再次展开。收起状态只保存在当前浏览器。

手机端自动缩小宠物，原有“返回顶部”按钮移到宠物左侧。打开站内搜索、切换到后台标签页或启用系统“减少动态效果”时，会隐藏或暂停相应动画，避免影响阅读。

相关文件：

- `src/components/BlogPet.astro`：显示结构、位置、尺寸及深浅色样式。
- `src/data/pet.json`：从提供的宠物配置复制，包含名称、标识和帧图文件名。
- `public/pets/yuexinmiao/spritesheet.webp`：宠物动画帧图，随站点一起部署。
- `public/pet.js`：帧动画、点击回应、收起与展开等行为。

原图是 1536 × 1872，按 8 列 × 9 行排列，单帧 192 × 208。当前使用第 0 行的 6 帧待机、第 3 行的 4 帧挥手和第 4 行的 5 帧点击动作。替换帧图时，如果网格或动作帧数发生变化，需要同步修改 `public/pet.js` 的 `actions` 与组件的背景尺寸。显示大小在组件中通过 `--blog-pet-width` / `--blog-pet-height` 调整，两者应保持 192:208 的比例。

宠物已接入 `BaseLayout.astro`，首页、文章、周报和 About 都会显示。需要移除时，删除布局中的 `<BlogPet />` 及对应导入即可。修改后仍需构建并部署，线上才会更新。

## 搜索、主题和交互

`src/pages/search-index.json.ts` 在构建时读取公开 Blog 文章和周报，生成 `/search-index.json`。搜索范围包括标题、摘要、标签、周次、内容类型和完整正文，代码块中的函数名、错误信息、协议关键词也可以检索。正文从渲染后的内容中提取，不把 Markdown 标记直接展示给读者；`draft: true` 的内容不会加入索引。

点击导航搜索按钮或按 `Cmd/Ctrl + K` 后才加载索引，不需要数据库、后端搜索服务或 API Key。搜索不区分大小写；多个词用空格分隔时，结果需要同时包含这些词。标题和摘要命中优先，正文命中会显示附近片段并高亮关键词。示例：输入 `PINS_DRV_WritePin` 查找具体函数，输入 `std::` 查找 C++ 代码，输入 `Modbus 超时` 查找同时包含两个词的内容。这里是关键词检索，不提供拼写纠错或语义搜索。

新增或修改 Markdown 后，需要重新构建并部署，线上搜索索引才会更新。长文较多时索引文件会随内容增长，目前采用打开搜索后按需下载、同页复用的方式。网络加载失败会显示重试入口。

`public/app.js` 负责：

- `Cmd/Ctrl + K` 打开搜索
- Blog 标签筛选
- 全文关键词高亮、相关度排序和正文命中片段
- 方向键选择、回车打开
- 最近访问文章与周报记录
- 深色 / 浅色模式
- 文章目录高亮
- 代码复制
- 阅读进度和返回顶部
- 页面区块滚动显现

`public/styles.css` 负责全站主题、响应式断点和页面间距；`public/weekly.css` 负责周报布局；最后加载的 `public/reading.css` 统一管理文章与周报正文。代码块、引用、表格使用低对比度背景和细边框，没有硬阴影；正文图片和链接悬停时不移动。宽表格和长代码在各自区域内横向滚动，保留代码高亮与复制按钮。漫画背景和右下角宠物由原组件独立控制。

当前不提供 RSS 订阅，页脚已移除 RSS 入口；无需配置 `/rss.xml`。

首页 GitHub 贡献日历由 `src/components/GitHubContributions.astro` 输出结构，`public/github-contributions.js` 在浏览器端读取公开数据。当前用户名配置在 `src/pages/index.astro`：

```astro
<GitHubContributions username="null0x0f" />
```

贡献数据使用公开接口，不需要 GitHub Token。页面会先显示浏览器中的最近缓存，同时在后台检查新数据；点击贡献区右上角的刷新按钮可以手动检查。页面重新变为可见且距离上次检查超过 5 分钟时也会再次请求。GitHub 官方统计和第三方接口 CDN 本身可能存在数分钟到数十分钟延迟，因此这里是近实时显示，而不是秒级实时数据。接口不可用时会保留最近缓存，首页其他内容仍然可以正常显示。

## 分享预览与网站基础配置

站点地址统一读取 `astro.config.mjs` 的 `site`，当前为 `https://null0x0f.github.io`。以后换成云服务器上的独立域名时，将它改为实际的 HTTPS 站点地址，再重新构建和部署。不要填写本地开发地址或 GitHub 仓库地址。

站点名、作者、简介、GitHub 主页和默认分享图路径集中在 `src/lib/site.ts`。通用组件 `src/components/SEO.astro` 会给每个页面输出规范链接（canonical）、Open Graph 和 Twitter Card；文章及周报还会输出发布日期、修改日期、标签和 BlogPosting 结构化数据。标题和摘要来自各页面或 Markdown frontmatter，修改文章的 `title`、`description`、`publishedAt`、`updatedAt`、`tags` 即可同步更新相关元数据。

默认分享图为 `/og/default.png`，构建时用现有图片依赖生成 1200 × 630 的本地 PNG，无需外部图片接口或密钥。图案源码在 `src/pages/og/default.png.ts`；网站图标在 `public/favicon.svg`。目前各页面共用品牌分享图，文章标题、摘要和链接分别对应当前文章。若更换分享图路径，请同时调整 SEO 组件中的格式、尺寸和图片说明，保证文件真实可访问。

另外生成：

- `/sitemap.xml`：首页、Blog、周报、About 和已公开文章/周报；不包含草稿、旧地址跳转页和搜索索引。
- `/robots.txt`：允许搜索引擎抓取，并指向正式域名下的站点地图。它不承担内容保密作用，未公开文章请继续使用 `draft: true`。

部署后可以打开 `/og/default.png`、`/sitemap.xml` 和 `/robots.txt` 检查是否可访问，并查看文章页面源代码里的 `og:title`、`og:image`、`canonical` 是否正确。聊天或社交平台有各自的抓取规则和缓存，配置更新后可能需要等待平台刷新；本地预览页无法供外部平台抓取。

## 部署到 GitHub Pages

正式仓库为 `null0x0f/null0x0f.github.io`，站点地址为 <https://null0x0f.github.io/>。仓库已有 `.github/workflows/deploy.yml`，推送到远端 `new--blog` 分支后，GitHub Actions 会安装依赖、执行 `pnpm build`，再将 `dist/` 作为 Pages 构建产物发布。

首次启用时，在仓库 **Settings → Pages → Build and deployment** 中，将 **Source** 设为 **GitHub Actions**。如果 `github-pages` 环境配置了部署分支限制，需要允许 `new--blog`。

提交内容并发布：

```bash
pnpm build
git add src/content/weekly/2026-10-12.md
git commit -m "发布 2026-10-12 周报"
git push origin HEAD:new--blog
```

如有新图片，需要同时 `git add public/images/weekly/2026-10-12/`。最后在仓库 **Actions** 页面查看构建与部署结果。上述推送命令将当前提交发送到远端 `new--blog`，因此本地分支叫 `master` 也可以使用；若远端存在本地没有的更新，应先同步并解决冲突，不要直接强制推送。

`new--blog` 是部署源码分支，不是网址的一部分。当前属于用户主页仓库，`astro.config.mjs` 中的 `site` 为 `https://null0x0f.github.io`，无需设置 `base: "/new--blog"`。

提交源文件、锁文件、`pnpm-workspace.yaml` 和 Workflow 即可，不需要提交 `dist/` 或 `node_modules/`。线上不会运行 Node.js，新增或修改 Markdown 后必须重新构建和部署才会更新。

## 部署到 Ubuntu 云服务器

### 服务器直接构建

服务器安装 Node.js、pnpm、Git 和 Nginx 后：

```bash
git clone <你的 GitHub 仓库地址>
cd blog
pnpm install --frozen-lockfile
pnpm build
```

Nginx 的站点根目录指向项目的 `dist/`：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/jackie-null-blog/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

以后更新文章：

```bash
git pull
pnpm install --frozen-lockfile
pnpm build
sudo systemctl reload nginx
```

### 本地或 GitHub Actions 构建

也可以在本地执行 `pnpm build`，然后只上传 `dist/` 到服务器。当前仓库的自动部署 Workflow 用于 GitHub Pages，不会自动更新 Ubuntu 云服务器；若继续使用云服务器，需要手动上传，或单独配置 SSH、对象存储等部署流程。

正式上线建议使用 HTTPS，例如：

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Git 提交清单

应提交：

```text
src/
public/
docs/
.github/workflows/
astro.config.mjs
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.json
.gitignore
README.md
```

不要提交：

```text
node_modules/
dist/
.astro/
.pnpm-store/
```

`pnpm-lock.yaml` 必须提交，以保证本地、CI 和云服务器使用一致的依赖版本。新增文章时通常只需要提交 Markdown 和对应图片：

```bash
git add src/content/blog/my-article.md public/images/blog/my-image.webp
git commit -m "新增技术文章"
git push origin HEAD:new--blog
```

## 从旧博客迁移文章

已迁移的两篇旧站文章：

| 原文 | 新站路径 | 内容与图片 |
| --- | --- | --- |
| OPERATING SYSTEM | `/blog/operating-system/` | 正文、100 个非空标题和 17 个代码块已保留，12 张图片已保存到本地；另有 41 张插图和 1 个图片链接暂不可用 |
| c plus plus | `/blog/cpp-notes/` | 正文、81 个非空标题、41 个代码块和 9 张图片已迁移 |

文章源文件分别是 `src/content/blog/operating-system.md` 和 `src/content/blog/cpp-notes.md`，图片放在 `public/images/blog/` 对应子目录。两篇文章会自动进入归档和搜索，原标题、日期、标签以及有效的旧标题锚点均保留。

`/posts/1db60101.html` 和 `/posts/d99aa42e.html` 会生成静态跳转页面。部署到旧博客原来的根域名后，旧分享链接可跳转到新文章，并保留查询参数与标题锚点。GitHub Pages 使用静态 HTML 跳转，不是服务器 301。

操作系统文章的外链图床当前返回 404/403，公开仓库和本机均未找到备份；缺图位置保留原图说明与链接，没有用其他图片替代。具体来源和缺失清单见 [旧博客文章迁移记录](docs/legacy-article-migration.md)。

旧博客文章可以继续迁移到 `src/content/blog/`。每篇文章需要：

1. 整理为 Markdown 或 MDX。
2. 补充 `title`、`description`、`publishedAt` 和 `tags`。
3. 把图片移动到 `public/images/blog/`，并修正 Markdown 图片路径。
4. 检查旧站内部链接、HTML 片段、代码块和特殊插件语法。
5. 运行 `pnpm build`，修复 frontmatter 或 Markdown 错误。

文章较多时，可以先迁移 5 到 10 篇不同类型的文章，确认转换规则后再批量迁移。迁移完成后建议为旧 URL 配置 301 重定向。

## 常见问题

### 新建 Markdown 后文章没有出现

技术文章放在 `src/content/blog/`，周报放在 `src/content/weekly/`。确认扩展名是 `.md` 或 `.mdx`、frontmatter 字段完整，且 `draft` 不是 `true`，并重新运行 `pnpm dev` 或 `pnpm build`。线上还需确认最新一次 GitHub Actions 部署成功。

### 周报提示 weekOf 无效或出现重复周报

`weekOf` 必须是有效的 `YYYY-MM-DD` 日期，且当天为周一。例如 `2026-10-12` 有效，`2026-10-18` 是周日，不能作为 `weekOf`。同一周只保留一篇 `draft: false` 的周报；修改已有周报，或把重复文件保留为草稿。详细规则见 [周报写作与发布指南](docs/weekly-writing.md)。

### 构建提示 frontmatter 错误

常见原因包括：日期无效、必填字段缺失、数字写成字符串、数组写成普通文本、YAML 特殊字符未加引号，或代码块没有闭合。

### 图片显示不出来

确认图片位于 `public/` 下，并使用 `/images/...` 形式的公共路径。不要使用 `D:\\images\\example.png` 这类本机路径。Linux 服务器严格区分文件名大小写。

### 部署后刷新文章页返回 404

确认 Nginx 的 `root` 指向 `dist/`，并且 `location /` 中包含：

```nginx
try_files $uri $uri/ $uri.html =404;
```

### PowerShell 中 npm 被禁止执行

优先使用 `.cmd` 入口：

```powershell
npm.cmd --version
npm.cmd install --global pnpm@11.25.0
```

或者调整当前用户的执行策略：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

修改执行策略前请确认这是你自己的开发环境，并遵循公司设备安全策略。

## 常用命令

```bash
pnpm install              # 安装依赖
pnpm dev                 # 启动开发服务器
pnpm check               # 只运行 Astro 类型检查
pnpm build               # 类型检查并生成 dist/
pnpm preview             # 预览 dist/
node --check public/app.js
git diff --check
```
