import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = { title: `404 · ${site.shortName}` };

export default function RootNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32 text-center">
      <p className="font-mono text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-6 text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-muted">Page not found.</p>
      <Link href="/ko" className="mt-10 rounded-md border border-line-strong px-5 py-2.5 text-sm hover:border-accent hover:text-accent">
        홈으로 · Back home
      </Link>
    </div>
  );
}
