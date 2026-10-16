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
    <section className="py-20 sm:py-28">
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

        <StaggerGroup as="ul" stagger={0.1} className="grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
