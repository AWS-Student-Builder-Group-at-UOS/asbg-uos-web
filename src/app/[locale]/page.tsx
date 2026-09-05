import { Cloud } from "@/components/home/Cloud";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Keywords } from "@/components/home/Keywords";
import { Stats } from "@/components/home/Stats";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { Why } from "@/components/home/Why";
import { getLatestCohort } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const latest = getLatestCohort().slug;

  return (
    <>
      <Hero locale={locale} latestCohort={latest} />
      <Stats locale={locale} />
      <Why locale={locale} />
      <WhatWeDo locale={locale} />
      <Cloud locale={locale} />
      <Keywords locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
