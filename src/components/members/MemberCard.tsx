import { Icon, type IconName } from "@/components/icons";
import { MemberBio } from "@/components/members/MemberBio";
import { ChipList } from "@/components/ui/Chip";
import type { Member } from "@/lib/content";
import { getDict, pick, type Locale } from "@/lib/i18n";

const linkIcons: { key: keyof Member["links"]; icon: IconName; label: string }[] = [
  { key: "github", icon: "github", label: "GitHub" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "website", icon: "globe", label: "Website" },
];

export function MemberCard({ member, locale }: { member: Member; locale: Locale }) {
  const name = pick(member.name, locale);
  const { common } = getDict(locale);

  return (
    <li
      id={member.id}
      data-member-card
      className="card ring-hover grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 scroll-mt-24 target:border-sky target:shadow-card sm:flex sm:min-h-92 sm:gap-5 sm:p-5"
    >
      <div data-member-media className="contents sm:block sm:w-44 sm:shrink-0 sm:self-start">
        <div className="relative size-20 self-center overflow-hidden rounded-md border border-line bg-surface-2 sm:aspect-[4/5] sm:size-auto sm:w-full">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-2xl text-faint sm:text-4xl">
              {name.slice(0, 1)}
            </div>
          )}
        </div>
        <ChipList items={member.keywords} className="col-span-2 sm:mt-3" />
      </div>

      <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col">
        <div className="col-start-2 row-start-1 min-w-0 self-center sm:self-stretch">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="text-lg font-semibold">{name}</h3>
            {member.role && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">{member.role}</span>}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="min-w-0 text-sm text-muted">{pick(member.major, locale)}</p>
            <ul className="ml-auto flex shrink-0 gap-0.5">
              {linkIcons.map(
                (l) =>
                  member.links[l.key] && (
                    <li key={l.key}>
                      <a
                        href={member.links[l.key]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${name} ${l.label}`}
                        className="inline-flex size-7 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
                      >
                        <Icon name={l.icon} size={14} />
                      </a>
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>
        <MemberBio
          text={pick(member.description, locale)}
          more={common.more}
          less={common.less}
          className="col-span-2 sm:mt-3"
        />
      </div>
    </li>
  );
}
