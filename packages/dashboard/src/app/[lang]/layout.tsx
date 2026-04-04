// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import { i18n, Locale } from "@/i18n/config";
import { Outfit } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://www.supra-wall.com';
  
  // Build alternates for hreflang
  const languages: Record<string, string> = {};
  i18n.locales.forEach((l) => {
    languages[l] = `${baseUrl}/${l}`;
  });
  languages['x-default'] = `${baseUrl}/en`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "SupraWall | Enterprise AI Agent Security & Runtime Guardrails",
      template: "%s | SupraWall"
    },
    description: "Secure your autonomous AI agents with the first zero-trust runtime firewall. Block prompt injection, prevent unauthorized tool execution, and control LLM costs.",
    keywords: ["AI agent security", "runtime guardrails", "prompt injection prevention", "secure langchain", "ai agent firewall"],
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages,
    },
    robots: {
      index: lang === i18n.defaultLocale,
      follow: true,
      googleBot: {
        index: lang === i18n.defaultLocale,
        follow: true,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === 'en' ? 'en_US' : lang,
      url: `${baseUrl}/${lang}`,
      siteName: "SupraWall",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "SupraWall | Enterprise AI Agent Security",
      description: "The zero-trust shim for your autonomous AI swarm.",
    },
  };
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SupraWall",
    "alternateName": "SupraWall",
    "url": "https://www.supra-wall.com",
    "logo": "https://www.supra-wall.com/icon.png",
    "sameAs": [
      "https://twitter.com/suprawall",
      "https://github.com/wiserautomation/SupraWall"
    ],
    "description": "Enterprise-grade security and compliance for autonomous AI agents.",
    "inLanguage": lang,
    "areaServed": "EU"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://www.supra-wall.com/${lang}`
      }
    ]
  };

  return (
    <html lang={lang} suppressHydrationWarning>
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
