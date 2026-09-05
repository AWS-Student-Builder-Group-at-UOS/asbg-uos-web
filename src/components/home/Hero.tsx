import { Loop } from "@/components/diagrams/Loop";
import { PixelField } from "@/components/diagrams/PixelField";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDict, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export function Hero({ locale, latestCohort }: { locale: Locale; latestCohort: string }) {
  const { hero } = getDict(locale).home;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <PixelField cols={22} rows={14} className="absolute -right-6 top-8 hidden opacity-70 xl:grid" />
      <Container className="grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="rise">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.4rem]">
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
        </div>

        <Loop
          id="hero"
          labels={["Learn", "Build", "Share", "Connect"]}
          className="rise [animation-delay:120ms]"
          center={
            <div className="flex flex-col items-center gap-3">
              <Icon name="logo" size={72} className="text-sky" />
              <span className="font-mono text-xs tracking-[0.22em] text-muted">ASBG UOS</span>
            </div>
          }
        />
      </Container>
    </section>
  );
}
