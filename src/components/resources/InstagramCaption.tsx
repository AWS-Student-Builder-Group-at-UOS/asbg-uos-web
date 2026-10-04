"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function InstagramCaption({ text, more, less, className }: { text: string; more: string; less: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;

    let active = true;
    const measure = () => {
      if (active) setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.fonts.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [text, open]);

  return (
    <div className={className}>
      <p ref={ref} className={cn("whitespace-pre-line text-sm leading-relaxed text-muted", !open && "line-clamp-4")}>
        {open ? text : text.replace(/\s*\n+\s*/g, " ")}
      </p>
      {clamped && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="-mx-1 -mb-2 mt-0.5 block w-fit px-1 py-2 font-mono text-xs text-accent"
        >
          {open ? less : more}
        </button>
      )}
    </div>
  );
}
