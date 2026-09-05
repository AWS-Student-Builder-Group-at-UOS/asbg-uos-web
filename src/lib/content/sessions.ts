import path from "node:path";
import { parse as parseYaml } from "yaml";
import { contentUrl } from "@/lib/routes";
import { cohortDir, listDirs, listFiles, readText, sessionDir, SESSION_PATTERN, PRESENTATION_PATTERN } from "./paths";
import { parseOrThrow, sessionSchema, type SessionMeta } from "./schema";

export type SessionFile = { name: string; url: string };

export type Session = SessionMeta & {
  cohort: string;
  slug: string;
  number: number;
  thumbnailUrl?: string;
  body: { ko: string; en?: string };
  files: SessionFile[];
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function splitFrontmatter(raw: string, file: string) {
  const match = raw.match(FRONTMATTER);
  if (!match) throw new Error(`[content] ${file}: frontmatter(---) not found`);
  return { data: parseYaml(match[1]) as unknown, body: match[2].trim() };
}

function readSession(cohort: string, slug: string): Session {
  const dir = sessionDir(cohort, slug);
  const file = path.join(dir, "index.md");
  const raw = readText(file);
  if (raw === undefined) throw new Error(`[content] ${file} not found`);

  const { data, body } = splitFrontmatter(raw, file);
  const meta = parseOrThrow(sessionSchema, data, file);
  const en = readText(path.join(dir, "index.en.md"));

  return {
    ...meta,
    cohort,
    slug,
    number: Number(slug.split("/")[0].match(SESSION_PATTERN)![1]),
    thumbnailUrl: meta.thumbnail && contentUrl(cohort, slug, meta.thumbnail),
    body: { ko: body, en: en?.replace(FRONTMATTER, "$2").trim() || undefined },
    files: listFiles(path.join(dir, "files")).map((name) => ({
      name,
      url: contentUrl(cohort, slug, "files", name),
    })),
  };
}

export function getSessions(cohort: string): Session[] {
  return listDirs(cohortDir(cohort), SESSION_PATTERN).flatMap((session) =>
    listDirs(sessionDir(cohort, session), PRESENTATION_PATTERN).map((presentation) =>
      readSession(cohort, `${session}/${presentation}`),
    ),
  );
}

export function getSession(cohort: string, slug: string): Session | undefined {
  return getSessions(cohort).find((s) => s.slug === slug);
}
