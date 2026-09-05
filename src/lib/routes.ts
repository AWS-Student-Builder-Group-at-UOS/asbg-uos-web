import type { Locale } from "@/lib/i18n/locales";

export const routes = {
  home: (l: Locale) => `/${l}`,
  sessions: (l: Locale, cohort: string) => `/${l}/sessions/${cohort}`,
  session: (l: Locale, cohort: string, session: string) => `/${l}/sessions/${cohort}/${session}`,
  members: (l: Locale, cohort: string, member?: string) =>
    `/${l}/members/${cohort}${member ? `#${member}` : ""}`,
  resources: (l: Locale) => `/${l}/resources`,
};

export const contentUrl = (...segments: string[]) => `/content/${segments.join("/")}`;
