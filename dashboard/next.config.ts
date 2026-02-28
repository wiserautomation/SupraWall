import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@suprawall/core"],
  turbopack: {
    resolveAlias: {
      // Force recharts to use its CJS lib bundle (avoids ESM d3-shape → d3-path issue)
      recharts: "recharts/lib/index.js",
    },
  },
};

export default nextConfig;
