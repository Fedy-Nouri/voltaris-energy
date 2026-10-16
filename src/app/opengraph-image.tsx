import { createOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

/**
 * Site-wide social card.
 *
 * Next.js picks this file up by name and wires the resulting URL into the
 * `og:image` and `twitter:image` tags automatically, resolved against the
 * `metadataBase` set in the root layout. Any route without its own
 * `opengraph-image` inherits this one.
 */
export const alt = 'Voltaris — IoT energy monitoring for industrial and commercial sites';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return createOgImage({
    eyebrow: 'Energy monitoring',
    title: 'Every kilowatt, accounted for.',
    description:
      'Revenue-grade metering, edge gateways that speak every protocol on your site, and analytics that make a saving provable.',
    metrics: [
      { value: '4,800+', label: 'Sites measured' },
      { value: '0.2S', label: 'Accuracy class' },
      { value: '17%', label: 'Median reduction' },
    ],
  });
}
