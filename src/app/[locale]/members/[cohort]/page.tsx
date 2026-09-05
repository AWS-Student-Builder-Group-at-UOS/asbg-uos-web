import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberCard } from "@/components/members/MemberCard";
import { CohortTabs } from "@/components/ui/CohortTabs";
import { Container } from "@/components/ui/Container";
import { PageHead } from "@/components/ui/Section";
import { getCohorts, getMembers, hasCohort, type Member } from "@/lib/content";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: Locale; cohort: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getCohorts().map((c) => ({ locale, cohort: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale);
  return { title: d.members.title, description: d.members.body };
}

function Group({ title, members, locale }: { title: string; members: Member[]; locale: Locale }) {
  if (members.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-5 grid gap-5 lg:grid-cols-2">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} locale={locale} />
        ))}
      </ul>
    </section>
  );
}

export default async function MembersPage({ params }: Props) {
  const { locale, cohort } = await params;
  if (!hasCohort(cohort)) notFound();

  const d = getDict(locale);
  const { core, general, all } = getMembers(cohort);

  return (
    <>
      <PageHead title={d.members.title} body={d.members.body} />
      <Container className="py-10 sm:py-14">
        <CohortTabs cohorts={getCohorts()} active={cohort} href={(c) => routes.members(locale, c)} label={d.cohort} />
        {all.length === 0 && <p className="py-20 text-center text-muted">{d.members.empty}</p>}
        <Group title={d.members.core} members={core} locale={locale} />
        <Group title={d.members.general} members={general} locale={locale} />
      </Container>
    </>
  );
}
