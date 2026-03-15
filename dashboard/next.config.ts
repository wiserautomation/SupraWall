import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@suprawall/core",
    "react-remove-scroll",
    "use-sync-external-store",
    "web-streams-polyfill"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@suprawall/core": path.resolve(__dirname, "../suprawall-core/index.ts"),
      "firebase/app": require.resolve("firebase/app"),
      "firebase/firestore": require.resolve("firebase/firestore"),
      "firebase/auth": require.resolve("firebase/auth"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@suprawall/core": "../suprawall-core/index.ts",
      "firebase/app": "firebase/app",
      "firebase/firestore": "firebase/firestore",
      "firebase/auth": "firebase/auth",
      // Force recharts to use its CJS lib bundle (avoids ESM d3-shape → d3-path issue)
      recharts: "recharts/lib/index.js",
      "web-streams-polyfill/dist/ponyfill.es2018.js": "web-streams-polyfill/dist/ponyfill.js",
    },
  },
};

export default nextConfig;
