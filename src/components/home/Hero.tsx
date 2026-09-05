import { Loop } from "@/components/diagrams/Loop";
import { PixelField } from "@/components/diagrams/PixelField";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDict, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { pad2 } from "@/lib/utils";

export function Hero({ locale, latestCohort }: { locale: Locale; latestCohort: string }) {
  const { hero, keywords } = getDict(locale).home;
  const words = keywords.items.map((k) => k.label);

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_50%,black_20%,transparent_70%)]" />
      <PixelField cols={22} rows={14} className="absolute -right-6 top-8 hidden opacity-70 2xl:grid" />

      <Container className="relative grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="rise">
          <p className="flex items-center gap-2.5">
            <span data-blink className="block size-2 bg-sky" style={{ animation: "blink 2.4s ease-in-out infinite" }} />
            <span className="eyebrow">{hero.eyebrow}</span>
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-[2.75rem] xl:text-[3.3rem]">
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{hero.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={routes.sessions(locale, latestCohort)}>
              {hero.primary}
              <Icon name="arrowRight" size={12} />
            </ButtonLink>
            <ButtonLink variant="ghost" href={routes.members(locale, latestCohort)}>
              {hero.secondary}
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
            {words.map((w, i) => (
              <li key={w} className="flex items-center gap-2">
                <span className="tabular-nums text-faint">{pad2(i + 1)}</span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <Loop
          id="hero"
          labels={words}
          className="rise [animation-delay:120ms]"
          center={
            <div className="flex flex-col items-center gap-2">
              <Icon name="logo" size={56} className="text-sky" />
              <span className="font-mono text-[11px] tracking-[0.22em] text-muted">ASBG UOS</span>
            </div>
          }
        />
      </Container>
    </section>
  );
}
