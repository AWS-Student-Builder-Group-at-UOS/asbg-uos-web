"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function MemberBio({ text, more, less, className }: { text: string; more: string; less: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // 접힌 높이가 같아도 폰트가 바뀌면 줄 수를 다시 잰다.
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [open]);

  const show = open || clamped;

  return (
    <div className={className}>
      <p ref={ref} className={cn("text-sm leading-relaxed text-muted", !open && "line-clamp-4 sm:line-clamp-none")}>
        {text}
      </p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("-mx-1 -mb-2 mt-0.5 px-1 py-2 font-mono text-xs text-accent sm:hidden", !show && "invisible")}
      >
        {open ? less : more}
      </button>
    </div>
  );
}
