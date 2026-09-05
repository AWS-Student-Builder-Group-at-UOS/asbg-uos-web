import { cn } from "@/lib/utils";

export function PixelField({ cols = 14, rows = 9, className }: { cols?: number; rows?: number; className?: string }) {
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const x = i % cols;
    const y = Math.floor(i / cols);
    const on = (x * 7 + y * 13) % 5 === 0;
    return { i, delay: ((x * 3 + y * 5) % 12) * 0.35, duration: 3 + ((x + y) % 4), on };
  });

  return (
    <div
      aria-hidden="true"
      className={cn("grid gap-[6px]", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 6px)` }}
    >
      {cells.map((c) => (
        <span
          key={c.i}
          data-blink
          className={cn("block h-[6px] w-[6px]", c.on ? "bg-sky" : "bg-line")}
          style={c.on ? { animation: `blink ${c.duration}s ${c.delay}s ease-in-out infinite` } : undefined}
        />
      ))}
    </div>
  );
}
