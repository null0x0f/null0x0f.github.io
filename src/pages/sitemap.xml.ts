import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { canonicalUrl } from "@/lib/site";

export const prerender = true;

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);

export const GET: APIRoute = async ({ site }) => {
  const [posts, weekly] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    getCollection("weekly", ({ data }) => !data.draft),
  ]);
  const pages: { path: string; updatedAt?: Date }[] = [
    { path: "/" }, { path: "/blog/" }, { path: "/weekly/" }, { path: "/about/" },
    ...posts.map(({ id, data }) => ({ path: `/blog/${id}/`, updatedAt: data.updatedAt ?? data.publishedAt })),
    ...weekly.map(({ id, data }) => ({ path: `/weekly/${id}/`, updatedAt: data.updatedAt ?? data.publishedAt })),
  ];
  const entries = pages.map(({ path, updatedAt }) => `<url><loc>${escapeXml(canonicalUrl(path, site))}</loc>${updatedAt ? `<lastmod>${updatedAt.toISOString()}</lastmod>` : ""}</url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
