"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 멤버 소개글. 모바일(sm 미만)에서는 4줄로 접고 "더 보기"로 펼친다.
 * 실제로 잘린 경우에만 버튼을 보이고, 그 외에는 자리만 남겨 레이아웃이 튀지 않게 한다.
 * 접힌 상자는 높이가 변하지 않아 ResizeObserver만으로는 부족하므로, 웹폰트가 늦게 도착해 줄 수가 바뀌는 경우도 다시 잰다.
 */
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
