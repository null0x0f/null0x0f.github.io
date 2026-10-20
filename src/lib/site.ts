export const siteInfo = {
  name: "Jackie Null",
  description: "关于 C++、Qt、嵌入式与工业软件的个人技术博客。",
  author: "Jackie Null",
  profile: "https://github.com/null0x0f",
  image: "/og/default.png",
  imageAlt: "Jackie Null — Software & Systems · C++ / Qt / Embedded",
} as const;

export interface ArticleMetadata {
  title: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags?: string[];
}

/** Use Astro's configured production origin even when rendering a local preview. */
export function siteUrl(path: string, site: URL | undefined): URL {
  if (!site) throw new Error("请先在 astro.config.mjs 中配置正式站点的 site 地址。");
  const url = new URL(path, site);
  url.search = "";
  url.hash = "";
  return url;
}

export function canonicalUrl(path: string, site: URL | undefined): string {
  const url = siteUrl(path, site);
  if (!url.pathname.endsWith("/") && !/\.[^/]+$/.test(url.pathname)) url.pathname += "/";
  return url.href;
}
