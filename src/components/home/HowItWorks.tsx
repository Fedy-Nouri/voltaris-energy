'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { deploymentSteps } from '@/content/features';
import { Icon } from '@/lib/icons';
import { fadeUp, revealViewport, staggerParent } from '@/lib/motion';

/**
 * Deployment process, as a vertical sequence with a scroll-linked rail.
 *
 * The rail on the left fills as the section scrolls past, which gives the
 * reader a sense of progress through the four steps. `useScroll` is scoped to
 * this section via `target`, so the progress value describes this section's
 * travel rather than the whole document.
 */
export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 60%'],
  });

  // Smoothing stops the rail from feeling bolted directly to the scroll wheel.
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section ref={sectionRef} className="bg-ink-25 border-ink-100 section-y-lg border-y">
      <Container width="wide">
        <SectionHeading
          eyebrow="How it works"
          title="From site survey to evidenced savings in about six weeks."
          description="No pilot purgatory and no twelve-month integration project. The sequence below is what a single-site deployment actually looks like."
          className="mb-14"
        />

        <div className="relative">
          {/* Rail track. Hidden on small screens where steps stack full width. */}
          <div
            className="bg-ink-200 absolute top-2 bottom-2 left-[1.4375rem] w-px max-sm:hidden"
            aria-hidden
          />
          {/* Rail fill, driven by scroll progress. */}
          <motion.div
            style={{ scaleY: railScale }}
            className="bg-volt-500 absolute top-2 bottom-2 left-[1.4375rem] w-px origin-top max-sm:hidden"
            aria-hidden
          />

          <motion.ol
            data-reveal
            variants={staggerParent(0.14)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="flex flex-col gap-10"
          >
            {deploymentSteps.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                className="relative flex flex-col gap-4 sm:flex-row sm:gap-7"
              >
                {/* Step marker, sitting on top of the rail. */}
                <span className="ring-ink-25 bg-ink-900 relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ring-8">
                  <Icon name={step.icon} className="text-volt-400 size-5" />
                </span>

                <div className="sm:pt-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-ink-900 text-lg font-semibold">
                      {/*
                        `aria-hidden` because the number is purely visual
                        ordering that the surrounding `<ol>` already conveys.
                        Left exposed it would run into the title with no
                        separating space and be announced as "01Site survey".
                      */}
                      <span className="text-ink-300 mr-2 font-mono text-sm" aria-hidden>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {step.title}
                    </h3>
                    <Badge tone="neutral">{step.duration}</Badge>
                  </div>
                  <p className="text-ink-500 mt-2 max-w-2xl text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}
