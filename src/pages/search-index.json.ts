import { getCollection, render, type CollectionEntry } from "astro:content";
import { getPublishedWeekly } from "@/lib/weekly";
import { getWeekInfo } from "@/lib/weekly-dates";
import { htmlToSearchText } from "@/lib/search-content";

async function getBody(entry: CollectionEntry<"blog" | "weekly">): Promise<string> {
  if (entry.rendered?.html !== undefined) return htmlToSearchText(entry.rendered.html);

  // MDX is rendered on demand by Astro. Index its displayed content rather
  // than imports, JSX attributes or expressions from the source file.
  const [{ experimental_AstroContainer }, { default: mdxRenderer }] = await Promise.all([
    import("astro/container"), import("@astrojs/mdx/server.js")
  ]);
  const container = await experimental_AstroContainer.create();
  container.addServerRenderer({ name: mdxRenderer.name, renderer: mdxRenderer });
  const { Content } = await render(entry);
  return htmlToSearchText(await container.renderToString(Content));
}

export async function GET() {
  const [posts, weekly] = await Promise.all([getCollection("blog", ({ data }) => !data.draft), getPublishedWeekly()]);
  const items = await Promise.all([...posts.map(async (entry) => {
    const { id, data } = entry;
    return {
      title: data.title,
      type: "文章",
      kind: "blog",
      href: `/blog/${id}`,
      description: data.description,
      meta: data.tags.join(" · "),
      body: await getBody(entry),
      sortAt: data.publishedAt.valueOf()
    };
  }), ...weekly.map(async (entry) => {
      const { id, data } = entry;
      const week = getWeekInfo(data.weekOf);
      return {
        title: data.title,
        type: "周报",
        kind: "weekly",
        href: `/weekly/${id}/`,
        description: data.description,
        meta: ["周报", week.label, week.range, ...data.tags].join(" · "),
        body: await getBody(entry),
        sortAt: data.publishedAt.valueOf()
      };
    })]);
  const sorted = items.sort((a, b) => b.sortAt - a.sortAt).map(({ sortAt: _, ...item }) => item);
  return new Response(JSON.stringify(sorted), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
