import { AnimatedCounter } from '@/components/motion/AnimatedCounter';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Container } from '@/components/ui/Container';
import { StatTile } from '@/components/ui/StatTile';
import { stats } from '@/content/features';

/** Headline figures, each counting up as the band scrolls into view. */
export function StatsBand() {
  return (
    <section className="bg-ink-950 relative overflow-hidden py-16 sm:py-20">
      <div className="bg-grid pointer-events-none absolute inset-0 text-white/40" aria-hidden />

      <Container width="wide" className="relative">
        <StaggerGroup as="ul" stagger={0.1} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatTile key={stat.label} stat={stat}>
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
