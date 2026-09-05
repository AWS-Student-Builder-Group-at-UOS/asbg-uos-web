export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localePattern = `^/(${locales.join("|")})(?=/|$)`;

export type Localized = string | { ko: string; en?: string };

export function pick(value: Localized, locale: Locale): string {
  if (typeof value === "string") return value;
  return value[locale] ?? value.ko;
}
