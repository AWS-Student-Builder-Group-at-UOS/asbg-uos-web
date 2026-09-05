import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { getLatestCohort } from "@/lib/content";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import "@/app/globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-geist-mono" });

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

  return (
    <html lang={locale} className={geistMono.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <Header locale={locale} items={nav} a11y={d.a11y} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} latestCohort={latest} />
        </ThemeProvider>
      </body>
    </html>
  );
}
