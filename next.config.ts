import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale(ko|en)/sessions/:cohort/:session(session-\\d{2})/:presentation(presentation-\\d{2})",
        destination: "/:locale/activities/:cohort/:session-:presentation",
        permanent: true,
      },
      {
        source: "/:locale(ko|en)/sessions/:cohort",
        destination: "/:locale/activities/:cohort",
        permanent: true,
      },
      {
        source: "/:locale(ko|en)/sessions",
        destination: "/:locale/activities",
        permanent: true,
      },
      {
        source: "/content/:cohort/:session(session-\\d{2})/:presentation(presentation-\\d{2})/:path*",
        destination: "/content/:cohort/activities/:session-:presentation/:path*",
        permanent: true,
      },
      {
        source: "/og/:cohort/:session(session-\\d{2})/:presentation(presentation-\\d{2})",
        destination: "/og/:cohort/:session-:presentation",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/", destination: "/ko" }];
  },
};

export default nextConfig;
