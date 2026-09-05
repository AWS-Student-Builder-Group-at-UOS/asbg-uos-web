import { Loop } from "@/components/diagrams/Loop";
import { Section, SectionHead } from "@/components/ui/Section";
import { Trace } from "@/components/ui/Trace";
import { getDict, type Locale } from "@/lib/i18n";
import { pad2 } from "@/lib/utils";

export function Flow({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.flow;
  const labels = d.nodes.map((n) => n.label) as [string, string, string, string];

  return (
    <Section>
      <SectionHead eyebrow={d.eyebrow} title={d.title} body={d.body} />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Loop
          id="cycle"
          labels={labels}
          center={<span className="font-mono text-sm tracking-[0.2em] text-muted uppercase">{d.center}</span>}
        />
        <ol className="space-y-7">
          {d.nodes.map((n, i) => (
            <li key={n.label} className="flex gap-5">
              <span className="pt-0.5 font-mono text-sm text-accent">{pad2(i + 1)}</span>
              <div>
                <p className="font-mono font-medium">{n.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[15px]">{n.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Trace className="my-14 sm:my-16" />

      <p className="eyebrow">{d.keywordsTitle}</p>
      <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {d.keywords.map((k) => (
          <li key={k.label}>
            <p className="font-mono text-2xl font-semibold tracking-tight">{k.label}</p>
            <p className="mt-2 text-sm text-muted">{k.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
