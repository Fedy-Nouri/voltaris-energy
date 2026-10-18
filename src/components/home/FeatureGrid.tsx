import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureTile } from '@/components/ui/FeatureTile';
import { platformFeatures } from '@/content/features';

/**
 * Platform capabilities, as a bento grid.
 *
 * The first capability gets a 2×2 cell and the fifth a 2×1, so the eye has a
 * route through the section instead of meeting eight identical boxes. The
 * sizing lives here rather than in the content module: it is a layout decision
 * about this particular grid, and `content/features.ts` should stay free of
 * presentation concerns.
 *
 * `grid-cols-1` at the base width is deliberate — an implicit `auto` track is
 * sized to max-content and overflows on mobile, which is exactly the bug this
 * project hit before.
 */
export function FeatureGrid() {
  /*
   * Indices sized to tile the 4-column grid exactly, with no orphan.
   *
   * The lead cell takes columns 1–2 of rows 1–2, leaving four slots beside it
   * (indices 1–4). That puts indices 5–7 on row three, where making the first
   * of them double-width fills all four columns: 2 + 1 + 1.
   */
  const FEATURED_INDEX = 0;
  const WIDE_INDEX = 5;

  return (
    <section className="section-y">
      <Container width="wide">
        <SectionHeading
          eyebrow="The platform"
          title="Measurement is the easy part. Making it useful is the product."
          description="Insight is where the data becomes decisions — and where a claimed saving becomes an evidenced one."
          className="mb-14 sm:mb-16"
        />

        <StaggerGroup
          as="ul"
          stagger={0.06}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {platformFeatures.map((feature, index) => (
            <FeatureTile
              key={feature.title}
              feature={feature}
              featured={index === FEATURED_INDEX}
              wide={index === WIDE_INDEX}
            />
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
