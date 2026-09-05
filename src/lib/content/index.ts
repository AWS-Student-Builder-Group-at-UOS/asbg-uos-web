import fs from "node:fs";
import path from "node:path";
import { getCohorts, getLatestCohort } from "./cohorts";
import { getMembers, type Member } from "./members";
import { cohortDir } from "./paths";
import { getSessions, type Session } from "./sessions";

export * from "./cohorts";
export * from "./members";
export * from "./sessions";

/** 세션의 speakers(id)를 같은 기수 멤버로 연결한다. 없는 id는 빌드에서 바로 실패시킨다. */
export function getSpeakers(session: Session): Member[] {
  const { all } = getMembers(session.cohort);
  return session.speakers.map((id) => {
    const member = all.find((m) => m.id === id);
    if (!member) throw new Error(`[content] ${session.cohort}/${session.slug}: unknown speaker "${id}"`);
    return member;
  });
}

/** 홈 수치 — 최신 기수 멤버 수, 진행한 세션 수, 기수 수 */
export function getStats() {
  const cohorts = getCohorts();
  const latest = getLatestCohort();
  const done = cohorts.flatMap((c) => getSessions(c.slug)).filter((s) => s.status === "done");
  return {
    members: getMembers(latest.slug).all.length,
    sessions: done.length,
    cohorts: cohorts.length,
  };
}

const TEXT_EXT = new Set([".md", ".yaml", ".yml"]);

/** /content/... 로 서빙할 파일 목록(md·yaml 제외). 각 항목은 레포 루트 기준 경로 조각. */
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
