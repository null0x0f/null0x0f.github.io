import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { isWeekStart } from "./lib/weekly-dates";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

const weekly = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/weekly" }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    weekOf: z.string().refine(isWeekStart, "weekOf 必须是有效的周一日期，格式为 YYYY-MM-DD"),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog, weekly };
