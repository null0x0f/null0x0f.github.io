# 旧博客文章迁移记录

这两篇文章从旧 Hexo 站点的公开 HTML 还原为 Markdown；保留原标题、发表与更新时间、标签、正文、标题层级和示例代码，代码块去除旧主题行号并使用新站 Shiki 高亮。原文中的历史写法与技术表述未作改写。

| 旧地址 | 新地址 | Markdown | 图片情况 |
| --- | --- | --- | --- |
| [1db60101](https://null0x0f.github.io/posts/1db60101.html) | /blog/operating-system/ | src/content/blog/operating-system.md | 12 张已本地保存，42 个图片资源暂不可用 |
| [d99aa42e](https://null0x0f.github.io/posts/d99aa42e.html) | /blog/cpp-notes/ | src/content/blog/cpp-notes.md | 9 张已本地保存，0 个图片资源暂不可用 |

旧地址通过 `src/pages/posts/[legacy].html.ts` 生成兼容跳转；部署到原来的根域名后才会接管旧链接。跳转保留查询参数和标题锚点，正文中保留了必要的旧锚点别名。文章会自动进入 Blog 列表和站内搜索。

已取得的图片原样保存到 `public/images/blog/operating-system/` 和 `public/images/blog/cpp-notes/`；正文使用 `/images/blog/...` 公共路径，不依赖旧站的 `/img/` 目录。

## 暂不可恢复的原图

操作系统文章有 41 张插图和 1 个指向图片的链接无法下载：图床分别返回 404 或 403。插图位置保留说明和原始链接，FCFS 图片链接按原文保留。读者可见的“原图暂不可用”仅表示这次迁移无法取得该资源。若以后找到原图，将其放入文章图片目录，再把对应标记替换成 Markdown 图片即可。用户目前没有本地备份，因此这篇文章的图片尚未完整恢复。

| 图片说明 | 原地址 | 检查结果 |
| --- | --- | --- |
| 进程控制块 | https://picss.sunbangyan.cn/2023/10/25/1f4a76b270a570a1fafde25e28d23c5d.png | HTTP 404 |
| 进程队列 | https://picss.sunbangyan.cn/2023/10/25/154eafa4d3eeb9a76df7acf0ddfd5cce.png | HTTP 404 |
| M1 | https://picdl.sunbangyan.cn/2023/10/25/53f7356a09e0b12b31f9f21217b3fe81.png | HTTP 404 |
| 进程调度 | https://picdl.sunbangyan.cn/2023/10/25/2536def0751a685f04a0040a661c875b.png | HTTP 404 |
| 多线程实验1 | https://picdl.sunbangyan.cn/2023/10/25/63a34230ec710dbfa6e5e6d9e255e2f5.png | HTTP 404 |
| 多线程实验2 | https://picdm.sunbangyan.cn/2023/10/25/64200993c7f3f8794c3082b79d5ac03a.png | HTTP 404 |
| 多核编程 | https://picdm.sunbangyan.cn/2023/10/25/3f91e5b7d4c752888775f9d41a9d8e09.png | HTTP 404 |
| SRTF | https://picss.sunbangyan.cn/2023/10/25/3e3665cb41aab8e72a2131fcc3c81218.png | HTTP 404 |
| RR | https://picst.sunbangyan.cn/2023/10/25/604752a7e9fb369d89b8666efe0779ac.png | HTTP 404 |
| 时间片轮转 | https://picst.sunbangyan.cn/2023/10/25/e535d5bb063979e8e9fba19535c9bc08.png | HTTP 404 |
| 调度策略 | https://picdl.sunbangyan.cn/2023/10/25/da5eba22e056122021481d5ca09b0012.png | HTTP 404 |
| 异步 | https://picdm.sunbangyan.cn/2023/10/25/90027f68c07a7b470442a8ce0b301c0c.png | HTTP 404 |
| 调度算法 | https://picst.sunbangyan.cn/2023/10/25/31b6cbf816e5b0b67b366229c15c4c02.png | HTTP 404 |
| 调度 | https://picdm.sunbangyan.cn/2023/10/25/703ba641dcf7aa8c83344cc844549b2d.png | HTTP 404 |
| 异步2 | https://picss.sunbangyan.cn/2023/10/25/655a3b6e19710bcc25798854cd686511.png | HTTP 404 |
| 信号量lab | https://picss.sunbangyan.cn/2023/10/25/9874e6d4ae9feb20ee8c6c4e593618d5.png | HTTP 404 |
| PC2.png | https://img1.imgtp.com/2023/10/16/PIJrUqaY.png | HTTP 403 |
| PC.png | https://img1.imgtp.com/2023/10/16/F8UmYWzZ.png | HTTP 403 |
| pgjz | https://picdm.sunbangyan.cn/2023/10/27/5cb8a1ac6825ff43a5f1ffb925ab3b89.png | HTTP 404 |
| 死锁.png | https://img1.imgtp.com/2023/10/16/flxp00c2.png | HTTP 403 |
| barber.png | https://img1.imgtp.com/2023/10/16/aEb5zmTq.png | HTTP 403 |
| 有界缓冲区.png | https://img1.imgtp.com/2023/10/16/ci5VNhyp.png | HTTP 403 |
| 死锁定理 | https://picdm.sunbangyan.cn/2023/10/27/4932acc5f82b254c5d794d934b827f08.png | HTTP 404 |
| 死锁的解除 | https://picdl.sunbangyan.cn/2023/10/27/0e4cb28af4a49c6052560ac038e4211a.png | HTTP 404 |
| 安全算法.png | https://img1.imgtp.com/2023/10/16/iqYtBTjm.png | HTTP 403 |
| 内存映射 | https://picst.sunbangyan.cn/2023/10/27/03cc6e0b92401362e0bed796f2999354.png | HTTP 404 |
| 高速缓存 | https://picss.sunbangyan.cn/2023/10/27/e56d6d27aeea32635a1e9bf0ce94e7fd.png | HTTP 404 |
| MMU.png | https://img1.imgtp.com/2023/10/16/b8jdC7LY.png | HTTP 403 |
| 可变分区.png | https://img1.imgtp.com/2023/10/16/GplotZod.png | HTTP 403 |
| holes | https://picdl.sunbangyan.cn/2023/10/27/20f62e58fb00656860f2edd4b8986e87.png | HTTP 404 |
| 划分段.png | https://img1.imgtp.com/2023/10/16/uAMieSEY.png | HTTP 403 |
| 地址转换与保护 | https://picss.sunbangyan.cn/2023/10/27/620d3edfeb22dba3ecb576aeb36aafff.png | HTTP 404 |
| 分段硬件 | https://picdm.sunbangyan.cn/2023/10/27/f477668f395297e54dbd1eaa762f2ee5.png | HTTP 404 |
| 分页基本方法 | https://picdm.sunbangyan.cn/2023/10/27/b352d2f1bc6276e8436abd6893c75b16.png | HTTP 404 |
| 16段转换实例.png | https://img1.imgtp.com/2023/10/16/O2GsYxgr.png | HTTP 403 |
| 页号与页内位移 | https://picdl.sunbangyan.cn/2023/10/16/1efe7c7e346cdbb27028c7cf00cc15bc.png | HTTP 404 |
| 分页计算物理地址 | https://picss.sunbangyan.cn/2023/10/16/3a44019437cc1341553a17da9b430d21.jpg | HTTP 404 |
| 分页硬件 | https://picdl.sunbangyan.cn/2023/10/16/c42ddbbac1f8dcee8e4c674568be2063.png | HTTP 404 |
| 保护 | https://picdl.sunbangyan.cn/2023/10/16/ec6d3ce0d142fea6301bbca78ca4a517.png | HTTP 404 |
| TLB.pmg | https://picdl.sunbangyan.cn/2023/10/16/0dae982211442b42f25741652dcaadb9.jpg | HTTP 404 |
| 共享 | https://picss.sunbangyan.cn/2023/10/16/5fb113e261b6da2b05ca9733d75991e5.png | HTTP 404 |
| FCFS（图片链接） | https://picss.sunbangyan.cn/2023/10/25/c55d687b0b29a532649ed3f24fcf4671.png | HTTP 404 |

## 核对结果

- 两篇文章正文按顺序与旧网页比对，除布局空白和明确标记的缺图提示外一致。
- 保留 181 个非空标题及其层级；旧文中一个无文字的空标题不再生成目录项。
- 58 个代码块已逐个核对，代码文字、缩进和内部换行均保留，去除的是旧主题的行号列。
- 21 张可取得的图片与原文件字节一致，并检查了构建产物中的对应文件。
- 旧标题锚点、两条旧地址及查询参数跳转、归档和搜索收录均已检查。
- 桌面与 390px 手机视口已检查，未发现正文横向溢出，已恢复图片均能显示。缺失插图以原图说明和来源链接展示。

## 后续维护

继续编辑上述 Markdown 文件即可。部署前执行 `pnpm build`；GitHub Pages 需要同时发布构建后的文章、`images/blog/` 和 `posts/*.html` 兼容页面。迁移没有发布线上站点，没有修改旧博客仓库，也没有迁移旧主题、评论或阅读量。
