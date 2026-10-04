import { glyphPath } from "@/components/icons";
import type { Activity } from "@/lib/content";
import { pad2 } from "@/lib/utils";

const ACCENTS = Array.from({ length: 46 }, (_, k) => (k === 0 ? [0, 0] : [1080 - 24 * (k - 1), (192 * k) % 648]));

const number = (slug: string) => slug.match(/\d+$/)?.[0] ?? "";

export function ThumbnailFallback({ activity }: { activity: Activity }) {
  const upcoming = activity.status === "upcoming";
  const retrospective = activity.type === "retrospective";
  const id = `dots-${activity.cohort}-${activity.slug}`;
  const context = activity.session ? `SESSION ${pad2(activity.session)}` : `COHORT ${number(activity.cohort)}`;
  const label = activity.presentation ? `PRESENTATION ${pad2(activity.presentation)}` : "PRESENTATION";

  if (retrospective) {
    const keywords = activity.keywords.map((keyword) => keyword.toUpperCase());
    const lengths = keywords.map((keyword) => [...keyword].reduce((length, letter) => length + (letter.charCodeAt(0) <= 127 ? 1 : 2), 0));
    const longest = Math.max(...lengths);
    const size = longest <= 18 ? 64 : longest <= 23 ? 52 : 44;
    const baseline = longest <= 18 ? 360 : longest <= 23 ? 356 : 353;

    return (
      <svg data-pixel viewBox="0 0 1200 750" className="h-full w-full" aria-hidden="true" focusable="false">
        <rect width="1200" height="750" className="fill-white" />
        <rect width="204" height="750" className="fill-blue" />
        <rect x="204" width="4" height="750" className="fill-sky" />
        <path d="M102 280V654" fill="none" strokeWidth="4" className="stroke-sky" />
        <g className="fill-sky">
          {[280, 402, 524, 648].map((y) => <rect key={y} x="96" y={y} width="12" height="12" />)}
          <rect x="1052" y="64" width="64" height="16" />
          <rect x="1116" y="64" width="16" height="48" />
        </g>
        <svg x="38" y="64" width="128" height="128" viewBox="0 0 16 16" className="fill-white">
          <path d={glyphPath(upcoming ? "hourglass" : "file")} />
        </svg>
        <text x="268" y="106" fontSize="28" letterSpacing="4" className="fill-blue font-mono">ASBG UOS</text>
        <text x="260" y="252" fontSize="128" letterSpacing="-6" className="fill-black font-mono font-bold">RECAP</text>
        <path d="M268 395H1132M268 495H1132M268 595H1132" fill="none" strokeWidth="2" opacity="0.14" className="stroke-black" />
        <g className="fill-blue">
          {[342, 442, 542].map((y) => <rect key={y} x="268" y={y} width="16" height="16" />)}
        </g>
        <g className="fill-black font-mono font-bold">
          {keywords.map((keyword, i) => (
            <text key={i} x="320" y={baseline + i * 100} fontSize={size} textLength={lengths[i] > 28 ? 796 : undefined} lengthAdjust={lengths[i] > 28 ? "spacingAndGlyphs" : undefined}>{keyword}</text>
          ))}
        </g>
        <text x="268" y="678" fontSize="26" letterSpacing="3" className="fill-blue font-mono">
          COHORT {number(activity.cohort)}{activity.session ? ` · SESSION ${pad2(activity.session)}` : ""}{upcoming ? " · UPCOMING" : ""}
        </text>
      </svg>
    );
  }

  return (
    <svg data-pixel viewBox="0 0 1200 750" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" className="fill-sky opacity-30 dark:opacity-15" />
        </pattern>
      </defs>
      <g transform="translate(48 48)">
        <rect width="1104" height="654" fill={`url(#${id})`} />
        <g className="fill-sky opacity-50">
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
        className="stroke-sky"
      />
      <svg x="800" y="257" width="256" height="256" viewBox="0 0 16 16" className="fill-sky">
        <path d={glyphPath(upcoming ? "hourglass" : "file")} />
      </svg>
      <text x="84" y="132" fontSize="30" letterSpacing="4" className="fill-sky font-mono">
        ASBG UOS · COHORT {number(activity.cohort)}
      </text>
      <text x="84" y="440" fontSize="160" letterSpacing="-6" className="fill-muted font-mono font-semibold">
        {activity.session ? pad2(activity.session) : "ASBG"}
      </text>
      <text x="84" y="666" fontSize="26" letterSpacing="3" className="fill-muted font-mono">
        {context} · {upcoming ? "UPCOMING" : label}
      </text>
    </svg>
  );
}
