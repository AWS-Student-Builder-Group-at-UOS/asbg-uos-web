import Link from "next/link";
import type { MouseEventHandler } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Logo({
  href,
  className,
  onClick,
}: {
  href: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link href={href} onClick={onClick} className={cn("inline-flex items-center gap-2.5 text-ink", className)} aria-label="ASBG UOS home">
      <Icon name="logo" size={22} className="text-sky" />
      <span className="font-mono text-[15px] font-semibold tracking-tight">ASBG UOS</span>
    </Link>
  );
}
