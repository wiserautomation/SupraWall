// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import type { NextConfig } from "next";
import path from "path";

import { SLUG_MAP } from "./src/i18n/slug-map";

const nextConfig: NextConfig = {
  // Tell Next.js/Turbopack to NEVER bundle these packages — load them via
  // Node.js native require() at runtime on the server instead. This is the
  // correct fix for grpc/firebase-admin transitive dependency leakage.
  serverExternalPackages: [
    'firebase-admin',
    '@google-cloud/firestore',
    '@google-cloud/storage',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'google-gax',
    'google-auth-library',
    '@google/genai',
    '@google-analytics/data',
    'protobufjs',
    'pg',
    'pg-native',
    'sqlite3',
  ],
  async rewrites() {
    const routes: any[] = [];
    for (const [internalSlug, mapping] of Object.entries(SLUG_MAP)) {
      for (const [locale, publicSlug] of Object.entries(mapping)) {
        routes.push({
          source: `/${locale}/${publicSlug}`,
          destination: `/${locale}/${internalSlug}`
        });
      }
    }
    return routes;
  },
  async redirects() {
    return [
      // ── Locale-less root paths → inject /en/ ───────────────────────────
      { source: '/login',               destination: '/en/login',      permanent: false },
      { source: '/admin/:path*',        destination: '/en/admin/:path*', permanent: false },
      { source: '/dashboard/:path*',    destination: '/en/dashboard/:path*', permanent: false },
      { source: '/beta',                destination: '/en/beta',        permanent: false },
      // Bare integration/tool paths crawled without locale
      { source: '/integrations/:path*', destination: '/en/integrations/:path*', permanent: true },
      { source: '/tools',               destination: '/en/tools/llm-cost-calculator', permanent: true },
      { source: '/tools/:path*',        destination: '/en/tools/:path*', permanent: true },

      // ── Blog article moves ─────────────────────────────────────────────
      // LLM-as-Judge moved from /news/ to /blog/
      { source: '/news/llm-as-judge-fails-agent-security',            destination: '/blog/llm-as-judge-fails-agent-security', permanent: true },
      { source: '/:locale/news/llm-as-judge-fails-agent-security',   destination: '/:locale/blog/llm-as-judge-fails-agent-security', permanent: true },
      // state-of-ai-agent-security-2026 moved to /research/
      { source: '/:locale/blog/state-of-ai-agent-security-2026',     destination: '/en/research/state-of-ai-agent-security-2026', permanent: true },
      { source: '/blog/state-of-ai-agent-security-2026',             destination: '/en/research/state-of-ai-agent-security-2026', permanent: true },


      // ── Non-en locale news → English news (content is English-only) ────
      { source: '/de/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/fr/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/es/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/it/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/pl/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/nl/news/:path*', destination: '/en/news/:path*', permanent: true },
      { source: '/de/news',        destination: '/en/news', permanent: true },
      { source: '/fr/news',        destination: '/en/news', permanent: true },
      { source: '/es/news',        destination: '/en/news', permanent: true },
      { source: '/it/news',        destination: '/en/news', permanent: true },
      { source: '/pl/news',        destination: '/en/news', permanent: true },
      { source: '/nl/news',        destination: '/en/news', permanent: true },

      // ── Non-en locale blog → /en/news ─────────────────────────────────
      { source: '/de/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/fr/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/es/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/it/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/pl/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/nl/blog/:path*', destination: '/en/news', permanent: true },
      { source: '/de/blog',        destination: '/en/news', permanent: true },
      { source: '/fr/blog',        destination: '/en/news', permanent: true },
      { source: '/es/blog',        destination: '/en/news', permanent: true },
      { source: '/it/blog',        destination: '/en/news', permanent: true },
      { source: '/pl/blog',        destination: '/en/news', permanent: true },
      { source: '/nl/blog',        destination: '/en/news', permanent: true },

      // ── /en/blog/* (English blog posts that don't have a page) → /en/news ──
      { source: '/en/blog/state-of-ai-agent-security-2026',  destination: '/en/research/state-of-ai-agent-security-2026', permanent: true },
      { source: '/en/blog/:slug',                             destination: '/en/news', permanent: false },
      { source: '/blog/:slug',                                destination: '/en/news', permanent: false },

      // ── Root-level /spec and /audit → actual root paths ───────────────
      { source: '/en/spec',  destination: '/spec',  permanent: true },
      { source: '/de/spec',  destination: '/spec',  permanent: true },
      { source: '/fr/spec',  destination: '/spec',  permanent: true },
      { source: '/es/spec',  destination: '/spec',  permanent: true },
      { source: '/it/spec',  destination: '/spec',  permanent: true },
      { source: '/pl/spec',  destination: '/spec',  permanent: true },
      { source: '/nl/spec',  destination: '/spec',  permanent: true },

      { source: '/en/audit', destination: '/audit', permanent: true },
      { source: '/de/audit', destination: '/audit', permanent: true },
      { source: '/fr/audit', destination: '/audit', permanent: true },
      { source: '/es/audit', destination: '/audit', permanent: true },
      { source: '/it/audit', destination: '/audit', permanent: true },
      { source: '/pl/audit', destination: '/audit', permanent: true },
      { source: '/nl/audit', destination: '/audit', permanent: true },

      // ── Non-en locale changelog → /en/changelog ───────────────────────
      { source: '/de/changelog', destination: '/en/changelog', permanent: true },
      { source: '/fr/changelog', destination: '/en/changelog', permanent: true },
      { source: '/es/changelog', destination: '/en/changelog', permanent: true },
      { source: '/it/changelog', destination: '/en/changelog', permanent: true },
      { source: '/pl/changelog', destination: '/en/changelog', permanent: true },
      { source: '/nl/changelog', destination: '/en/changelog', permanent: true },

      // ── Non-en privacy/legal → /en equivalents ────────────────────────
      { source: '/de/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/fr/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/es/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/it/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/pl/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/nl/privacy',    destination: '/en/privacy', permanent: true },
      { source: '/de/legal/:path*', destination: '/en/legal/:path*', permanent: true },
      { source: '/fr/legal/:path*', destination: '/en/legal/:path*', permanent: true },
      { source: '/es/legal/:path*', destination: '/en/legal/:path*', permanent: true },
      { source: '/it/legal/:path*', destination: '/en/legal/:path*', permanent: true },
      { source: '/pl/legal/:path*', destination: '/en/legal/:path*', permanent: true },
      { source: '/nl/legal/:path*', destination: '/en/legal/:path*', permanent: true },

      // ── Non-en security page → /en/security ───────────────────────────
      { source: '/de/security', destination: '/en/security', permanent: true },
      { source: '/fr/security', destination: '/en/security', permanent: true },
      { source: '/es/security', destination: '/en/security', permanent: true },
      { source: '/it/security', destination: '/en/security', permanent: true },
      { source: '/pl/security', destination: '/en/security', permanent: true },
      { source: '/nl/security', destination: '/en/security', permanent: true },

      // ── Removed/ghost feature and tool pages ──────────────────────────
      { source: '/features/semantic-layer', destination: '/en/features', permanent: true },
      { source: '/:locale/tools/llm-cost-calculator', destination: '/en/tools/llm-cost-calculator', permanent: true },

      // ── MCP consent (non-en locales) → /en/mcp/consent ────────────────
      { source: '/de/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },
      { source: '/fr/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },
      { source: '/es/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },
      { source: '/it/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },
      { source: '/pl/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },
      { source: '/nl/mcp/:path*', destination: '/en/mcp/:path*', permanent: true },

      // ── Docs: non-en locales → /en/docs (all doc content is English) ──
      { source: '/de/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/fr/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/es/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/it/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/pl/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/nl/docs/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/de/docs',        destination: '/en/docs', permanent: true },
      { source: '/fr/docs',        destination: '/en/docs', permanent: true },
      { source: '/es/docs',        destination: '/en/docs', permanent: true },
      { source: '/it/docs',        destination: '/en/docs', permanent: true },
      { source: '/pl/docs',        destination: '/en/docs', permanent: true },
      { source: '/nl/docs',        destination: '/en/docs', permanent: true },

      // ── Non-en partner page → /en/partner ─────────────────────────────
      { source: '/de/partner', destination: '/en/partner', permanent: true },
      { source: '/fr/partner', destination: '/en/partner', permanent: true },
      { source: '/es/partner', destination: '/en/partner', permanent: true },
      { source: '/it/partner', destination: '/en/partner', permanent: true },
      { source: '/pl/partner', destination: '/en/partner', permanent: true },
      { source: '/nl/partner', destination: '/en/partner', permanent: true },
      { source: '/en/partner', destination: '/en/about',   permanent: true },

      // ── Non-en self-host page → /en/self-host ─────────────────────────
      { source: '/de/self-host', destination: '/en/self-host', permanent: true },
      { source: '/fr/self-host', destination: '/en/self-host', permanent: true },
      { source: '/es/self-host', destination: '/en/self-host', permanent: true },
      { source: '/it/self-host', destination: '/en/self-host', permanent: true },
      { source: '/pl/self-host', destination: '/en/self-host', permanent: true },
      { source: '/nl/self-host', destination: '/en/self-host', permanent: true },

      // ── Non-en login/beta/quickstart → /en equivalents ────────────────
      { source: '/de/login',     destination: '/en/login',     permanent: true },
      { source: '/fr/login',     destination: '/en/login',     permanent: true },
      { source: '/es/login',     destination: '/en/login',     permanent: true },
      { source: '/it/login',     destination: '/en/login',     permanent: true },
      { source: '/pl/login',     destination: '/en/login',     permanent: true },
      { source: '/nl/login',     destination: '/en/login',     permanent: true },
      { source: '/de/beta',      destination: '/en/beta',      permanent: true },
      { source: '/fr/beta',      destination: '/en/beta',      permanent: true },
      { source: '/es/beta',      destination: '/en/beta',      permanent: true },
      { source: '/it/beta',      destination: '/en/beta',      permanent: true },
      { source: '/pl/beta',      destination: '/en/beta',      permanent: true },
      { source: '/nl/beta',      destination: '/en/beta',      permanent: true },
      { source: '/de/quickstart', destination: '/en/quickstart', permanent: true },
      { source: '/fr/quickstart', destination: '/en/quickstart', permanent: true },
      { source: '/es/quickstart', destination: '/en/quickstart', permanent: true },
      { source: '/it/quickstart', destination: '/en/quickstart', permanent: true },
      { source: '/pl/quickstart', destination: '/en/quickstart', permanent: true },
      { source: '/nl/quickstart', destination: '/en/quickstart', permanent: true },

      // ── Non-en for-* audience pages → /en equivalents ─────────────────
      { source: '/:locale/for-enterprise',  destination: '/en/for-enterprise',  permanent: true },
      { source: '/:locale/for-developers',  destination: '/en/for-developers',  permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.google-analytics.com https://*.googletagmanager.com https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.firebaseio.com https://*.googleapis.com; frame-src 'self' https://checkout.stripe.com https://*.clerk.accounts.dev https://*.firebaseapp.com https://*.googleapis.com; upgrade-insecure-requests;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Noindex all Vercel preview/staging deployments to prevent duplicate indexation
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        // Only apply when served from the Vercel preview domain (not production domains)
        has: [
          {
            type: 'host',
            value: '(?!supra-wall\\.com)(?!www\\.supra-wall\\.com).*\\.vercel\\.app',
          },
        ],
      },
    ];
  },
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    // For client bundles: stub out any Node.js-only modules that may be
    // transitively referenced but never actually executed on the client.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
        sqlite3: false,
        "firebase-admin": false,
        "@grpc/grpc-js": false,
        "grpc": false,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        constants: false,
        http2: false,
        zlib: false,
        child_process: false,
      };
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      // Force recharts to use its CJS lib bundle (avoids ESM d3-shape → d3-path issue)
      recharts: "recharts/lib/index.js",
      "web-streams-polyfill/dist/ponyfill.es2018.js": "web-streams-polyfill/dist/ponyfill.js",
    },
  },
};

export default nextConfig;
