import { z } from "zod";

const localized = z.union([
  z.string().min(1),
  z.object({ ko: z.string().min(1), en: z.string().min(1).optional() }),
]);

const keywords = z.array(z.string().min(1)).length(3);

export const activitySchema = z.object({
  type: z.enum(["presentation", "retrospective"]),
  date: z.iso.date(),
  status: z.enum(["done", "upcoming"]).default("done"),
  session: z.number().int().positive().optional(),
  presentation: z.number().int().positive().optional(),
  title: localized,
  description: localized.optional(),
  keywords,
  speakers: z.array(z.string()).default([]),
  author: z.union([localized, z.object({ group: z.literal("core") })]).optional(),
  thumbnail: z.string().optional(),
});

export const memberSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "lowercase-kebab"),
  name: localized,
  role: z.string().optional(),
  major: localized,
  photo: z.string().optional(),
  links: z
    .object({
      github: z.url().optional(),
      linkedin: z.url().optional(),
      website: z.url().optional(),
    })
    .refine((l) => Object.values(l).some(Boolean), "at least one link"),
  keywords,
  description: localized,
});

export const memberListSchema = z.array(memberSchema);

export type ActivityMeta = z.infer<typeof activitySchema>;
export type MemberData = z.infer<typeof memberSchema>;

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`[content] ${file}\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
