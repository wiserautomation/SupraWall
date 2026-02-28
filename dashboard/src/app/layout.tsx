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
  title: {
    default: "SupraWall | Enterprise AI Agent Security & Runtime Guardrails",
    template: "%s | SupraWall"
  },
  description: "Secure your autonomous AI agents with the first zero-trust runtime firewall. Block prompt injection, prevent unauthorized tool execution, and control LLM costs.",
  keywords: ["AI agent security", "runtime guardrails", "prompt injection prevention", "secure langchain", "ai agent firewall"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suprawall.com",
    siteName: "SupraWall",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SupraWall | Enterprise AI Agent Security",
    description: "The zero-trust shim for your autonomous AI swarm.",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-5LXMT6RZQS" />
      </body>
    </html>
  );
}
