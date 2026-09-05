import { Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { localePattern } from "@/lib/i18n/locales";
import "@/app/globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-geist-mono" });

// 첫 페인트 전에 URL 의 locale 로 lang 을 맞춘다. 루트 레이아웃은 클라이언트에서 다시 렌더되지 않으므로 여기 둔다.
const langScript = `(function(){var m=location.pathname.match(new RegExp(${JSON.stringify(localePattern)}));if(m)document.documentElement.lang=m[1]})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={geistMono.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
