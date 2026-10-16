import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { ComparisonTable } from '@/components/products/ComparisonTable';
import { ProductFilter } from '@/components/products/ProductFilter';
import { Container } from '@/components/ui/Container';
import { CtaBand } from '@/components/ui/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { products } from '@/content/products';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Products',
  description:
    'Revenue-grade energy meters, multi-protocol edge gateways, branch-circuit submeters, environmental sensors, load control relays and the Insight analytics platform.',
  path: '/products',
});

/**
 * Products index.
 *
 * A Server Component that passes the catalogue to a small client island for
 * filtering. The product data itself is serialisable — icons are string keys —
 * so it crosses the boundary without issue.
 */
export default function ProductsPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
        ])}
      />

      <PageHero
        eyebrow="Hardware & software"
        title="Instruments built to be believed."
        description="Six products that measure, move, interpret and act on energy data. Certified to the standard the job actually requires, and built to keep working when the network does not."
        stats={[
          { value: '0.2S', label: 'Best accuracy class, certified to IEC 62053-22' },
          { value: '5', label: 'Field protocols spoken concurrently per gateway' },
          { value: '5 yr', label: 'Warranty on all metering and control hardware' },
        ]}
      />

      <section className="py-16 sm:py-20">
        <Container width="wide">
          <ProductFilter products={products} />
        </Container>
      </section>

      <section className="bg-ink-25 border-ink-100 border-y py-16 sm:py-20">
        <Container width="wide">
          <SectionHeading
            eyebrow="At a glance"
            title="The catalogue, side by side."
            description="Headline figures for each product. Full specifications are on the individual product pages."
            className="mb-10"
          />
          <ComparisonTable products={products} />
        </Container>
      </section>

      <CtaBand
        eyebrow="Not sure what you need"
        title="We will tell you what to measure before we sell you anything."
        description="A site survey establishes which measurement points actually answer your question. Often that is fewer devices than you expected."
      />
    </>
  );
}
