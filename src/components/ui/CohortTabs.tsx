import Link from "next/link";
import type { Cohort } from "@/lib/content";
import { cn } from "@/lib/utils";

export function CohortTabs({
  cohorts,
  active,
  href,
  label,
}: {
  cohorts: Cohort[];
  active: string;
  href: (cohort: string) => string;
  label: (n: number) => string;
}) {
  return (
    <nav className="flex gap-1 border-b border-line" aria-label="Cohort">
      {[...cohorts].reverse().map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={href(c.slug)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2.5 font-mono text-sm transition-colors duration-200",
              isActive ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {label(c.number)}
          </Link>
        );
      })}
    </nav>
  );
}
