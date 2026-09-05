import { Icon, type IconName } from "@/components/icons";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";

const icons: IconName[] = ["terminal", "speaker", "trophy", "network"];

export function WhatWeDo({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.what;

  return (
    <Section className="border-y border-line bg-surface-2/70">
      <SectionHead eyebrow={d.eyebrow} title={d.title} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.items.map((item, i) => (
          <li key={item.title} className="card ring-hover p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-sm bg-accent-soft text-accent">
              <Icon name={icons[i]} size={18} />
            </span>
            <h3 className="mt-5 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
