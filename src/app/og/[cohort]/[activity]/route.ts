import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getCohorts, getActivity, getActivities, hasCohort } from "@/lib/content";
import { activityDir } from "@/lib/content/paths";

export const dynamic = "force-static";
export const dynamicParams = false;

const fontsDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), "src/assets/fonts");
process.env.FONTCONFIG_PATH = fontsDir;
process.env.FONTCONFIG_FILE = path.join(fontsDir, "fonts.conf");

type Params = { cohort: string; activity: string };

export function generateStaticParams(): Params[] {
  return getCohorts().flatMap((cohort) =>
    getActivities(cohort.slug)
      .filter((s) => s.status === "done" && s.thumbnail)
      .map((activity) => ({ cohort: cohort.slug, activity: activity.slug })),
  );
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { cohort, activity } = await params;
  if (!hasCohort(cohort)) return new Response("Not found", { status: 404 });

  const s = getActivity(cohort, activity);
  if (!s || s.status !== "done" || !s.thumbnail) return new Response("Not found", { status: 404 });

  const dir = activityDir(s.cohort, s.slug);
  const file = path.resolve(/* turbopackIgnore: true */ dir, s.thumbnail);
  if (!file.startsWith(`${dir}${path.sep}`) || !fs.existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await sharp(fs.readFileSync(file))
    .rotate()
    .resize(1200, 630, { fit: "contain", background: s.type === "retrospective" ? "#F2FAFF" : "#0B0F17" })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
