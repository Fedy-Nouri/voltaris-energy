import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/site';

/**
 * robots.txt.
 *
 * Everything is crawlable — this is a marketing site and there is nothing to
 * hide. The point of declaring it explicitly rather than omitting the file is
 * the `sitemap` line, which is how a crawler that arrives without one finds
 * the full URL list.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Next's internal build assets have no business in an index.
      disallow: ['/_next/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
