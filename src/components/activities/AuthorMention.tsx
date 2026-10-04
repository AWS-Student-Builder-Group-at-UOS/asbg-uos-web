import Link from "next/link";
import type { Activity } from "@/lib/content";
import { pick, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export function AuthorMention({ author, cohort, locale }: {
  author: NonNullable<Activity["author"]>;
  cohort: string;
  locale: Locale;
}) {
  if (typeof author === "object" && "group" in author) {
    return (
      <Link href={routes.members(locale, cohort, author.group)} className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline underline-offset-4">
        @{author.group}
      </Link>
    );
  }
  return <span className="text-sm text-muted">{pick(author, locale)}</span>;
}
