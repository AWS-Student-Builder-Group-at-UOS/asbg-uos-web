import { cn } from "@/lib/utils";

/* 회로 트레이스처럼 흐르는 점선 구분선 — 루프 도식과 같은 모티프 */
export function Trace({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-px w-full text-sky", className)}
      preserveAspectRatio="none"
      viewBox="0 0 100 1"
      aria-hidden="true"
    >
      <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="trace" />
    </svg>
  );
}
