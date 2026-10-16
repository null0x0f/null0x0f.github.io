# Jackie Null 技术博客

这是一个基于 Astro 的个人技术博客，内容以 Markdown 文件为中心，主要记录 C++、Qt、Embedded、Modbus、CAN、RS485、工业软件和上位机开发经验。

当前产品范围只有：

- 首页：个人介绍、最新文章、GitHub 贡献活动
- Blog：文章归档、标签筛选和站内搜索
- Article：Markdown 文章详情、目录、代码高亮和阅读进度
- About：个人介绍和技术方向

Projects 与 Notes 页面已经从当前站点移除。仓库中的 `src/content/projects/` 和 `src/content/notes/` 暂时保留为未发布素材，不会参与构建，也不会生成页面。

## 技术栈

- Astro 5：静态站点生成
- TypeScript：Astro 配置、组件和内容类型检查
- Markdown / MDX：文章格式
- Astro Content Collections：Blog frontmatter 校验和类型生成
- Shiki：代码块语法高亮
- 原生 CSS：响应式布局、深色模式和视觉系统
- 原生浏览器 API：主题切换、搜索、筛选、目录高亮、代码复制和返回顶部
- pnpm：依赖安装和构建

站点是静态输出模式。构建完成后，`dist/` 是可以直接交给 Nginx、Caddy、对象存储或 CDN 的静态文件，不需要数据库，也不需要 Node.js 常驻运行。

## 环境要求

推荐使用：

- Node.js 20 或更高版本
- pnpm 9 或更高版本
- Git

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
```

也可以使用 Corepack：

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm --version
```

## 本地开发

第一次下载项目：

```bash
git clone <你的 GitHub 仓库地址>
cd blog
pnpm install
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
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HomeHero.astro
│   │   └── GitHubContributions.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── content/
│   │   ├── blog/                 # 当前正式发布的文章
│   │   ├── projects/             # 暂存素材，不参与当前构建
│   │   └── notes/                # 暂存素材，不参与当前构建
│   ├── content.config.ts         # 当前只注册 blog 集合
│   └── pages/
│       ├── index.astro           # 首页
│       ├── about.astro            # About
│       ├── blog/index.astro       # Blog 归档
│       ├── blog/[...slug].astro   # Article 详情
│       └── search-index.json.ts   # Blog 搜索索引
├── public/
│   ├── styles.css
│   ├── app.js
│   ├── home-motion.js
│   ├── github-contributions.js
│   └── images/blog/               # 文章图片
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
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
git push origin main
```

开发服务器运行时保存 Markdown 后通常会自动刷新；如果内容类型缓存没有及时更新，停止并重新运行 `pnpm dev`。

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

当前项目不会自动处理 Markdown 同目录图片。如果需要图片与文章源文件放在一起，需要后续扩展 Astro 的资源处理方式；现在请统一使用 `public/images/blog/`。

## Jump 漫画背景

全站背景组件位于 `src/components/MangaBackground.astro`，接入现有橙黄漫画 UI，包含浅色、深色遮罩和手机端裁切设置。中间阅读区的遮罩较强，边缘保留漫画画面。

当前使用 `public/images/bleach.jpg` 作为全站背景，对应访问路径 `/images/bleach.jpg`。这是一张竖版《死神》群像：桌面端保持图片比例、按视口高度靠右显示，手机端居中裁切。浅色模式使用正片叠底融入米色背景，深色模式使用暗色遮罩，保留中间区域的阅读对比度。

更换图片时，可以直接替换 `public/images/bleach.jpg`，或修改 `src/components/MangaBackground.astro` 中的 `src` 路径。背景强度通过组件内的 `--edge-veil`（边缘遮罩）、`--reading-veil`（阅读区遮罩）和 `--art-opacity`（图片透明度）调整；修改后重新执行 `pnpm build` 并部署 `dist/`。备用生成提示词保存在 `output/imagegen/jump-manga.prompt.txt`，当前背景不需要 API Key。

## 搜索、主题和交互

`src/pages/search-index.json.ts` 在构建时读取公开 Blog 文章并生成 `/search-index.json`。搜索内容包括文章标题、摘要和标签，不需要数据库或后端搜索服务。

`public/app.js` 负责：

- `Cmd/Ctrl + K` 打开搜索
- Blog 标签筛选
- 关键词高亮和相关度排序
- 方向键选择、回车打开
- 最近访问文章记录
- 深色 / 浅色模式
- 文章目录高亮
- 代码复制
- 阅读进度和返回顶部
- 页面区块滚动显现

`public/styles.css` 负责颜色、排版、响应式断点、深色模式和页面间距。修改视觉时优先从这里开始。

首页 GitHub 贡献日历由 `src/components/GitHubContributions.astro` 输出结构，`public/github-contributions.js` 在浏览器端读取公开数据。当前用户名配置在 `src/pages/index.astro`：

```astro
<GitHubContributions username="null0x0f" />
```

贡献数据使用公开接口，不需要 GitHub Token。页面会先显示浏览器中的最近缓存，同时在后台检查新数据；点击贡献区右上角的刷新按钮可以手动检查。页面重新变为可见且距离上次检查超过 5 分钟时也会再次请求。GitHub 官方统计和第三方接口 CDN 本身可能存在数分钟到数十分钟延迟，因此这里是近实时显示，而不是秒级实时数据。接口不可用时会保留最近缓存，首页其他内容仍然可以正常显示。

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

也可以在本地或 GitHub Actions 执行 `pnpm build`，然后只上传 `dist/` 到服务器。当前仓库没有配置自动部署 Workflow；之后如果需要，可以再增加 SSH、对象存储或 CDN 部署流程。

正式上线建议使用 HTTPS，例如：

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Git 提交清单

应提交：

```text
src/
public/
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
git push origin main
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

确认文件位于 `src/content/blog/`，扩展名是 `.md` 或 `.mdx`，frontmatter 字段完整，并重新运行 `pnpm dev` 或 `pnpm build`。

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
