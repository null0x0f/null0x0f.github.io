import { getCollection } from "astro:content";
export async function GET() {
  const posts = await getCollection("blog");
  const items = posts.filter(({ data }) => !data.draft).map(({ id, data }) => ({
      title: data.title,
      type: "文章",
      kind: "blog",
      href: `/blog/${id}`,
      description: data.description,
      meta: data.tags.join(" · "),
      sortAt: data.publishedAt.valueOf()
    })).sort((a, b) => b.sortAt - a.sortAt).map(({ sortAt: _, ...item }) => item);
  return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
