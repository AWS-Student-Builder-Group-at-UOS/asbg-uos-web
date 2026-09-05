"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePattern, locales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const swap = (target: Locale) => pathname.replace(new RegExp(localePattern), `/${target}`);

  return (
    <div className="flex items-center rounded-sm border border-line font-mono text-xs" role="group" aria-label={label}>
      {locales.map((l) => (
        <Link
          key={l}
          href={swap(l)}
          hrefLang={l}
          scroll={false}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "px-2.5 py-1.5 uppercase transition-colors duration-200",
            l === locale ? "bg-ink text-canvas" : "text-muted hover:text-ink",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
