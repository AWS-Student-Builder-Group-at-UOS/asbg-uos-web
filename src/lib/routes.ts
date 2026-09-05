import type { Locale } from "@/lib/i18n/locales";

export const routes = {
  home: (l: Locale) => `/${l}`,
  sessions: (l: Locale, cohort: string) => `/${l}/sessions/${cohort}`,
  session: (l: Locale, cohort: string, session: string) => `/${l}/sessions/${cohort}/${session}`,
  members: (l: Locale, cohort: string, member?: string) =>
    `/${l}/members/${cohort}${member ? `#${member}` : ""}`,
  resources: (l: Locale) => `/${l}/resources`,
};

/** 레포 루트 cohort-NN/ 안의 파일은 /content/... 로 그대로 서빙된다. */
export const contentUrl = (...segments: string[]) => `/content/${segments.join("/")}`;
