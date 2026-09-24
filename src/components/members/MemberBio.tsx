"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function MemberBio({ text, more, less, className }: { text: string; more: string; less: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<{ lines: number; clamped: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    const button = buttonRef.current;
    const card = el?.closest<HTMLElement>("[data-member-card]");
    const media = card?.querySelector<HTMLElement>("[data-member-media]");
    const header = el?.parentElement?.previousElementSibling;
    if (!el || !button || !card || !media || !header) return;

    let disposed = false;
    const px = (value: string) => Number.parseFloat(value) || 0;
    const measure = () => {
      if (disposed) return;
      const lineHeight = px(getComputedStyle(el).lineHeight);
      const cardStyle = getComputedStyle(card);
      const desktop = cardStyle.display === "flex";
      let available = lineHeight * 4;

      if (desktop) {
        const topInset = px(cardStyle.paddingTop) + px(cardStyle.borderTopWidth);
        const bottomInset = px(cardStyle.paddingBottom) + px(cardStyle.borderBottomWidth);
        // 펼친 카드 높이가 아닌, 기본 높이와 사진·키워드의 실제 높이를 기준으로 삼는다.
        const collapsedHeight = Math.max(
          px(cardStyle.minHeight),
          media.getBoundingClientRect().height + topInset + bottomInset,
        );
        available = collapsedHeight - bottomInset - (el.getBoundingClientRect().top - card.getBoundingClientRect().top);
      }

      // 버튼 없이 전체 소개가 들어가면 접지 않는다.
      const clamped = el.scrollHeight > available + 1;
      const buttonStyle = getComputedStyle(button);
      const buttonSpace = px(buttonStyle.lineHeight) + px(buttonStyle.paddingTop) + px(buttonStyle.paddingBottom)
        + px(buttonStyle.borderTopWidth) + px(buttonStyle.borderBottomWidth)
        + px(buttonStyle.marginTop) + px(buttonStyle.marginBottom);
      const lines = desktop ? Math.max(1, Math.floor((available - buttonSpace) / lineHeight)) : 4;
      setLayout((previous) => previous?.lines === lines && previous.clamped === clamped ? previous : { lines, clamped });
      if (!clamped) setOpen(false);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(card);
    observer.observe(media);
    observer.observe(header);
    // 접힌 높이가 같아도 폰트가 바뀌면 줄 수를 다시 잰다.
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      disposed = true;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [text]);

  const show = layout?.clamped ?? false;

  return (
    <div className={className}>
      <p
        ref={ref}
        className={cn("text-sm leading-relaxed text-muted", !open && (!layout || layout.clamped) && "line-clamp-4 sm:line-clamp-8")}
        style={!open && layout?.clamped ? { WebkitLineClamp: layout.lines } : undefined}
      >
        {text}
      </p>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("-mx-1 -mb-2 mt-0.5 w-fit px-1 py-2 font-mono text-xs text-accent", show ? "block" : "hidden")}
      >
        {open ? less : more}
      </button>
    </div>
  );
}
