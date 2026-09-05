import { cn } from "@/lib/utils";

/* 회로 트레이스처럼 흐르는 점선 — 루프 도식과 같은 모티프. 가로가 기본, vertical 이면 세로. */
export function Trace({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <svg
      className={cn("text-sky", vertical ? "h-full w-px" : "h-px w-full", className)}
      preserveAspectRatio="none"
      viewBox={vertical ? "0 0 1 100" : "0 0 100 1"}
      aria-hidden="true"
    >
      <line
        x1={vertical ? 0.5 : 0}
        y1={vertical ? 0 : 0.5}
        x2={vertical ? 0.5 : 100}
        y2={vertical ? 100 : 0.5}
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="trace"
      />
    </svg>
  );
}
