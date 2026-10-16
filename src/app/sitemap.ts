import type { MetadataRoute } from 'next';
import { getProductSlugs } from '@/content/products';
import { siteUrl } from '@/content/site';

/**
 * Sitemap.
 *
 * Generated from the same content modules the pages render from, so a new
 * product cannot end up live but missing from the sitemap. `changeFrequency`
 * and `priority` are hints only — crawlers largely ignore them — but the URL
 * list and `lastModified` are what actually matter.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Static at build time, which is the correct semantics here: the content is
  // baked into the bundle, so the build is genuinely when it last changed.
  const lastModified = new Date();

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/products', priority: 0.9 },
    { path: '/solutions', priority: 0.8 },
    { path: '/case-studies', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.7 },
  ];

  const productRoutes = getProductSlugs().map((slug) => ({
    path: `/products/${slug}`,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
