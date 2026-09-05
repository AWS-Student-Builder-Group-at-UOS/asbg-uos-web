"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/locales";

/* 루트 <html> 은 locale 밖에 있다. 첫 로드는 app/layout.tsx 의 인라인 스크립트가, 언어 전환은 이 effect 가 lang 을 맞춘다. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
