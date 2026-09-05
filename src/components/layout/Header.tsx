"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export type NavItem = { label: string; href: string; match: string };

export function Header({
  locale,
  items,
  a11y,
}: {
  locale: Locale;
  items: NavItem[];
  a11y: { openMenu: string; closeMenu: string; theme: string; locale: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: NavItem) => pathname === item.match || pathname.startsWith(`${item.match}/`);
  // 같은 경로에서는 라우터가 스크롤을 초기화하지 않는다.
  const go = (href: string) => () => {
    setOpen(false);
    if (pathname === href) window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo href={`/${locale}`} onClick={go(`/${locale}`)} variant="header" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              aria-current={isActive(item) ? "page" : undefined}
              className={cn(
                "rounded-sm px-3 py-2 text-sm transition-colors duration-200",
                isActive(item) ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch locale={locale} label={a11y.locale} />
          <ThemeToggle label={a11y.theme} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            className="inline-flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink md:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={15} />
          </button>
        </div>
      </Container>

      <nav id="mobile-nav" hidden={!open} className="border-t border-line bg-canvas md:hidden" aria-label="Main">
        <Container className="flex flex-col py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              aria-current={isActive(item) ? "page" : undefined}
              className={cn(
                "flex items-center justify-between py-3 text-base",
                isActive(item) ? "text-ink" : "text-muted",
              )}
            >
              {item.label}
              <Icon name="arrowRight" size={12} className="text-faint" />
            </Link>
          ))}
        </Container>
      </nav>
    </header>
  );
}
