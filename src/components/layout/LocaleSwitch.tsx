"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const swap = (target: Locale) => pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${target}`);

  // The locale segment owns the root <html>; reload it so lang and the theme bootstrap script are applied by the browser.
  return (
    <div className="flex items-center rounded-sm border border-line font-mono text-xs" role="group" aria-label={label}>
      {locales.map((l) => (
        <a
          key={l}
          href={swap(l)}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "px-2.5 py-1.5 uppercase transition-colors duration-200",
            l === locale ? "bg-ink text-canvas" : "text-muted hover:text-ink",
          )}
        >
          {l}
        </a>
      ))}
    </div>
  );
}
