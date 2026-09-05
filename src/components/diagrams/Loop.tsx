import type { ReactNode } from "react";
import { glyphPath, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

/*
 * 히어로의 폐루프. 칩(로고)을 둘러싼 안쪽 트레이스와, 네 개의 노드를 도는 바깥 트레이스가
 * 모서리마다 45° 버스로 이어진다. 패킷은 바깥은 시계, 안쪽은 반시계로 돈다.
 */
const SIZE = 520;
const OUTER = "M260 40H420L480 100V420L420 480H100L40 420V100L100 40Z";
const INNER = "M260 150H340L370 180V340L340 370H180L150 340V180L180 150Z";
const CHIP = { x: 200, y: 200, w: 120 };

const NODES = [
  { x: 260, y: 40, lx: 260, ly: 18, icon: "book" },
  { x: 480, y: 260, lx: 480, ly: 300, icon: "wrench" },
  { x: 260, y: 480, lx: 260, ly: 512, icon: "speaker" },
  { x: 40, y: 260, lx: 40, ly: 300, icon: "network" },
] as const satisfies readonly { x: number; y: number; lx: number; ly: number; icon: IconName }[];

// 안쪽 모따기 중점 → 바깥 모따기 중점을 잇는 버스
const BUSES = [
  [355, 165, 450, 70],
  [355, 355, 450, 450],
  [165, 355, 70, 450],
  [165, 165, 70, 70],
] as const;

// 칩에서 안쪽 트레이스로 뻗는 핀 (변마다 3개)
const PINS = [-30, 0, 30].flatMap((o) => [
  [CHIP.x + 60 + o, CHIP.y, CHIP.x + 60 + o, 150],
  [CHIP.x + 60 + o, CHIP.y + CHIP.w, CHIP.x + 60 + o, 370],
  [CHIP.x, CHIP.y + 60 + o, 150, CHIP.y + 60 + o],
  [CHIP.x + CHIP.w, CHIP.y + 60 + o, 370, CHIP.y + 60 + o],
]);

export function Loop({
  id,
  labels,
  center,
  className,
}: {
  id: string;
  labels: readonly string[];
  center?: ReactNode;
  className?: string;
}) {
  const outer = `${id}-outer`;
  const inner = `${id}-inner`;
  const grid = `${id}-grid`;

  return (
    <div className={cn("relative mx-auto w-full max-w-[520px]", className)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-auto w-full overflow-visible" role="img" aria-label={labels.join(" → ")}>
        <defs>
          <pattern id={grid} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" x="9" y="9" fill="var(--line-strong)" />
          </pattern>
        </defs>

        {/* 배경 격자 — 바깥 루프 안쪽에만 */}
        <path d={OUTER} fill={`url(#${grid})`} opacity="0.7" />

        {/* 버스와 핀 */}
        {BUSES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" strokeWidth="2" />
        ))}
        {PINS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" strokeWidth="2" />
        ))}

        {/* 바깥 루프: 고정선 + 흐르는 점선 */}
        <path id={outer} d={OUTER} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <path d={OUTER} fill="none" stroke="var(--sky)" strokeWidth="2" className="trace" opacity="0.9" />

        {/* 안쪽 루프: 반대 방향으로 흐른다 */}
        <path id={inner} d={INNER} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2" />
        <path d={INNER} fill="none" stroke="var(--sky)" strokeWidth="1.5" className="trace-rev" opacity="0.8" />

        {/* 칩 패드 */}
        <rect x={CHIP.x} y={CHIP.y} width={CHIP.w} height={CHIP.w} fill="var(--surface-2)" stroke="var(--sky)" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={i % 2 === 0 ? CHIP.x + 6 : CHIP.x + CHIP.w - 12}
            y={i < 2 ? CHIP.y + 6 : CHIP.y + CHIP.w - 12}
            width="6"
            height="6"
            fill="var(--sky)"
            opacity="0.7"
          />
        ))}

        {/* 모따기의 비아 — 순서대로 점멸 */}
        {BUSES.map(([, , x, y], i) => (
          <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="var(--sky)" data-blink style={{ animation: `blink 3.2s ${i * 0.8}s ease-in-out infinite` }} />
        ))}

        {/* 패킷 */}
        {[0, 1, 2].map((i) => (
          <rect key={i} className="packet" x="-6" y="-6" width="12" height="12" fill="var(--sky)" opacity={i === 0 ? 1 : 0.5}>
            <animateMotion dur="12s" repeatCount="indefinite" begin={`${-i * 4}s`}>
              <mpath href={`#${outer}`} />
            </animateMotion>
          </rect>
        ))}
        {[0, 1].map((i) => (
          <rect key={i} className="packet" x="-4" y="-4" width="8" height="8" fill="var(--accent)" opacity={i === 0 ? 0.9 : 0.5}>
            <animateMotion dur="7s" repeatCount="indefinite" begin={`${-i * 3.5}s`} keyPoints="1;0" keyTimes="0;1" calcMode="linear">
              <mpath href={`#${inner}`} />
            </animateMotion>
          </rect>
        ))}

        {/* 노드 */}
        {NODES.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 17} y={n.y - 17} width="34" height="34" fill="var(--sky)" opacity="0.25" className="pulse-ring" style={{ animationDelay: `${i * 0.6}s` }} />
            <rect x={n.x - 17} y={n.y - 17} width="34" height="34" fill="var(--canvas)" stroke="var(--sky)" strokeWidth="2" />
            <path d={glyphPath(n.icon)} transform={`translate(${n.x - 10} ${n.y - 10}) scale(1.25)`} fill="var(--accent)" />
            <text x={n.lx} y={n.ly} textAnchor="middle" className="fill-ink font-mono text-[15px] font-medium tracking-tight">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
      {center && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{center}</div>}
    </div>
  );
}
