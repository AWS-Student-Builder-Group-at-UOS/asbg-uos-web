import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { SessionBody } from "@/components/sessions/SessionBody";
import { SpeakerMention } from "@/components/sessions/SpeakerMention";
import { ChipList } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { getCohorts, getSession, getSessions, getSpeakers } from "@/lib/content";
import { getDict, locales, pick, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: Locale; cohort: string; session: string; presentation: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCohorts().flatMap((c) =>
      getSessions(c.slug)
        .filter((s) => s.status === "done")
        .map((s) => {
          const [session, presentation] = s.slug.split("/");
          return { locale, cohort: c.slug, session, presentation };
        }),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cohort, session, presentation } = await params;
  const s = getSession(cohort, `${session}/${presentation}`);
  if (!s || s.status !== "done") return {};
  const title = pick(s.title, locale);
  return pageMetadata({
    locale,
    path: `/sessions/${cohort}/${s.slug}`,
    title,
    description: s.description ? pick(s.description, locale) : `${title} · ${s.keywords.join(" · ")}`,
    type: "article",
    image: s.thumbnailUrl
      ? { url: `/og/${cohort}/${s.slug}`, alt: `${title} — ${locale === "ko" ? "발표 썸네일" : "presentation thumbnail"}` }
      : undefined,
  });
}

export default async function SessionPage({ params }: Props) {
  const { locale, cohort, session: sessionSlug, presentation } = await params;
  const slug = `${sessionSlug}/${presentation}`;
  const session = getSession(cohort, slug);
  if (!session || session.status !== "done") notFound();

  const d = getDict(locale);
  const speakers = getSpeakers(session);
  const done = getSessions(cohort).filter((s) => s.status === "done");
  const index = done.findIndex((s) => s.slug === slug);
  const prev = done[index - 1];
  const next = done[index + 1];
  const body = (locale === "en" && session.body.en) || session.body.ko;

  return (
    <article>
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Link href={routes.sessions(locale, cohort)} className="link-quiet inline-flex items-center gap-2 font-mono text-xs text-muted">
            <Icon name="arrowLeft" size={12} />
            {d.sessions.back}
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-muted">
              <span className="text-accent">{d.cohort(Number(cohort.slice(-2)))}</span>
              <span aria-hidden="true">·</span>
              <span>{d.session(session.number)}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={session.date}>{session.date}</time>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{pick(session.title, locale)}</h1>
            {session.description && (
              <p className="mt-4 leading-relaxed text-muted sm:text-lg">{pick(session.description, locale)}</p>
            )}
            <ChipList items={session.keywords} className="mt-5" />
            {speakers.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-faint">{d.sessions.speaker}</span>
                {speakers.map((m) => (
                  <SpeakerMention key={m.id} member={m} locale={locale} avatar />
                ))}
              </div>
            )}
          </header>

          {session.thumbnailUrl && (
            <img src={session.thumbnailUrl} alt="" className="mt-10 w-full rounded-lg border border-line" />
          )}

          <div className="mt-10">
            <SessionBody cohort={cohort} session={slug} markdown={body} />
          </div>

          {session.files.length > 0 && (
            <section className="mt-14">
              <p className="eyebrow">{d.sessions.files}</p>
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-md border border-line">
                {session.files.map((f) => (
                  <li key={f.url}>
                    <a href={f.url} target="_blank" rel="noreferrer" className="link-quiet flex items-center gap-3 px-4 py-3 text-sm">
                      <Icon name="file" size={14} className="shrink-0 text-faint" />
                      <span className="truncate">{f.name}</span>
                      <Icon name="external" size={12} className="ml-auto shrink-0 text-faint" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2" aria-label="Session">
            {prev && (
              <Link href={routes.session(locale, cohort, prev.slug)} className="link-quiet group">
                <span className="font-mono text-xs text-faint">{d.sessions.prev}</span>
                <span className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Icon name="arrowLeft" size={12} className="text-faint transition-colors group-hover:text-accent" />
                  {pick(prev.title, locale)}
                </span>
              </Link>
            )}
            {next && (
              <Link href={routes.session(locale, cohort, next.slug)} className="link-quiet group text-right sm:col-start-2">
                <span className="font-mono text-xs text-faint">{d.sessions.next}</span>
                <span className="mt-1 flex items-center justify-end gap-2 text-sm font-medium">
                  {pick(next.title, locale)}
                  <Icon name="arrowRight" size={12} className="text-faint transition-colors group-hover:text-accent" />
                </span>
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </article>
  );
}
