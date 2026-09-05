import fs from "node:fs";
import path from "node:path";
import { listContentAssets } from "@/lib/content";
import { CONTENT_ROOT } from "@/lib/content/paths";

export const dynamic = "force-static";
export const dynamicParams = false;

const MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export function generateStaticParams() {
  return listContentAssets().map((segments) => ({ path: segments }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const file = path.join(/* turbopackIgnore: true */ CONTENT_ROOT, ...segments);
  const type = MIME[path.extname(file).toLowerCase()];
  if (!type || !fs.existsSync(file)) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(fs.readFileSync(file)), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
