"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/locales";

// 첫 로드는 루트 레이아웃 스크립트가, 언어 전환은 이 컴포넌트가 lang을 맞춘다.
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
