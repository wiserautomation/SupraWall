// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataRoute } from "next";
import { newsArticles } from "./newsData";

/**
 * Safe URL builder to prevent double slashes.
 */
function buildUrl(base: string, path: string): string {
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${cleanBase}/${cleanPath}`;
}

const BASE_URL = 'https://www.supra-wall.com';

export default function newsSitemap({ params }: { params: { lang: string } }): MetadataRoute.Sitemap {
    const { lang } = params;
    return newsArticles
        .filter((a) => a.published)
        .map((article) => ({
            url: buildUrl(BASE_URL, `${lang}/news/${article.slug}`),
            lastModified: new Date(article.date),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
}
