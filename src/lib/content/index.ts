import fs from "node:fs";
import path from "node:path";
import { getCohorts, getLatestCohort } from "./cohorts";
import { getMembers, type Member } from "./members";
import { cohortDir } from "./paths";
import { getActivities, type Activity } from "./activities";

export * from "./cohorts";
export * from "./members";
export * from "./activities";

export function getSpeakers(activity: Activity): Member[] {
  const { all } = getMembers(activity.cohort);
  return activity.speakers.map((id) => {
    const member = all.find((m) => m.id === id);
    if (!member) throw new Error(`[content] ${activity.cohort}/${activity.slug}: unknown speaker "${id}"`);
    return member;
  });
}

export function getStats() {
  const cohorts = getCohorts();
  const latest = getLatestCohort();
  const done = cohorts.flatMap((c) => getActivities(c.slug)).filter((activity) => activity.type === "presentation" && activity.status === "done");
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
