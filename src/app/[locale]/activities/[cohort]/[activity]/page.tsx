import type { Metadata } from "next";
import { QueryLink } from "@/components/ui/QueryLink";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { ActivityBody } from "@/components/activities/ActivityBody";
import { SpeakerMention } from "@/components/activities/SpeakerMention";
import { ChipList } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { getCohorts, getActivity, getActivities, getSpeakers } from "@/lib/content";
import { getDict, locales, pick, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: Locale; cohort: string; activity: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCohorts().flatMap((c) =>
      getActivities(c.slug)
        .filter((s) => s.status === "done")
        .map((activity) => ({ locale, cohort: c.slug, activity: activity.slug })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cohort, activity } = await params;
  const s = getActivity(cohort, activity);
  if (!s || s.status !== "done") return {};
  const title = pick(s.title, locale);
  return pageMetadata({
    locale,
    path: `/activities/${cohort}/${s.slug}`,
    title,
    description: s.description ? pick(s.description, locale) : `${title} · ${s.keywords.join(" · ")}`,
    type: "article",
    image: s.thumbnailUrl
      ? { url: `/og/${cohort}/${s.slug}`, alt: title }
      : undefined,
  });
}

export default async function ActivityPage({ params }: Props) {
  const { locale, cohort, activity: slug } = await params;
  const activity = getActivity(cohort, slug);
  if (!activity || activity.status !== "done") notFound();

  const d = getDict(locale);
  const speakers = getSpeakers(activity);
  const done = getActivities(cohort).filter((s) => s.status === "done");
  const index = done.findIndex((s) => s.slug === slug);
  const prev = done[index - 1];
  const next = done[index + 1];
  const related = activity.session ? done.filter((item) => item.session === activity.session && item.slug !== slug) : [];
  const body = (locale === "en" && activity.body.en) || activity.body.ko;

  return (
    <article>
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <QueryLink href={routes.activities(locale, cohort)} className="link-quiet inline-flex items-center gap-2 font-mono text-xs text-muted">
            <Icon name="arrowLeft" size={12} />
            {d.activities.back}
          </QueryLink>

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-muted">
              <span className="text-accent">{d.cohort(Number(cohort.slice(-2)))}</span>
              <span aria-hidden="true">·</span>
              <span className="chip border-accent/25 text-accent">{d.activities.types[activity.type]}</span>
              {activity.session && <span>{d.session(activity.session)}</span>}
              <time dateTime={activity.date}>{activity.date}</time>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{pick(activity.title, locale)}</h1>
            {activity.description && (
              <p className="mt-4 leading-relaxed text-muted sm:text-lg">{pick(activity.description, locale)}</p>
            )}
            <ChipList items={activity.keywords} className="mt-5" />
            {(speakers.length > 0 || activity.author) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-faint">{activity.type === "presentation" ? d.activities.speaker : d.activities.author}</span>
                {activity.author && <span className="text-sm text-muted">{pick(activity.author, locale)}</span>}
                {speakers.map((m) => (
                  <SpeakerMention key={m.id} member={m} locale={locale} avatar />
                ))}
              </div>
            )}
          </header>

          {activity.thumbnailUrl && (
            <img src={activity.thumbnailUrl} alt="" className="mt-10 w-full rounded-lg outline-1 -outline-offset-1 outline-line" />
          )}

          <div className="mt-10">
            <ActivityBody cohort={cohort} activity={slug} markdown={body} locale={locale} />
          </div>

          {activity.files.length > 0 && (
            <section className="mt-14">
              <p className="eyebrow">{d.activities.files}</p>
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-md border border-line">
                {activity.files.map((f) => (
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

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="eyebrow">{d.activities.related}</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {related.map((item) => (
                  <li key={item.slug}>
                    <QueryLink href={routes.activity(locale, cohort, item.slug)} className="link-quiet flex items-start gap-3 py-4">
                      <span className="chip shrink-0">{d.activities.types[item.type]}</span>
                      <span className="text-sm">{pick(item.title, locale)}</span>
                    </QueryLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2" aria-label={d.activities.title}>
            {prev && (
              <QueryLink href={routes.activity(locale, cohort, prev.slug)} className="link-quiet group">
                <span className="font-mono text-xs text-faint">{d.activities.prev}</span>
                <span className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Icon name="arrowLeft" size={12} className="text-faint transition-colors group-hover:text-accent" />
                  {pick(prev.title, locale)}
                </span>
              </QueryLink>
            )}
            {next && (
              <QueryLink href={routes.activity(locale, cohort, next.slug)} className="link-quiet group text-right sm:col-start-2">
                <span className="font-mono text-xs text-faint">{d.activities.next}</span>
                <span className="mt-1 flex items-center justify-end gap-2 text-sm font-medium">
                  {pick(next.title, locale)}
                  <Icon name="arrowRight" size={12} className="text-faint transition-colors group-hover:text-accent" />
                </span>
              </QueryLink>
            )}
          </nav>
        </div>
      </Container>
    </article>
  );
}
