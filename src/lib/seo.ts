import type { Metadata } from 'next';
import { site, siteUrl } from '@/content/site';

type BuildMetadataOptions = {
  /** Page title, without the site suffix — the title template adds that. */
  title: string;
  description: string;
  /** Root-relative path, e.g. `/products/vx-200-energy-meter`. */
  path: string;
  /**
   * Open Graph image path. Defaults to the route's own generated
   * `opengraph-image`, which Next resolves automatically when omitted.
   */
  image?: string;
  /** `article` for case studies and similar; `website` otherwise. */
  type?: 'website' | 'article';
  /** Keeps a page out of search results, e.g. a thank-you page. */
  noIndex?: boolean;
};

/**
 * Builds a complete `Metadata` object for a page.
 *
 * Every page goes through this one function so no page can quietly ship without
 * a canonical URL, an Open Graph block or a Twitter card. Getting these right
 * once here is far more reliable than remembering eight fields in eight files.
 *
 * `metadataBase` is set in the root layout, so the relative `path` and `image`
 * values below are resolved to absolute URLs by Next.js — which is what Open
 * Graph and canonical tags require.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      // Canonical URLs stop the same page being indexed under query-string or
      // trailing-slash variants.
      canonical: url,
    },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      locale: 'en_GB',
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
