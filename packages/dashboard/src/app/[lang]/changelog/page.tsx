// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = {
    title: "Product Changelog | Latest Updates & Features | SupraWall",
    description: "Stay up to date with the latest security features, SDK updates, and governance improvements from the SupraWall engineering team.",
    keywords: [
        "SupraWall changelog",
        "AI agent SDK updates",
        "new security features autonomous agents",
        "suprawall release notes",
        "deterministic safety improvements",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/changelog",
    },
    openGraph: {
        title: "Moving Faster. Securing Better. | SupraWall Changelog",
        description: "The latest updates from the engineering world of autonomous agent security.",
        url: "https://www.supra-wall.com/changelog",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar />
            <ChangelogClient />
        </div>
    );
}
