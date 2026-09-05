import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-colors duration-200";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-ink hover:text-canvas",
  ghost: "border border-line-strong text-ink hover:border-accent hover:text-accent",
};

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: keyof typeof variants; children: ReactNode }) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
