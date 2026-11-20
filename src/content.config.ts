import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: z.string(),
    role: z.string(),
    team: z.string(),
    stack: z.array(z.string()),
    order: z.number(),
    theme: z.enum(['sage', 'lavender', 'ink']),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    notice: z.string().optional(),
    highlights: z.array(z.object({ label: z.string(), text: z.string() })),
  }),
});
export const collections = { projects };
