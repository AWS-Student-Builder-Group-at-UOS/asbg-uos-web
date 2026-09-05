import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/ko" },
      { source: "/og/asbg-uos.png", destination: "/og" },
    ];
  },
};

export default nextConfig;
