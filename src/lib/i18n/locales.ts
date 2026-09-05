export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** 콘텐츠 필드는 문자열 하나(공용) 또는 { ko, en } 객체로 쓸 수 있다. en이 없으면 ko로 대체한다. */
export type Localized = string | { ko: string; en?: string };

export function pick(value: Localized, locale: Locale): string {
  if (typeof value === "string") return value;
  return value[locale] ?? value.ko;
}
