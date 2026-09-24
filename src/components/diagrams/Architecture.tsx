import { glyphPath, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

type Key = "users" | "route53" | "cloudfront" | "alb" | "app1" | "app2" | "app3" | "rds" | "s3" | "iam" | "cloudwatch" | "budgets";
type Pt = readonly [number, number];
type Layout = {
  w: number;
  h: number;
  dir: "h" | "v";
  pos: Record<Key, Pt>;
  account: readonly [number, number, number, number];
  group: readonly [number, number, number, number];
  rail: readonly [number, number, number, number];
};

export type ArchitectureCaptions = Partial<Record<"users" | "route53" | "cloudfront" | "alb" | "compute" | "autoscaling" | "rds" | "s3" | "iam" | "cloudwatch" | "budgets", string>>;

const NODES: { key: Key; name: string; icon: IconName; caption: keyof ArchitectureCaptions }[] = [
  { key: "users", name: "Users", icon: "users", caption: "users" },
  { key: "route53", name: "Route 53", icon: "globe", caption: "route53" },
  { key: "cloudfront", name: "CloudFront", icon: "layers", caption: "cloudfront" },
  { key: "alb", name: "ALB", icon: "balancer", caption: "alb" },
  { key: "app1", name: "EC2", icon: "server", caption: "compute" },
  { key: "app2", name: "EC2", icon: "server", caption: "compute" },
  { key: "app3", name: "EC2", icon: "server", caption: "compute" },
  { key: "rds", name: "RDS", icon: "database", caption: "rds" },
  { key: "s3", name: "S3", icon: "bucket", caption: "s3" },
  { key: "iam", name: "IAM", icon: "key", caption: "iam" },
  { key: "cloudwatch", name: "CloudWatch", icon: "chart", caption: "cloudwatch" },
  { key: "budgets", name: "Budgets", icon: "bell", caption: "budgets" },
];

const BOX = { w: 132, h: 64 };

const H: Layout = {
  w: 900,
  h: 600,
  dir: "h",
  pos: {
    users: [70, 300],
    route53: [250, 170],
    cloudfront: [250, 430],
    alb: [420, 300],
    app1: [610, 205],
    app2: [610, 300],
    app3: [610, 395],
    rds: [810, 230],
    s3: [810, 370],
    iam: [320, 530],
    cloudwatch: [520, 530],
    budgets: [720, 530],
  },
  account: [150, 60, 740, 520],
  group: [524, 118, 172, 336],
  rail: [190, 530, 850, 530],
};

const V: Layout = {
  w: 480,
  h: 930,
  dir: "v",
  pos: {
    users: [240, 60],
    route53: [130, 230],
    cloudfront: [350, 230],
    alb: [240, 370],
    app1: [104, 525],
    app2: [240, 525],
    app3: [376, 525],
    rds: [130, 700],
    s3: [350, 700],
    iam: [104, 840],
    cloudwatch: [240, 840],
    budgets: [376, 840],
  },
  account: [16, 150, 448, 750],
  group: [28, 460, 424, 130],
  rail: [40, 840, 440, 840],
};

function elbow(dir: "h" | "v", [x1, y1]: Pt, [x2, y2]: Pt) {
  if (dir === "h") {
    if (y1 === y2) return `M${x1} ${y1}H${x2}`;
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1}H${mx}V${y2}H${x2}`;
  }
  if (x1 === x2) return `M${x1} ${y1}V${y2}`;
  const my = (y1 + y2) / 2;
  return `M${x1} ${y1}V${my}H${x2}V${y2}`;
}

function route(l: Layout, keys: Key[]) {
  const parts = keys.slice(1).map((k, i) => elbow(l.dir, l.pos[keys[i]], l.pos[k]));
  return parts.map((p, i) => (i === 0 ? p : p.replace(/^M/, "L"))).join("");
}

const EDGES: { from: Key; to: Key; dotted?: boolean }[] = [
  { from: "users", to: "route53", dotted: true },
  { from: "users", to: "cloudfront" },
  { from: "cloudfront", to: "alb" },
  { from: "alb", to: "app1" },
  { from: "alb", to: "app2" },
  { from: "alb", to: "app3" },
  { from: "app2", to: "rds" },
  { from: "app3", to: "s3" },
];

function Diagram({ l, captions, className }: { l: Layout; captions: ArchitectureCaptions; className?: string }) {
  const main = route(l, ["users", "cloudfront", "alb", "app2", "rds"]);
  const lookup = route(l, ["users", "route53"]);
  const store = route(l, ["app3", "s3"]);
  const [ax, ay, aw, ah] = l.account;
  const [gx, gy, gw, gh] = l.group;

  return (
    <svg viewBox={`0 0 ${l.w} ${l.h}`} className={cn("h-auto w-full", className)} role="img" aria-label="Users → Route 53 / CloudFront → ALB → EC2 (Auto Scaling) → RDS / S3">
      <rect x={ax} y={ay} width={aw} height={ah} fill="var(--surface-2)" fillOpacity="0.5" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={ax + 14} y={ay + 22} className="fill-faint font-mono text-[11px] uppercase tracking-[0.14em]">
        AWS Account
      </text>

      <line x1={l.rail[0]} y1={l.rail[1]} x2={l.rail[2]} y2={l.rail[3]} stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="2 6" />

      <rect x={gx} y={gy} width={gw} height={gh} fill="var(--accent-soft)" fillOpacity="0.6" stroke="var(--sky)" strokeWidth="1.5" strokeDasharray="8 5" />
      <text x={gx + 12} y={gy + 20} className="fill-accent font-mono text-[11px] font-medium">
        Auto Scaling
      </text>
      {captions.autoscaling &&
        (l.dir === "h" ? (
          <text x={gx + 12} y={gy + 36} className="fill-muted text-[11px]">
            {captions.autoscaling}
          </text>
        ) : (
          <text x={gx + gw - 12} y={gy + 20} textAnchor="end" className="fill-muted text-[11px]">
            {captions.autoscaling}
          </text>
        ))}

      {EDGES.map((e) => (
        <path
          key={`${e.from}-${e.to}`}
          d={elbow(l.dir, l.pos[e.from], l.pos[e.to])}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="2"
          strokeDasharray={e.dotted ? "3 5" : undefined}
        />
      ))}
      <path d={main} fill="none" stroke="var(--sky)" strokeWidth="2" className="trace" opacity="0.9" />

      {NODES.map((n) => {
        const [x, y] = l.pos[n.key];
        const caption = captions[n.caption];
        const isApp = n.key.startsWith("app");
        return (
          <g key={n.key}>
            <rect x={x - BOX.w / 2} y={y - BOX.h / 2} width={BOX.w} height={BOX.h} fill="var(--surface)" stroke={isApp ? "var(--sky)" : "var(--line-strong)"} strokeWidth="1.5" />
            <path d={glyphPath(n.icon)} transform={`translate(${x - BOX.w / 2 + 12} ${y - 10}) scale(1.25)`} fill="var(--accent)" />
            <text x={x - BOX.w / 2 + 42} y={y - 3} className="fill-ink font-mono text-[13px] font-semibold">
              {n.name}
            </text>
            {caption && (
              <text x={x - BOX.w / 2 + 42} y={y + 15} className="fill-muted text-[11px]">
                {caption}
              </text>
            )}
            {isApp && (
              <rect x={x + BOX.w / 2 - 14} y={y - BOX.h / 2 + 8} width="6" height="6" fill="var(--sky)" data-blink style={{ animation: `blink 2.4s ${Number(n.key.slice(-1)) * 0.5}s ease-in-out infinite` }} />
            )}
          </g>
        );
      })}

      {[0, 1].map((i) => (
        <rect key={i} className="packet" x="-5" y="-5" width="10" height="10" fill="var(--sky)" opacity={i === 0 ? 1 : 0.55}>
          <animateMotion dur="9s" repeatCount="indefinite" begin={`${-i * 4.5}s`} path={main} />
        </rect>
      ))}
      <rect className="packet" x="-4" y="-4" width="8" height="8" fill="var(--accent)" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite" path={lookup} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" />
      </rect>
      <rect className="packet" x="-4" y="-4" width="8" height="8" fill="var(--accent)" opacity="0.8">
        <animateMotion dur="5s" repeatCount="indefinite" begin="-2s" path={store} />
      </rect>
    </svg>
  );
}

export function Architecture({ captions, className }: { captions: ArchitectureCaptions; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <Diagram l={H} captions={captions} className="hidden md:block" />
      <Diagram l={V} captions={captions} className="mx-auto block max-w-[480px] md:hidden" />
    </div>
  );
}
