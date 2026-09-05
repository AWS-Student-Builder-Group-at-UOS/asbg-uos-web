import { Icon, type IconName } from "@/components/icons";
import { ChipList } from "@/components/ui/Chip";
import type { Member } from "@/lib/content";
import { pick, type Locale } from "@/lib/i18n";

const linkIcons: { key: keyof Member["links"]; icon: IconName; label: string }[] = [
  { key: "github", icon: "github", label: "GitHub" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "website", icon: "globe", label: "Website" },
];

export function MemberCard({ member, locale }: { member: Member; locale: Locale }) {
  const name = pick(member.name, locale);

  return (
    <li
      id={member.id}
      className="card ring-hover flex flex-col overflow-hidden scroll-mt-24 target:border-sky target:shadow-card"
    >
      <div className="aspect-[4/5] overflow-hidden border-b border-line bg-surface-2">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-4xl text-faint">{name.slice(0, 1)}</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold">{name}</h3>
            {member.role && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">{member.role}</span>}
          </div>
          <p className="mt-0.5 text-sm text-muted">{pick(member.major, locale)}</p>
        </div>
        <ChipList items={member.keywords} />
        <p className="text-sm leading-relaxed text-muted">{pick(member.description, locale)}</p>
        <ul className="mt-auto flex gap-1 border-t border-line pt-3">
          {linkIcons.map(
            (l) =>
              member.links[l.key] && (
                <li key={l.key}>
                  <a
                    href={member.links[l.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${name} ${l.label}`}
                    className="inline-flex size-8 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
                  >
                    <Icon name={l.icon} size={15} />
                  </a>
                </li>
              ),
          )}
        </ul>
      </div>
    </li>
  );
}
