import Link from "next/link";
import type { MouseEventHandler } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Logo({
  href,
  className,
  onClick,
  variant = "default",
}: {
  href: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  variant?: "default" | "header";
}) {
  const header = variant === "header";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("inline-flex shrink-0 items-center text-ink", header ? "gap-2 min-[360px]:gap-2.5 sm:gap-3" : "gap-2.5", className)}
      aria-label="ASBG UOS home"
    >
      <Icon name="logo" size={22} className={cn("shrink-0 text-sky", header && "size-6 min-[360px]:size-7 sm:size-8")} />
      <span className={cn("whitespace-nowrap font-mono font-semibold tracking-tight", header ? "text-[17px] min-[360px]:text-lg sm:text-xl" : "text-[15px]")}>ASBG UOS</span>
    </Link>
  );
}
