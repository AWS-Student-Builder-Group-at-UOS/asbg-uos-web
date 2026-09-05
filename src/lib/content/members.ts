import path from "node:path";
import { parse as parseYaml } from "yaml";
import { contentUrl } from "@/lib/routes";
import { membersDir, readText } from "./paths";
import { memberListSchema, parseOrThrow, type MemberData } from "./schema";

export type MemberGroup = "core" | "general";

export type Member = MemberData & {
  cohort: string;
  group: MemberGroup;
  photoUrl?: string;
};

function githubAvatar(url?: string) {
  const user = url?.match(/^https?:\/\/github\.com\/([^/?#]+)/)?.[1];
  return user && `https://avatars.githubusercontent.com/${user}?size=400`;
}

function readGroup(cohort: string, group: MemberGroup): Member[] {
  const file = path.join(membersDir(cohort), `${group}.yaml`);
  const raw = readText(file);
  if (raw === undefined) return [];

  return parseOrThrow(memberListSchema, parseYaml(raw), file).map((m) => ({
    ...m,
    cohort,
    group,
    photoUrl: m.photo ? contentUrl(cohort, "members", m.photo) : githubAvatar(m.links.github),
  }));
}

export function getMembers(cohort: string) {
  const core = readGroup(cohort, "core");
  const general = readGroup(cohort, "general");
  return { core, general, all: [...core, ...general] };
}
