import { AnimatedCounter } from '@/components/motion/AnimatedCounter';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Container } from '@/components/ui/Container';
import { StatTile } from '@/components/ui/StatTile';
import { stats } from '@/content/features';

/**
 * Headline figures, each counting up as the band scrolls into view.
 *
 * The first figure — sites under measurement — leads at display size with the
 * other three stacked beside it. Four equal columns read as a specification
 * table; this reads as a claim with supporting evidence, which is what the
 * numbers actually are.
 */
export function StatsBand() {
  return (
    <section className="bg-ink-950 section-y relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 text-white/40" aria-hidden />
      {/* Accent glow behind the lead figure, echoing the hero treatment. */}
      <div
        className="pointer-events-none absolute -top-24 left-0 h-[22rem] w-[40rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgb(29_224_181/0.1),transparent_65%)] blur-2xl"
        aria-hidden
      />

      <Container width="wide" className="relative">
        {/* Two columns, not three: the lead figure spans all three rows on the
            left and the remaining three stack beside it, which tiles exactly.
            A three-column version leaves a visible hole in the bottom row. */}
        <StaggerGroup
          as="ul"
          stagger={0.1}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
        >
          {stats.map((stat, index) => (
            <StatTile key={stat.label} stat={stat} featured={index === 0}>
              <AnimatedCounter
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </StatTile>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
