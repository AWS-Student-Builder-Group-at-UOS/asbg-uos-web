import { QueryLink } from "@/components/ui/QueryLink";
import { ChipList } from "@/components/ui/Chip";
import { getSpeakers, type Activity } from "@/lib/content";
import { getDict, pick, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { SpeakerMention } from "./SpeakerMention";
import { ThumbnailFallback } from "./ThumbnailFallback";

export function ActivityCard({ activity, locale }: { activity: Activity; locale: Locale }) {
  const d = getDict(locale);
  const upcoming = activity.status === "upcoming";
  const title = pick(activity.title, locale);
  const speakers = getSpeakers(activity);

  return (
    <li className="card ring-hover relative flex flex-col overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
        {activity.thumbnailUrl ? (
          <img src={activity.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <ThumbnailFallback activity={activity} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="chip border-accent/25 text-accent">{d.activities.types[activity.type]}</span>
          {activity.session && <span>{d.session(activity.session)}</span>}
          {upcoming && <span className="ml-auto text-accent">{d.activities.upcoming}</span>}
        </div>
        <time dateTime={activity.date} className="font-mono text-xs text-muted">{activity.date}</time>
        <h2 className="text-lg font-semibold leading-snug">
          {upcoming ? title : (
            <QueryLink href={routes.activity(locale, activity.cohort, activity.slug)} className="after:absolute after:inset-0">
              {title}
            </QueryLink>
          )}
        </h2>
        {activity.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{pick(activity.description, locale)}</p>
        )}
        <ChipList items={activity.keywords} />
        {(speakers.length > 0 || activity.author) && (
          <div className="relative z-10 mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
            {activity.author && <span className="text-sm text-muted">{pick(activity.author, locale)}</span>}
            {speakers.map((member) => <SpeakerMention key={member.id} member={member} locale={locale} />)}
          </div>
        )}
      </div>
    </li>
  );
}
