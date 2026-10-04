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
    const size = longest <= 18 ? 56 : longest <= 23 ? 44 : 36;
    const baseline = longest <= 18 ? 318 : longest <= 23 ? 332 : 342;
    const step = longest <= 18 ? 74 : longest <= 23 ? 60 : 50;

    return (
      <svg data-pixel viewBox="0 0 1200 750" className="h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" className="fill-blue" opacity="0.09" />
          </pattern>
        </defs>
        <rect width="1200" height="750" fill="#F6F1E7" />
        <g transform="translate(48 48)">
          <rect width="1104" height="654" fill={`url(#${id})`} />
          <g className="fill-blue" opacity="0.5">
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
          className="stroke-blue"
        />
        <svg x="800" y="257" width="256" height="256" viewBox="0 0 16 16" className="fill-blue">
          <path d={glyphPath(upcoming ? "hourglass" : "file")} />
        </svg>
        <text x="84" y="132" fontSize="30" letterSpacing="4" className="fill-blue font-mono">
          ASBG UOS · COHORT {number(activity.cohort)}
        </text>
        <g className="fill-black font-mono font-bold">
          {keywords.map((keyword, i) => (
            <text key={i} x="84" y={baseline + i * step} fontSize={size} textLength={lengths[i] > 28 ? 628 : undefined} lengthAdjust={lengths[i] > 28 ? "spacingAndGlyphs" : undefined}>{keyword}</text>
          ))}
        </g>
        <text x="84" y="666" fontSize="26" letterSpacing="3" opacity="0.6" className="fill-black font-mono">
          RECAP{activity.session ? ` · SESSION ${pad2(activity.session)}` : ""}{upcoming ? " · UPCOMING" : ""}
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
