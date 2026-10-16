import { getProduct, getProductSlugs, productCategories } from '@/content/products';
import { createOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

/**
 * Per-product social card.
 *
 * Each product gets a card carrying its own name, category and headline
 * specifications. Because it is generated from the catalogue rather than drawn
 * by hand, a product whose specs change gets a corrected card on the next
 * deploy with no design work.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Alt text is a single static export rather than a per-product string from
 * `generateImageMetadata`. That hook exists to emit *several* images for one
 * route, and adopting it here would nest this under an extra
 * `[__metadata_id__]` segment for no benefit — one product has one card. The
 * specific product name still reaches crawlers through the page's own
 * `og:title` and `og:description`.
 */
export const alt = 'Voltaris energy monitoring product';

/** Pre-renders one image per product at build time, alongside the pages. */
export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export default async function ProductOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  // Falls back to the generic card rather than failing the build on a bad slug.
  if (!product) {
    return createOgImage({
      eyebrow: 'Products',
      title: 'Voltaris energy monitoring',
    });
  }

  return createOgImage({
    eyebrow: `${productCategories[product.category]} · ${product.model}`,
    title: product.name,
    description: product.tagline,
    metrics: product.metrics,
  });
}
