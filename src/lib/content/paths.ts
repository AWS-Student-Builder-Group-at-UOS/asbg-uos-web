import fs from "node:fs";
import path from "node:path";

export const CONTENT_ROOT = process.cwd();
export const COHORT_PATTERN = /^cohort-(\d{2})$/;
export const SESSION_PATTERN = /^session-(\d{2})$/;

export const cohortDir = (cohort: string) => path.join(/* turbopackIgnore: true */ CONTENT_ROOT, cohort);
export const sessionDir = (cohort: string, session: string) => path.join(cohortDir(cohort), session);
export const membersDir = (cohort: string) => path.join(cohortDir(cohort), "members");

export function listDirs(dir: string, pattern: RegExp) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && pattern.test(d.name))
    .map((d) => d.name)
    .sort();
}

export function readText(file: string) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;
}

export function listFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort();
}
