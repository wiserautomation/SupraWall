// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Outfit } from "next/font/google";
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.supra-wall.com'),
  title: {
    default: "SupraWall | Enterprise AI Agent Security & Runtime Guardrails",
    template: "%s | SupraWall"
  },
  description: "Secure your autonomous AI agents with the first zero-trust runtime firewall. Block prompt injection, prevent unauthorized tool execution, and control LLM costs.",
  keywords: ["AI agent security", "runtime guardrails", "prompt injection prevention", "secure langchain", "ai agent firewall"],
  alternates: {
    canonical: 'https://www.supra-wall.com',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.supra-wall.com",
    siteName: "SupraWall",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SupraWall | Enterprise AI Agent Security",
    description: "The zero-trust shim for your autonomous AI swarm.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SupraWall",
    "alternateName": "SupraWall",
    "url": "https://www.supra-wall.com",
    "logo": "https://www.supra-wall.com/icon.png",
    "sameAs": [
      "https://twitter.com/suprawall",
      "https://github.com/suprawall"
    ],
    "description": "Enterprise-grade security and compliance for autonomous AI agents."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.supra-wall.com"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {children}
        <GoogleAnalytics gaId="G-5LXMT6RZQS" />
      </body>
    </html>
  );
}
