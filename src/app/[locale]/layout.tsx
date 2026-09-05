import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { getLatestCohort } from "@/lib/content";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: site.shortName, template: `%s · ${site.shortName}` },
    description: d.meta.description,
    alternates: { canonical: `/${locale}`, languages: { ko: "/ko", en: "/en" } },
    openGraph: {
      type: "website",
      siteName: site.shortName,
      title: site.name,
      description: d.meta.description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const d = getDict(locale);
  const latest = getLatestCohort().slug;
  const nav = [
    { label: d.nav.home, href: routes.home(locale), match: routes.home(locale) },
    { label: d.nav.sessions, href: routes.sessions(locale, latest), match: `/${locale}/sessions` },
    { label: d.nav.members, href: routes.members(locale, latest), match: `/${locale}/members` },
    { label: d.nav.resources, href: routes.resources(locale), match: routes.resources(locale) },
  ];

  // JavaScript 없이도 본문 언어가 지정되도록 한다.
  return (
    <div lang={locale} className="contents">
      <HtmlLang locale={locale} />
      <Header locale={locale} items={nav} a11y={d.a11y} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} latestCohort={latest} />
    </div>
  );
}
