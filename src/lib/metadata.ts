import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

type PageMetadata = {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  image?: { url: string; alt: string };
  type?: "website" | "article";
};

export function pageMetadata({ locale, path = "", title, description, image, type = "website" }: PageMetadata): Metadata {
  const d = getDict(locale);
  const shareTitle = title ? `${title} · ${site.shortName}` : d.meta.title;
  const summary = description || d.meta.description;
  const url = (language: Locale) => new URL(`/${language}${path}`, site.url).href;
  const shareImage = {
    url: new URL(image?.url || "/og?v=2", site.url).href,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: image?.alt || d.meta.title,
  };

  return {
    title: title || d.meta.title,
    description: summary,
    alternates: { canonical: url(locale), languages: { ko: url("ko"), en: url("en") } },
    openGraph: {
      type,
      siteName: site.shortName,
      title: shareTitle,
      description: summary,
      url: url(locale),
      locale: locale === "ko" ? "ko_KR" : "en_US",
      alternateLocale: locale === "ko" ? "en_US" : "ko_KR",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: summary,
      images: [{ url: shareImage.url, alt: shareImage.alt }],
    },
  };
}
