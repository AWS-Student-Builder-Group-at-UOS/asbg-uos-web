import { Icon, type IconName } from "@/components/icons";
import { Trace } from "@/components/ui/Trace";
import { cn } from "@/lib/utils";

/* 수업이 다루는 단계(만들기)와 우리가 채우는 단계(올리기·지키기)를 세 칸으로 잇는다. */
type Tile = { label: string; body: string };

const icons: IconName[] = ["terminal", "cloud", "key"];

export function Gap({
  learned,
  missing,
  caption,
  tags,
  className,
}: {
  learned: Tile;
  missing: readonly Tile[];
  caption: string;
  tags: { school: string; club: string };
  className?: string;
}) {
  const tiles = [learned, ...missing];

  return (
    <div className={cn("card grid-bg p-5 sm:p-6", className)}>
      <ol className="flex flex-col sm:flex-row sm:items-stretch">
        {tiles.map((t, i) => (
          <li key={t.label} className="contents">
            {i > 0 && (
              <>
                <div className="flex h-8 justify-center sm:hidden">
                  <Trace vertical />
                </div>
                <div className="hidden w-8 shrink-0 sm:flex sm:items-center">
                  <Trace />
                </div>
              </>
            )}
            <div
              className={cn(
                "pads flex flex-1 flex-col gap-2 border bg-surface p-4",
                i === 0 ? "border-line" : "border-sky",
              )}
            >
              <div className="flex items-center justify-between">
                <Icon name={icons[i]} size={16} className={i === 0 ? "text-faint" : "text-accent"} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{i === 0 ? tags.school : tags.club}</span>
              </div>
              <p className="font-mono text-base font-semibold">{t.label}</p>
              <p className="text-xs leading-relaxed text-muted sm:text-[13px]">{t.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">{caption}</p>
    </div>
  );
}
