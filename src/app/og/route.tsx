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
          width: "100%",
          height: "100%",
          padding: "66px 72px 54px",
          background: "#F8FBFF",
          color: "#0B0F17",
          borderTop: "12px solid #42B4FF",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#1160D8",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "3px",
          }}
        >
          <div style={{ width: 10, height: 10, background: "#42B4FF" }} />
          STUDENT BUILDERS AT UOS
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: 40,
          }}
        >
          <svg width="128" height="128" viewBox="0 0 16 16" fill="#42B4FF">
            <path d={glyphPath("logo")} />
          </svg>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: "-5px" }}>
            ASBG UOS
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            fontSize: 36,
            lineHeight: 1.35,
            letterSpacing: "-0.5px",
          }}
        >
          <div>AWS Student Builder Group</div>
          <div style={{ color: "#536174" }}>at University of Seoul</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 26,
            borderTop: "2px solid #DCE8F5",
          }}
        >
          <div style={{ fontSize: 25, fontWeight: 700, color: "#1160D8" }}>
            Learn · Build · Share · Connect
          </div>
          <svg width="112" height="24" viewBox="0 0 112 24" fill="#42B4FF">
            <path d="M0 8h16v16H0zM24 0h16v16H24zM48 8h16v16H48zM72 0h16v16H72zM96 8h16v16H96z" />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
