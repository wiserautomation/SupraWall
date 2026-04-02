import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.supra-wall.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/connect/', '/stripe/', '/share/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
