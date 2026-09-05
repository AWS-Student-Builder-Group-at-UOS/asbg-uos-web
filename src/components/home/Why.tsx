import { Icon } from "@/components/icons";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";

export function Why({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.why;

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHead eyebrow={d.eyebrow} title={d.title} />
        <div>
          {d.body.map((p) => (
            <p key={p} className="mt-0 text-base leading-[1.85] text-muted [&+&]:mt-5 sm:text-lg">
              {p}
            </p>
          ))}
          <ul className="mt-8 space-y-3 border-t border-line pt-6">
            {d.facts.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm sm:text-base">
                <Icon name="check" size={14} className="shrink-0 text-sky" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
