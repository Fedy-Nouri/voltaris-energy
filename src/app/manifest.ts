import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/**
 * Web app manifest.
 *
 * Not because this is an installable app — it is a marketing site — but
 * because the name, theme colour and icon are what a mobile browser uses when
 * someone adds the page to their home screen or shares it, and getting a
 * generic screenshot there looks unfinished.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#06090b',
    theme_color: '#06090b',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
