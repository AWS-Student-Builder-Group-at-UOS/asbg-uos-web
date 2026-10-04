import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityList } from "@/components/activities/ActivityList";
import { CohortTabs } from "@/components/ui/CohortTabs";
import { Container } from "@/components/ui/Container";
import { PageHead } from "@/components/ui/Section";
import { getActivities, getCohorts, getSpeakers, hasCohort } from "@/lib/content";
import { getDict, locales, pick, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: Locale; cohort: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getCohorts().map((cohort) => ({ locale, cohort: cohort.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cohort } = await params;
  const current = getCohorts().find((item) => item.slug === cohort);
  if (!current) return {};
  const d = getDict(locale);
  return pageMetadata({
    locale,
    path: `/activities/${cohort}`,
    title: `${d.cohort(current.number)} · ${d.activities.title}`,
    description: d.activities.body,
  });
}

export default async function ActivitiesPage({ params }: Props) {
  const { locale, cohort } = await params;
  if (!hasCohort(cohort)) notFound();
  const d = getDict(locale);
  const items = getActivities(cohort).map((activity) => ({
    slug: activity.slug,
    type: activity.type,
    status: activity.status,
    date: activity.date,
    searchText: [
      pick(activity.title, locale),
      activity.description && pick(activity.description, locale),
      ...activity.keywords,
      activity.session && d.session(activity.session),
      activity.author && pick(activity.author, locale),
      ...getSpeakers(activity).map((member) => pick(member.name, locale)),
    ].filter(Boolean).join(" "),
    content: <ActivityCard key={activity.slug} activity={activity} locale={locale} />,
  }));

  return (
    <>
      <PageHead title={d.activities.title} body={d.activities.body} />
      <Container className="py-10 sm:py-14">
        <CohortTabs cohorts={getCohorts()} active={cohort} href={(slug) => routes.activities(locale, slug)} label={d.cohort} />
        <Suspense fallback={<ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => item.content)}</ul>}>
          <ActivityList items={items} locale={locale} />
        </Suspense>
      </Container>
    </>
  );
}
