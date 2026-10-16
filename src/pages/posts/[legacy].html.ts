import type { APIRoute, GetStaticPaths } from "astro";

const legacyPosts = [
  { legacy: "1db60101", destination: "/blog/operating-system/" },
  { legacy: "d99aa42e", destination: "/blog/cpp-notes/" }
];

export const prerender = true;

export const getStaticPaths = (() => legacyPosts.map(({ legacy, destination }) => ({
  params: { legacy },
  props: { destination }
}))) satisfies GetStaticPaths;

// 静态 HTML endpoint 会生成原来的 .html 文件名，适用于 GitHub Pages。
export const GET: APIRoute = ({ props }) => {
  const destination = props.destination as string;
  return new Response(`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>文章已迁移 — Jackie Null</title>
    <link rel="canonical" href="${destination}" />
    <script>location.replace(${JSON.stringify(destination)} + location.search + location.hash);</script>
    <noscript><meta http-equiv="refresh" content="0;url=${destination}" /></noscript>
  </head>
  <body>
    <p>文章已迁移至新博客。<a href="${destination}">前往新版文章</a></p>
  </body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
