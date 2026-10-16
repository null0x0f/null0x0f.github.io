import { getCollection } from "astro:content";
import { getPublishedWeekly } from "@/lib/weekly";
import { getWeekInfo } from "@/lib/weekly-dates";
export async function GET() {
  const [posts, weekly] = await Promise.all([getCollection("blog", ({ data }) => !data.draft), getPublishedWeekly()]);
  const items = [...posts.map(({ id, data }) => ({
      title: data.title,
      type: "文章",
      kind: "blog",
      href: `/blog/${id}`,
      description: data.description,
      meta: data.tags.join(" · "),
      sortAt: data.publishedAt.valueOf()
    })), ...weekly.map(({ id, data }) => {
      const week = getWeekInfo(data.weekOf);
      return {
        title: data.title,
        type: "周报",
        kind: "weekly",
        href: `/weekly/${id}/`,
        description: data.description,
        meta: ["周报", week.label, week.range, ...data.tags].join(" · "),
        sortAt: data.publishedAt.valueOf()
      };
    })].sort((a, b) => b.sortAt - a.sortAt).map(({ sortAt: _, ...item }) => item);
  return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
