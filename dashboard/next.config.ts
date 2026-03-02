import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@suprawall/core",
    "react-remove-scroll",
    "use-sync-external-store"
  ],
  turbopack: {
    resolveAlias: {
      // Force recharts to use its CJS lib bundle (avoids ESM d3-shape → d3-path issue)
      recharts: "recharts/lib/index.js",
    },
  },
};

export default nextConfig;
