"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";
import { getDict, type Locale } from "@/lib/i18n";
import type { InstagramPost } from "@/lib/instagram";
import { cn } from "@/lib/utils";

export function InstagramGallery({ post, locale, className }: { post: InstagramPost; locale: Locale; className?: string }) {
  const d = getDict(locale).resources.feed;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [cover] = post.slides;
  const total = post.slides.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  const go = (to: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: Math.max(0, Math.min(total - 1, to)) * track.clientWidth });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        aria-label={d.viewPhotos}
        className={cn("group relative aspect-[3/4] shrink-0 cursor-zoom-in overflow-hidden rounded-md border border-line bg-surface-2", className)}
      >
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes="(min-width: 640px) 144px, 96px"
          alt={post.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-(--ease-soft) group-hover:scale-[1.03]"
        />
        {(total > 1 || cover.video) && (
          <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[11px] leading-4 text-white backdrop-blur-sm">
            <Icon name={total > 1 ? "carousel" : "play"} size={12} />
            {total > 1 && total}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={post.title ?? d.untitled}
        onClose={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-black/90 p-0 text-white backdrop-blur-md"
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
              <time dateTime={post.date} className="font-mono text-xs text-white/60">{post.date}</time>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-2 py-2 font-mono text-xs text-white/70 transition-colors duration-200 hover:text-white"
              >
                {d.open}
                <Icon name="external" size={12} />
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={d.close}
                className="inline-flex size-10 items-center justify-center rounded-sm text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <ul
              ref={trackRef}
              onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
              className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
            >
              {post.slides.map((slide, i) => (
                <li
                  key={slide.src}
                  onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
                  className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4 pb-2 [container-type:size] sm:px-6"
                >
                  <div className="relative">
                    <img
                      src={slide.src}
                      srcSet={slide.srcSet}
                      sizes="(min-width: 640px) 75vh, 100vw"
                      width={slide.width}
                      height={slide.height}
                      alt={i === 0 ? post.alt : ""}
                      loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                      style={{ width: `min(100cqw, ${slide.width / slide.height} * 100cqh)` }}
                      className="block h-auto rounded-md"
                    />
                    {slide.video && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={d.play}
                        className="absolute inset-0 m-auto inline-flex size-16 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/70"
                      >
                        <Icon name="play" size={28} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-4 px-4 py-3">
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    disabled={index === 0}
                    aria-label={d.prev}
                    className="inline-flex size-10 items-center justify-center rounded-sm text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Icon name="arrowLeft" size={16} />
                  </button>
                  <p aria-live="polite" className="min-w-14 text-center font-mono text-xs tabular-nums text-white/70">
                    {index + 1} / {total}
                  </p>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    disabled={index === total - 1}
                    aria-label={d.next}
                    className="inline-flex size-10 items-center justify-center rounded-sm text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Icon name="arrowRight" size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
