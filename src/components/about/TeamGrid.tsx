'use client';

import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { fadeUp } from '@/lib/motion';
import type { TeamMember } from '@/types';

/**
 * Team cards.
 *
 * Monograms rather than photographs: a consistent, deliberate graphic beats
 * six stock portraits of varying quality and lighting, and it keeps the page
 * free of image assets entirely — nothing to optimise, nothing to go stale
 * when someone changes their haircut.
 */
export function TeamGrid({ members }: { members: readonly TeamMember[] }) {
  return (
    <>
      {members.map((member) => (
        <motion.li key={member.name} variants={fadeUp} className="flex">
          <SpotlightCard
            glow="rgb(8 157 125 / 0.07)"
            className="rounded-panel ring-ink-100 hover:ring-ink-200 hover:shadow-lift flex w-full flex-col gap-4 bg-white p-6 ring-1 transition-shadow duration-300"
          >
            <div className="flex items-center gap-4">
              <span
                className="bg-ink-900 text-volt-400 flex size-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold"
                aria-hidden
              >
                {member.initials}
              </span>
              <div className="min-w-0">
                <h3 className="text-ink-900 truncate text-[0.9375rem] font-semibold">
                  {member.name}
                </h3>
                <p className="text-ink-500 truncate text-[0.8125rem]">{member.role}</p>
              </div>
            </div>

            <p className="text-ink-500 text-[0.8125rem] leading-relaxed">{member.bio}</p>

            <p className="text-eyebrow text-volt-700 border-ink-100 mt-auto border-t pt-4 font-mono uppercase">
              {member.focus}
            </p>
          </SpotlightCard>
        </motion.li>
      ))}
    </>
  );
}
