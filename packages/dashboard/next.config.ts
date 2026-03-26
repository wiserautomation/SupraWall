// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Noindex all Vercel preview/staging deployments to prevent duplicate indexation
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        // Only apply when served from the Vercel preview domain
        has: [
          {
            type: 'host',
            value: '(?!www\\.supra-wall\\.com).*\\.vercel\\.app',
          },
        ],
      },
    ];
  },
  transpilePackages: [
    "@suprawall/core",
    "react-remove-scroll",
    "use-sync-external-store",
    "web-streams-polyfill"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@suprawall/core": path.resolve(__dirname, "../core/index.ts"),
      "firebase/app": require.resolve("firebase/app"),
      "firebase/firestore": require.resolve("firebase/firestore"),
      "firebase/auth": require.resolve("firebase/auth"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@suprawall/core": "../core/index.ts",
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
