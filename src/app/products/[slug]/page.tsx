import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { StaggerItem } from '@/components/motion/StaggerItem';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CtaBand } from '@/components/ui/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SpecTable } from '@/components/ui/SpecTable';
import {
  getProduct,
  getProductSlugs,
  getRelatedProducts,
  productCategories,
} from '@/content/products';
import { Icon } from '@/lib/icons';
import { breadcrumbSchema, productSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

type PageProps = {
  // Dynamic params are async in Next 15+ and must be awaited.
  params: Promise<{ slug: string }>;
};

/**
 * Pre-renders every product page at build time.
 *
 * With all slugs known ahead of time, each detail page is emitted as static
 * HTML and served from Vercel's edge cache — no server work per request. Adding
 * a product to `content/products.ts` adds a page here automatically.
 */
export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

/** Per-product title, description, canonical and Open Graph data. */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return buildMetadata({
      title: 'Product not found',
      description: 'This product could not be found.',
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.tagline,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  // An unknown slug renders the 404 page rather than throwing.
  if (!product) notFound();

  const related = getRelatedProducts(slug, 3);

  return (
    <>
      <JsonLd schema={productSchema(product)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />

      <PageHero
        eyebrow={`${productCategories[product.category]} · ${product.model}`}
        title={product.name}
        description={product.tagline}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
        ]}
        stats={product.metrics.map((metric) => ({ value: metric.value, label: metric.label }))}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button href="/contact" icon="arrowRight">
            Request a quote
          </Button>
          <Button href="/contact" variant="outline" onDark>
            Book a site survey
          </Button>
          {product.flag && (
            <Badge tone="volt" onDark>
              {product.flag}
            </Badge>
          )}
        </div>
      </PageHero>

      {/* ---- Overview and capabilities ---- */}
      <section className="py-16 sm:py-24">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-10">
              <Reveal className="flex flex-col gap-5">
                <span className="bg-volt-50 text-volt-700 ring-volt-100 flex size-12 items-center justify-center rounded-xl ring-1">
                  <Icon name={product.icon} className="size-6" />
                </span>
                <h2 className="text-display-sm text-ink-900 font-semibold">Overview</h2>
                <p className="text-ink-600 text-base leading-relaxed sm:text-[1.0625rem]">
                  {product.description}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-col gap-5">
                <h2 className="text-display-sm text-ink-900 font-semibold">Capabilities</h2>
                <ul className="flex flex-col gap-3">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-3">
                      <span className="bg-volt-50 text-volt-700 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                        <Check className="size-3" aria-hidden strokeWidth={3} />
                      </span>
                      <span className="text-ink-600 text-[0.9375rem] leading-relaxed">
                        {capability}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* ---- Specifications ---- */}
            <Reveal from="right" delay={0.1}>
              <div className="rounded-panel ring-ink-100 shadow-panel sticky top-28 bg-white p-6 ring-1 sm:p-7">
                <div className="border-ink-100 mb-4 flex items-center justify-between border-b pb-4">
                  <h2 className="text-ink-900 text-base font-semibold">Specifications</h2>
                  <Badge tone="neutral">{product.model}</Badge>
                </div>

                <SpecTable
                  specs={product.specs}
                  caption={`Technical specifications for the ${product.name}`}
                />

                <Button
                  href="/contact"
                  fullWidth
                  className="mt-6"
                  icon="download"
                  iconPosition="left"
                >
                  Request the datasheet
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---- Use cases ---- */}
      <section className="bg-ink-25 border-ink-100 border-y py-16 sm:py-20">
        <Container width="wide">
          <SectionHeading
            eyebrow="Where it is used"
            title="Typical deployments"
            description="The situations this product is usually specified for, drawn from sites we have measured."
            className="mb-10"
          />

          <StaggerGroup as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2">
            {product.useCases.map((useCase, index) => (
              <UseCaseItem key={useCase} text={useCase} index={index} />
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* ---- Related ---- */}
      {related.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container width="wide">
            <SectionHeading
              eyebrow="Also consider"
              title="Usually deployed alongside"
              className="mb-10"
            />
            <StaggerGroup as="ul" stagger={0.08} className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </StaggerGroup>
          </Container>
        </section>
      )}

      <CtaBand
        eyebrow="Next step"
        title={`See what the ${product.model} would show you.`}
        description="A site survey establishes exactly where this product would go and what it would measure, before anything is ordered."
      />
    </>
  );
}

/** A single numbered use-case tile. Split out to keep the page readable. */
function UseCaseItem({ text, index }: { text: string; index: number }) {
  return (
    <StaggerItem as="li" className="rounded-panel ring-ink-100 flex gap-4 bg-white p-5 ring-1">
      <span className="text-volt-700 bg-volt-50 tabular flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold">
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className="text-ink-600 text-[0.9375rem] leading-relaxed">{text}</p>
    </StaggerItem>
  );
}
