import { Icon, type IconName } from "@/components/icons";
import { CopyButton } from "@/components/ui/CopyButton";
import { Section } from "@/components/ui/Section";
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
    <Section id="contact" className="pt-0">
      <div className="card grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted sm:text-lg">{c.body}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="font-mono text-lg sm:text-xl">{site.email}</p>
          <CopyButton value={site.email} label={d.common.copy} copiedLabel={d.common.copied} variant="primary" />
          <ul className="flex gap-1 pt-2">
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
