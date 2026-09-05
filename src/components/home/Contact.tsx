import { Icon, type IconName } from "@/components/icons";
import { CopyButton } from "@/components/ui/CopyButton";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const channels: { key: keyof typeof site.links; icon: IconName; label: string }[] = [
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "github", icon: "github", label: "GitHub" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "meetup", icon: "meetup", label: "Meetup" },
];

export function Contact({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const c = d.home.contact;

  return (
    <Section id="contact">
      <div className="card grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <SectionHead index="05" eyebrow={c.eyebrow} title={c.title} body={c.body} />
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <CopyButton value={site.email} label={d.common.copy} copiedLabel={d.common.copied} className="text-lg sm:text-xl" />
          <p className="text-xs text-muted">{c.hint}</p>
          <ul className="mt-4 flex gap-1">
            {channels.map((ch) => (
              <li key={ch.key}>
                <a
                  href={site.links[ch.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={ch.label}
                  className="inline-flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
                >
                  <Icon name={ch.icon} size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
