import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SessionCard } from "@/components/sessions/SessionCard";
import { CohortTabs } from "@/components/ui/CohortTabs";
import { Container } from "@/components/ui/Container";
import { PageHead } from "@/components/ui/Section";
import { getCohorts, getSessions, hasCohort } from "@/lib/content";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: Locale; cohort: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getCohorts().map((c) => ({ locale, cohort: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cohort } = await params;
  const c = getCohorts().find((c) => c.slug === cohort);
  if (!c) return {};
  const d = getDict(locale);
  return pageMetadata({
    locale,
    path: `/sessions/${cohort}`,
    title: `${d.cohort(c.number)} · ${locale === "ko" ? "발표 기록" : "Talks"}`,
    description: d.sessions.body,
  });
}

export default async function SessionsPage({ params }: Props) {
  const { locale, cohort } = await params;
  if (!hasCohort(cohort)) notFound();

  const d = getDict(locale);
  const sessions = getSessions(cohort);

  return (
    <>
      <PageHead title={d.sessions.title} body={d.sessions.body} />
      <Container className="py-10 sm:py-14">
        <CohortTabs cohorts={getCohorts()} active={cohort} href={(c) => routes.sessions(locale, c)} label={d.cohort} />
        {sessions.length === 0 ? (
          <p className="py-20 text-center text-muted">{d.sessions.empty}</p>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <SessionCard key={s.slug} session={s} locale={locale} />
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
