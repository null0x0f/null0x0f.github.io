import { getCollection } from "astro:content";

export async function getPublishedWeekly() {
  const entries = await getCollection("weekly", ({ data }) => !data.draft);
  const weeks = new Set<string>();
  for (const entry of entries) {
    if (weeks.has(entry.data.weekOf)) {
      throw new Error(`周报 ${entry.id} 的 weekOf (${entry.data.weekOf}) 与另一篇公开周报重复。每周只发布一篇周报，其余请设为 draft: true。`);
    }
    weeks.add(entry.data.weekOf);
  }
  return entries.sort((a, b) => b.data.weekOf.localeCompare(a.data.weekOf));
}
