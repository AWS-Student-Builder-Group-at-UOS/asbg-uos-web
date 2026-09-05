"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      aria-live="polite"
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-sm font-mono text-ink transition-colors duration-200 hover:text-accent",
        className,
      )}
    >
      <span className="truncate underline decoration-line-strong decoration-dotted underline-offset-[5px] group-hover:decoration-accent">{value}</span>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 text-[11px] transition-colors duration-200",
          copied ? "text-accent" : "text-faint group-hover:text-accent",
        )}
      >
        <Icon name={copied ? "check" : "copy"} size={12} />
        {copied && copiedLabel}
      </span>
    </button>
  );
}
