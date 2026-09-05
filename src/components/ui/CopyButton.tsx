"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "./Button";

export function CopyButton({
  value,
  label,
  copiedLabel,
  variant = "ghost",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "ghost";
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
    <Button variant={variant} onClick={copy} aria-live="polite">
      <Icon name={copied ? "check" : "copy"} size={14} />
      {copied ? copiedLabel : label}
    </Button>
  );
}
