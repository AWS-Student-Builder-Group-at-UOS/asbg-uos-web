import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  body,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {(index || eyebrow) && (
        <p className="flex items-center gap-3">
          {index && <span className="index">{index}</span>}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{body}</p>}
    </div>
  );
}

export function PageHead({ title, body }: { title: string; body?: string }) {
  return (
    <div className="border-b border-line">
      <Container className="py-12 sm:py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {body && <p className="mt-3 max-w-2xl text-muted sm:text-lg">{body}</p>}
      </Container>
    </div>
  );
}
