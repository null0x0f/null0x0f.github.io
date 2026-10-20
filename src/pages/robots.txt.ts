import type { APIRoute } from "astro";
import { siteUrl } from "@/lib/site";

export const prerender = true;

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl("/sitemap.xml", site).href}\n`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
