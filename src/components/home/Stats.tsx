import { Container } from "@/components/ui/Container";
import { getStats } from "@/lib/content";
import { getDict, type Locale } from "@/lib/i18n";
import { pad2 } from "@/lib/utils";

export function Stats({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.stats;
  const stats = getStats();
  const items = [
    { label: d.members, value: stats.members },
    { label: d.presentations, value: stats.presentations },
    { label: d.cohorts, value: stats.cohorts },
  ];

  return (
    <div className="border-b border-line bg-surface-2/60">
      <Container className="grid grid-cols-3 divide-x divide-line">
        {items.map((s, i) => (
          <div key={s.label} className="py-8 pl-5 first:pl-0 sm:py-10 sm:pl-8">
            <p className="index">{pad2(i + 1)}</p>
            <p className="mt-2 font-mono text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">{s.value}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted sm:text-sm">
              <span className="block size-1.5 shrink-0 bg-sky" />
              {s.label}
            </p>
          </div>
        ))}
      </Container>
    </div>
  );
}
