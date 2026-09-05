import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { glyphPath } from "@/components/icons";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          color: "#0B0F17",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
          fill="none"
        >
          <path
            d="M0 196H172L236 260H368M0 388H116L180 324H368M1200 196H1028L964 260H832M1200 388H1084L1020 324H832M248 0V100L312 164H416M952 0V100L888 164H784M248 630V548L312 484H416M952 630V548L888 484H784"
            stroke="#E3EDF7"
            strokeWidth="2"
          />
          <path
            d="M40 196H112M1088 196H1160M180 324H244M956 324H1020M248 46V94M952 536V584"
            stroke="#A7DAFF"
            strokeWidth="2"
          />
          <path
            d="M362 254h12v12h-12zM362 318h12v12h-12zM826 254h12v12h-12zM826 318h12v12h-12z"
            fill="#D2EBFD"
          />
          <path
            d="M104 188h16v16h-16zM1080 188h16v16h-16zM240 42h16v16h-16zM944 580h16v16h-16z"
            fill="#42B4FF"
          />
          {Array.from({ length: 40 }, (_, i) => {
            const x = 72 + (i % 8) * 16;
            const y = 478 + Math.floor(i / 8) * 16;
            return (
              <g key={i} fill={i % 13 === 0 ? "#A7DAFF" : "#E9F1F9"}>
                <rect x={x} y={y} width="4" height="4" />
                <rect x={1196 - x} y={626 - y} width="4" height="4" />
              </g>
            );
          })}
        </svg>
        <svg width="192" height="192" viewBox="0 0 16 16" fill="#42B4FF">
          <path d={glyphPath("logo")} />
        </svg>
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
        >
          ASBG UOS
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Mono",
          data: fs.readFileSync(path.join(process.cwd(), "src/assets/fonts/GeistMono-SemiBold.ttf")),
          weight: 600,
          style: "normal",
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
