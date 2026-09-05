import Link from "next/link";
import { ChipList } from "@/components/ui/Chip";
import { getSpeakers, type Session } from "@/lib/content";
import { getDict, pick, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { pad2 } from "@/lib/utils";
import { SpeakerMention } from "./SpeakerMention";

export function SessionCard({ session, locale }: { session: Session; locale: Locale }) {
  const d = getDict(locale);
  const upcoming = session.status === "upcoming";
  const title = pick(session.title, locale);
  const speakers = getSpeakers(session);

  return (
    <li className="card ring-hover relative flex flex-col overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
        {session.thumbnailUrl ? (
          <img src={session.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-4xl text-faint">{pad2(session.number)}</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>{d.session(session.number)}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={session.date}>{session.date}</time>
          </div>
          {upcoming && <span className="chip ml-auto border-sky/40 text-accent">{d.sessions.upcoming}</span>}
        </div>
        <ChipList items={session.keywords} />
        <h3 className="text-lg font-semibold leading-snug">
          {upcoming ? (
            title
          ) : (
            <Link href={routes.session(locale, session.cohort, session.slug)} className="after:absolute after:inset-0">
              {title}
            </Link>
          )}
        </h3>
        {session.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{pick(session.description, locale)}</p>
        )}
        {speakers.length > 0 && (
          <div className="relative z-10 mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
            {speakers.map((m) => (
              <SpeakerMention key={m.id} member={m} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
