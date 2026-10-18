import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/products/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { products } from '@/content/products';

/**
 * Three products on the home page, reusing the same `ProductCard` as the
 * products index so the two pages cannot drift apart visually.
 */
export function ProductTeaser() {
  const featured = products.slice(0, 3);

  return (
    <section className="section-y-lg">
      <Container width="wide">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Hardware & software"
            title="Instruments built to be believed."
            description="Certified to the standard that matters for the job, and designed to keep measuring with the network cut."
          />

          <Button href="/products" variant="outline" icon="arrowRight" className="shrink-0">
            All six products
          </Button>
        </div>

        {/* Bento: the lead product takes a 2×2 cell with its capabilities,
            the other two stack beside it. */}
        <StaggerGroup as="ul" stagger={0.1} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} featured={index === 0} />
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
