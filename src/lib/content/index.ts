import fs from "node:fs";
import path from "node:path";
import { getCohorts, getLatestCohort } from "./cohorts";
import { getMembers, type Member } from "./members";
import { cohortDir } from "./paths";
import { getSessions, type Session } from "./sessions";

export * from "./cohorts";
export * from "./members";
export * from "./sessions";

export function getSpeakers(session: Session): Member[] {
  const { all } = getMembers(session.cohort);
  return session.speakers.map((id) => {
    const member = all.find((m) => m.id === id);
    if (!member) throw new Error(`[content] ${session.cohort}/${session.slug}: unknown speaker "${id}"`);
    return member;
  });
}

export function getStats() {
  const cohorts = getCohorts();
  const latest = getLatestCohort();
  const done = cohorts.flatMap((c) => getSessions(c.slug)).filter((s) => s.status === "done");
  return {
    members: getMembers(latest.slug).all.length,
    presentations: done.length,
    cohorts: cohorts.length,
  };
}

const TEXT_EXT = new Set([".md", ".yaml", ".yml"]);

export function listContentAssets(): string[][] {
  const walk = (dir: string, rel: string[]): string[][] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      if (d.name.startsWith(".")) return [];
      const next = [...rel, d.name];
      if (d.isDirectory()) return walk(path.join(dir, d.name), next);
      return TEXT_EXT.has(path.extname(d.name)) ? [] : [next];
    });
  return getCohorts().flatMap((c) => walk(cohortDir(c.slug), [c.slug]));
}
