import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* 네 개의 노드를 도는 폐루프. 칩 주변을 도는 회로 트레이스처럼 그리고, 패킷이 계속 순환한다. */
const SIZE = 480;
const PATH = "M240 60H380L420 100V380L380 420H100L60 380V100L100 60Z";
const NODES = [
  { x: 240, y: 60, lx: 240, ly: 32, anchor: "middle" },
  { x: 420, y: 240, lx: 420, ly: 278, anchor: "middle" },
  { x: 240, y: 420, lx: 240, ly: 458, anchor: "middle" },
  { x: 60, y: 240, lx: 60, ly: 278, anchor: "middle" },
] as const;

export function Loop({
  id,
  labels,
  center,
  className,
}: {
  id: string;
  labels: readonly [string, string, string, string];
  center?: ReactNode;
  className?: string;
}) {
  const pathId = `${id}-path`;
  return (
    <div className={cn("relative mx-auto w-full max-w-[480px]", className)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-auto w-full" role="img" aria-label={labels.join(" → ")}>
        <path id={pathId} d={PATH} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <path d={PATH} fill="none" stroke="var(--sky)" strokeWidth="2" className="trace" opacity="0.9" />

        {[0, 1, 2].map((i) => (
          <rect key={i} className="packet" x="-6" y="-6" width="12" height="12" fill="var(--sky)" opacity={i === 0 ? 1 : 0.55}>
            <animateMotion dur="10s" repeatCount="indefinite" begin={`${-i * 3.33}s`}>
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </rect>
        ))}

        {NODES.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 13} y={n.y - 13} width="26" height="26" fill="var(--canvas)" stroke="var(--sky)" strokeWidth="2" />
            <rect x={n.x - 5} y={n.y - 5} width="10" height="10" fill="var(--sky)" data-blink style={{ animation: `blink 2.4s ${i * 0.6}s ease-in-out infinite` }} />
            <text x={n.lx} y={n.ly} textAnchor={n.anchor} className="fill-ink font-mono text-[15px] font-medium tracking-tight">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
      {center && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{center}</div>}
    </div>
  );
}
