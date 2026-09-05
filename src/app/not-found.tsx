import Link from "next/link";
import "@/app/globals.css";

/* [locale] 레이아웃 밖(잘못된 locale 등)에서 쓰이는 전역 404 */
export default function RootNotFound() {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col items-center justify-center text-center">
        <p className="font-mono text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-6 text-2xl font-semibold">페이지를 찾을 수 없어요</h1>
        <p className="mt-2 text-muted">Page not found.</p>
        <Link href="/ko" className="mt-10 rounded-md border border-line-strong px-5 py-2.5 text-sm hover:border-accent hover:text-accent">
          홈으로 · Back home
        </Link>
      </body>
    </html>
  );
}
