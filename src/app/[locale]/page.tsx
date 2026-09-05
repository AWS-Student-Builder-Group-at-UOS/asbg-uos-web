import { Contact } from "@/components/home/Contact";
import { Flow } from "@/components/home/Flow";
import { Hero } from "@/components/home/Hero";
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
      <Flow locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
