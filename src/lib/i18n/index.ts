import { en } from "./dict/en";
import { ko, type Dict } from "./dict/ko";
import type { Locale } from "./locales";

const dicts: Record<Locale, Dict> = { ko, en };

export const getDict = (locale: Locale) => dicts[locale];

export { locales, isLocale, pick } from "./locales";
export type { Locale, Localized } from "./locales";
export type { Dict };
