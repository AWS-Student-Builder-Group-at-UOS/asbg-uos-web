import { Gap } from "@/components/diagrams/Gap";
import { Icon } from "@/components/icons";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";

export function Why({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.why;

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHead index="01" eyebrow={d.eyebrow} title={d.title} />
          <ul className="mt-8 space-y-3 border-t border-line pt-6">
            {d.facts.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm sm:text-[15px]">
                <Icon name="check" size={14} className="mt-1 shrink-0 text-sky" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {d.body.map((p) => (
            <p key={p} className="text-base leading-[1.85] text-muted [&+&]:mt-5 sm:text-lg">
              {p}
            </p>
          ))}
          <Gap learned={d.gap.learned} missing={d.gap.missing} caption={d.gap.caption} tags={d.gap.tags} className="mt-10" />
        </div>
      </div>
    </Section>
  );
}
