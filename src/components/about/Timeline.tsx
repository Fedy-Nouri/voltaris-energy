'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { fadeUp, revealViewport, staggerParent } from '@/lib/motion';
import type { Milestone } from '@/types';

/**
 * Company history as a scroll-linked vertical timeline.
 *
 * The rail fills as the section scrolls past. `useScroll` is scoped to this
 * element via `target`, so `scrollYProgress` describes this section's own
 * travel through the viewport rather than the document's — which is what makes
 * the fill line up with the milestones regardless of what sits above it.
 */
export function Timeline({ milestones }: { milestones: readonly Milestone[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 65%'],
  });

  const railScale = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      {/* Rail track */}
      <div
        className="bg-ink-200 absolute top-2 bottom-2 left-[4.5rem] hidden w-px sm:block"
        aria-hidden
      />
      {/* Rail fill, scaled by scroll progress */}
      <motion.div
        style={{ scaleY: railScale }}
        className="bg-volt-500 absolute top-2 bottom-2 left-[4.5rem] hidden w-px origin-top sm:block"
        aria-hidden
      />

      <motion.ol
        data-reveal
        variants={staggerParent(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="flex flex-col gap-10"
      >
        {milestones.map((milestone) => (
          <motion.li
            key={milestone.year}
            variants={fadeUp}
            className="relative flex flex-col gap-3 sm:flex-row sm:gap-8"
          >
            <span className="text-volt-700 tabular w-16 shrink-0 font-mono text-sm font-semibold sm:pt-1">
              {milestone.year}
            </span>

            {/* Marker sitting on the rail. */}
            <span
              className="ring-ink-25 bg-volt-500 absolute left-[4.5rem] z-10 hidden size-3 -translate-x-1/2 rounded-full ring-4 sm:block sm:translate-y-2"
              aria-hidden
            />

            <div className="sm:pl-8">
              <h3 className="text-ink-900 text-base font-semibold">{milestone.title}</h3>
              <p className="text-ink-500 mt-1.5 max-w-2xl text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
