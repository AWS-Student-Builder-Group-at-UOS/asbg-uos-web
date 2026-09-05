import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getCohorts, getSession, getSessions, hasCohort } from "@/lib/content";
import { sessionDir } from "@/lib/content/paths";

export const dynamic = "force-static";
export const dynamicParams = false;

// Keep SVG text consistent on hosts without system fonts.
const fontsDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), "src/assets/fonts");
process.env.FONTCONFIG_PATH = fontsDir;
process.env.FONTCONFIG_FILE = path.join(fontsDir, "fonts.conf");

type Params = { cohort: string; session: string; presentation: string };

export function generateStaticParams(): Params[] {
  return getCohorts().flatMap((cohort) =>
    getSessions(cohort.slug)
      .filter((s) => s.status === "done" && s.thumbnail)
      .map((s) => {
        const [session, presentation] = s.slug.split("/");
        return { cohort: cohort.slug, session, presentation };
      }),
  );
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { cohort, session, presentation } = await params;
  if (!hasCohort(cohort)) return new Response("Not found", { status: 404 });

  const s = getSession(cohort, `${session}/${presentation}`);
  if (!s || s.status !== "done" || !s.thumbnail) return new Response("Not found", { status: 404 });

  const dir = sessionDir(s.cohort, s.slug);
  const file = path.resolve(/* turbopackIgnore: true */ dir, s.thumbnail);
  if (!file.startsWith(`${dir}${path.sep}`) || !fs.existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await sharp(fs.readFileSync(file))
    .rotate()
    .resize(1200, 630, { fit: "contain", background: "#0B0F17" })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
