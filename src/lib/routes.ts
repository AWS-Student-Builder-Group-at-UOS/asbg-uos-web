import type { Locale } from "@/lib/i18n/locales";

export const routes = {
  home: (l: Locale) => `/${l}`,
  activities: (l: Locale, cohort: string) => `/${l}/activities/${cohort}`,
  activity: (l: Locale, cohort: string, activity: string) => `/${l}/activities/${cohort}/${activity}`,
  members: (l: Locale, cohort: string, member?: string) =>
    `/${l}/members/${cohort}${member ? `#${member}` : ""}`,
  resources: (l: Locale) => `/${l}/resources`,
};

export const contentUrl = (...segments: string[]) => `/content/${segments.join("/")}`;
