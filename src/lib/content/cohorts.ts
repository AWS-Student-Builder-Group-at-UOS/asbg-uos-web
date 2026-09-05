import { COHORT_PATTERN, CONTENT_ROOT, listDirs } from "./paths";

export type Cohort = { slug: string; number: number };

export function getCohorts(): Cohort[] {
  return listDirs(CONTENT_ROOT, COHORT_PATTERN).map((slug) => ({
    slug,
    number: Number(slug.match(COHORT_PATTERN)![1]),
  }));
}

export function getLatestCohort(): Cohort {
  const cohorts = getCohorts();
  if (cohorts.length === 0) throw new Error("[content] no cohort-NN folder found");
  return cohorts[cohorts.length - 1];
}

export function hasCohort(slug: string) {
  return getCohorts().some((c) => c.slug === slug);
}
