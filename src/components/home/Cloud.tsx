import { Architecture } from "@/components/diagrams/Architecture";
import { Chip } from "@/components/ui/Chip";
import { Section, SectionHead } from "@/components/ui/Section";
import { getDict, type Locale } from "@/lib/i18n";
import { pad2 } from "@/lib/utils";

export function Cloud({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.cloud;

  return (
    <Section id="cloud">
      <SectionHead index="03" eyebrow={d.eyebrow} title={d.title} body={d.body} />

      <div className="card grid-bg mt-12 p-4 sm:p-8">
        <Architecture captions={d.nodes} />
      </div>

      <div className="mt-8 max-w-3xl sm:mt-10">
        <p className="flex items-center gap-2.5">
          <span className="block size-2 bg-sky" />
          <span className="eyebrow">{d.noteLabel}</span>
        </p>
        <p className="mt-3 text-xl font-medium leading-[1.45] tracking-tight text-balance sm:text-2xl">{d.note}</p>
      </div>

      <ol className="mt-12 grid gap-x-6 gap-y-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5">
        {d.steps.map((s, i) => (
          <li key={s.label} className="border-t border-line pt-4">
            <p className="flex items-center gap-2 font-mono text-sm text-accent">
              <span className="block size-1.5 bg-sky" />
              {pad2(i + 1)}
            </p>
            <p className="mt-2 font-medium leading-snug">{s.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {d.vocab.map((v) => (
          <div key={v.group}>
            <p className="font-mono text-xs text-muted">{v.group}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {v.items.map((item) => (
                <li key={item}>
                  <Chip hash={false}>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
