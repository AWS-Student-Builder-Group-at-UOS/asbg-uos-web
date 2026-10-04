import Link from "next/link";
import type { Member } from "@/lib/content";
import { pick, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SpeakerMention({
  member,
  locale,
  avatar = false,
  className,
}: {
  member: Member;
  locale: Locale;
  avatar?: boolean;
  className?: string;
}) {
  const name = pick(member.name, locale);
  return (
    <Link
      href={routes.members(locale, member.cohort, member.id)}
      className={cn("inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline underline-offset-4", className)}
    >
      {avatar && member.photoUrl && (
        <img src={member.photoUrl} alt="" width={24} height={24} className="size-6 rounded-sm border border-line object-cover" />
      )}
      @{name}
    </Link>
  );
}
