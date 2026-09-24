import { glyphPath } from "@/components/icons";
import type { Session } from "@/lib/content";
import { pad2 } from "@/lib/utils";

const ACCENTS = Array.from({ length: 46 }, (_, k) => (k === 0 ? [0, 0] : [1080 - 24 * (k - 1), (192 * k) % 648]));

const number = (slug: string) => slug.match(/\d+$/)?.[0] ?? "";

export function ThumbnailFallback({ session }: { session: Session }) {
  const upcoming = session.status === "upcoming";
  const [sessionSlug, presentationSlug] = session.slug.split("/");
  const id = `dots-${session.cohort}-${sessionSlug}-${presentationSlug}`;

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
        ASBG UOS · COHORT {number(session.cohort)}
      </text>
      <text x="84" y="440" fontSize="160" letterSpacing="-6" className="fill-muted font-mono font-semibold">
        {pad2(session.number)}
      </text>
      <text x="84" y="666" fontSize="26" letterSpacing="3" className="fill-muted font-mono">
        SESSION {pad2(session.number)} · {upcoming ? "UPCOMING" : `PRESENTATION ${number(presentationSlug)}`}
      </text>
    </svg>
  );
}
