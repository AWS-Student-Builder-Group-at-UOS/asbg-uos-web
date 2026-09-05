import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { getDict, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const channels: { key: keyof typeof site.links; icon: IconName; label: string }[] = [
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "github", icon: "github", label: "GitHub" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "meetup", icon: "meetup", label: "Meetup" },
];

export function Footer({ locale, latestCohort }: { locale: Locale; latestCohort: string }) {
  const d = getDict(locale);
  const community = [
    { label: d.nav.sessions, href: routes.sessions(locale, latestCohort) },
    { label: d.nav.members, href: routes.members(locale, latestCohort) },
    { label: d.nav.resources, href: routes.resources(locale) },
  ];

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo href={routes.home(locale)} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{d.footer.tagline}</p>
          <p className="mt-2 font-mono text-xs text-faint">{site.name}</p>
        </div>

        <div>
          <p className="eyebrow">{d.footer.community}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {community.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="link-quiet text-muted">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">{d.footer.channels}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {channels.map((c) => (
              <li key={c.key}>
                <a href={site.links[c.key]} target="_blank" rel="noreferrer" className="link-quiet inline-flex items-center gap-2 text-muted">
                  <Icon name={c.icon} size={14} />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-5 font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.email}</span>
      </Container>
    </footer>
  );
}
