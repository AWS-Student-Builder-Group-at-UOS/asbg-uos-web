import { digitPath, glyphPath } from "@/components/icons";
import type { Activity } from "@/lib/content";
import { cn, pad2 } from "@/lib/utils";

const ACCENTS = Array.from({ length: 46 }, (_, k) => (k === 0 ? [0, 0] : [1080 - 24 * (k - 1), (192 * k) % 648]));

const number = (slug: string) => slug.match(/\d+$/)?.[0] ?? "";

const width = (keyword: string) => [...keyword].reduce((length, letter) => length + (letter.charCodeAt(0) <= 127 ? 1 : 2), 0);

export function ThumbnailFallback({ activity }: { activity: Activity }) {
  const upcoming = activity.status === "upcoming";
  const retrospective = activity.type === "retrospective";
  const id = `dots-${activity.cohort}-${activity.slug}`;
  const keywords = activity.keywords.map((keyword) => keyword.toUpperCase());
  const lengths = keywords.map(width);
  const longest = Math.max(...lengths);
  const size = longest <= 18 ? 56 : longest <= 23 ? 44 : 36;
  const baseline = longest <= 18 ? 318 : longest <= 23 ? 332 : 342;
  const step = longest <= 18 ? 74 : longest <= 23 ? 60 : 50;
  const label = upcoming ? "UPCOMING" : retrospective ? "RECAP" : `PRESENTATION${activity.presentation ? ` ${pad2(activity.presentation)}` : ""}`;
  const tone = retrospective
    ? { accent: "fill-blue", stroke: "stroke-blue", dots: "fill-sky opacity-30", text: upcoming ? "fill-black opacity-35" : "fill-black", label: "fill-black opacity-60" }
    : { accent: "fill-sky", stroke: "stroke-sky", dots: "fill-sky opacity-20 dark:opacity-15", text: upcoming ? "fill-faint" : "fill-ink", label: "fill-muted" };

  return (
    <svg data-pixel viewBox="0 0 1200 750" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" className={tone.dots} />
        </pattern>
      </defs>
      {retrospective ? <rect width="1200" height="750" fill="#F2FAFF" /> : <rect width="1200" height="750" className="fill-surface" />}
      <g transform="translate(48 48)">
        <rect width="1104" height="654" fill={`url(#${id})`} />
        <g className={cn(tone.accent, "opacity-50")}>
          {ACCENTS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" />
          ))}
        </g>
      </g>
      <path
        d="M736 214H1080L1120 254V516L1080 556H776L736 516Z"
        fill="none"
        strokeWidth="3"
        strokeDasharray="10 14"
        opacity="0.7"
        shapeRendering="geometricPrecision"
        className={tone.stroke}
      />
      <svg x="800" y="257" width="256" height="256" viewBox="0 0 16 16" className={tone.accent}>
        <path d={glyphPath(upcoming ? "hourglass" : retrospective ? "notebook" : "file")} />
      </svg>
      <text x="84" y="132" fontSize="30" letterSpacing="4" className={cn(tone.accent, "font-mono")}>
        ASBG UOS · COHORT {number(activity.cohort)}
      </text>
      <g className={cn(tone.text, "font-mono font-bold")}>
        {keywords.map((keyword, i) => (
          <text key={i} x="84" y={baseline + i * step} fontSize={size} textLength={lengths[i] > 28 ? 628 : undefined} lengthAdjust={lengths[i] > 28 ? "spacingAndGlyphs" : undefined}>{keyword}</text>
        ))}
      </g>
      {activity.session && (
        <g className={tone.accent}>
          {pad2(activity.session).split("").map((digit, i) => (
            <svg key={i} x={84 + i * 84} y="570" width="72" height="96" viewBox="0 0 6 8">
              <path d={digitPath(Number(digit))} />
            </svg>
          ))}
        </g>
      )}
      <g fontSize="26" letterSpacing="3" className={cn(tone.label, "font-mono")}>
        {activity.session && <text x="268" y="626">SESSION</text>}
        <text x={activity.session ? 268 : 84} y="666">{label}</text>
      </g>
    </svg>
  );
}
