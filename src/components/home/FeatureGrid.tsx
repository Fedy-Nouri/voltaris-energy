import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureTile } from '@/components/ui/FeatureTile';
import { platformFeatures } from '@/content/features';

/** Platform capability grid. */
export function FeatureGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container width="wide">
        <SectionHeading
          eyebrow="The platform"
          title="Measurement is the easy part. Making it useful is the product."
          description="Insight is where the data becomes decisions — and where a claimed saving becomes an evidenced one."
          className="mb-12 sm:mb-14"
        />

        <StaggerGroup
          as="ul"
          stagger={0.06}
          className="rounded-panel bg-ink-100 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
        >
          {platformFeatures.map((feature) => (
            <FeatureTile key={feature.title} feature={feature} />
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
