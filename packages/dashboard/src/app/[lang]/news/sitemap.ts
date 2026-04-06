// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataRoute } from "next";
import { newsArticles } from "./newsData";

export default function newsSitemap({ params }: { params: { lang: string } }): MetadataRoute.Sitemap {
    const { lang } = params;
    return newsArticles
        .filter((a) => a.published)
        .map((article) => ({
            url: `https://www.supra-wall.com/${lang}/news/${article.slug}`,
            lastModified: new Date(article.date),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
}
