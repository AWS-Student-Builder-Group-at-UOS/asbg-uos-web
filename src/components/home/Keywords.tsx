import { Icon, type IconName } from "@/components/icons";
import { Section, SectionHead } from "@/components/ui/Section";
import { Trace } from "@/components/ui/Trace";
import { getDict, type Locale } from "@/lib/i18n";

const icons: IconName[] = ["book", "wrench", "speaker", "network"];

/* 네 단어를 한 줄 버스로 잇는다. 히어로의 루프와 같은 트레이스 모티프지만 직선이다. */
export function Keywords({ locale }: { locale: Locale }) {
  const d = getDict(locale).home.keywords;

  return (
    <Section className="border-y border-line bg-surface-2/70">
      <SectionHead index="04" eyebrow={d.eyebrow} title={d.title} body={d.body} />
      <div className="relative mt-12">
        <div className="absolute top-6 left-6 right-[calc(25%-42px)] hidden lg:block">
          <Trace />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {d.items.map((k, i) => (
            <li key={k.label} className="relative">
              <span className="relative inline-flex size-12 items-center justify-center border border-sky bg-canvas text-accent">
                <Icon name={icons[i]} size={20} />
                <span data-blink className="absolute -top-1 -right-1 size-2 bg-sky" style={{ animation: `blink 2.4s ${i * 0.6}s ease-in-out infinite` }} />
              </span>
              <p className="mt-5 font-mono text-2xl font-semibold tracking-tight">{k.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{k.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
