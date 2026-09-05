import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { CopyButton } from "@/components/ui/CopyButton";
import { PageHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

const items: { key: keyof ReturnType<typeof getDict>["resources"]["items"]; icon: IconName; href?: string }[] = [
  { key: "linkedin", icon: "linkedin", href: site.links.linkedin },
  { key: "github", icon: "github", href: site.links.github },
  { key: "email", icon: "mail" },
  { key: "instagram", icon: "instagram", href: site.links.instagram },
  { key: "meetup", icon: "meetup", href: site.links.meetup },
  { key: "moreGroups", icon: "network", href: site.links.moreGroups },
];

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale);
  return { title: d.resources.title, description: d.resources.body };
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);

  return (
    <>
      <PageHead title={d.resources.title} body={d.resources.body} />
      <Container className="py-10 sm:py-14">
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const t = d.resources.items[item.key];
            return (
              <li key={item.key} className="card ring-hover relative flex gap-5 p-6">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm bg-accent-soft text-accent">
                  <Icon name={item.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{t.title}</h2>
                    {item.href && <Icon name="external" size={12} className="shrink-0 text-faint" />}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t.body}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="mt-4 block truncate font-mono text-xs text-faint after:absolute after:inset-0">
                      {display(item.href)}
                    </a>
                  ) : (
                    <CopyButton value={site.email} label={d.common.copy} copiedLabel={d.common.copied} className="mt-4 text-xs" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
