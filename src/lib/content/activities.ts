import path from "node:path";
import { parse as parseYaml } from "yaml";
import { contentUrl } from "@/lib/routes";
import { compareActivities } from "@/lib/activities";
import { activitiesDir, activityDir, ACTIVITY_PATTERN, listDirs, listFiles, readText } from "./paths";
import { activitySchema, parseOrThrow, type ActivityMeta } from "./schema";

export type ActivityFile = { name: string; url: string };

export type Activity = ActivityMeta & {
  cohort: string;
  slug: string;
  thumbnailUrl?: string;
  body: { ko: string; en?: string };
  files: ActivityFile[];
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readActivity(cohort: string, slug: string): Activity {
  const dir = activityDir(cohort, slug);
  const file = path.join(dir, "index.md");
  const raw = readText(file);
  if (raw === undefined) throw new Error(`[content] ${file} not found`);

  const match = raw.match(FRONTMATTER);
  if (!match) throw new Error(`[content] ${file}: frontmatter(---) not found`);
  const meta = parseOrThrow(activitySchema, parseYaml(match[1]), file);
  const en = readText(path.join(dir, "index.en.md"));

  return {
    ...meta,
    cohort,
    slug,
    thumbnailUrl: meta.thumbnail && contentUrl(cohort, "activities", slug, meta.thumbnail),
    body: { ko: match[2].trim(), en: en?.replace(FRONTMATTER, "$2").trim() || undefined },
    files: listFiles(path.join(dir, "files")).map((name) => ({
      name,
      url: contentUrl(cohort, "activities", slug, "files", name),
    })),
  };
}

export function getActivities(cohort: string): Activity[] {
  return listDirs(activitiesDir(cohort), ACTIVITY_PATTERN)
    .map((slug) => readActivity(cohort, slug))
    .sort((a, b) => compareActivities(b, a));
}

export function getActivity(cohort: string, slug: string): Activity | undefined {
  return getActivities(cohort).find((activity) => activity.slug === slug);
}
