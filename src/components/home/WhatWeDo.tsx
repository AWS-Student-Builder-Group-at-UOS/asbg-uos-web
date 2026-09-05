import { Icon, type IconName } from "@/components/icons";
import { ChipList } from "@/components/ui/Chip";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";
import { pad2 } from "@/lib/utils";

const icons: IconName[] = ["terminal", "speaker", "trophy", "network"];

export function WhatWeDo({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.what;

  return (
    <Section className="border-y border-line bg-surface-2/70">
      <SectionHead index="02" eyebrow={d.eyebrow} title={d.title} body={d.body} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {d.items.map((item, i) => (
          <li key={item.title} className="card ring-hover flex flex-col gap-5 p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <span className="inline-flex size-10 items-center justify-center rounded-sm bg-accent-soft text-accent">
                <Icon name={icons[i]} size={18} />
              </span>
              <span className="index">{pad2(i + 1)}</span>
            </div>
            <div>
              <h3 className="font-mono text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{item.body}</p>
            </div>
            <ChipList items={item.tags} className="mt-auto" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
