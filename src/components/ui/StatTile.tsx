'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import type { Stat } from '@/types';

type StatTileProps = {
  stat: Stat;
  /**
   * The rendered figure. Passed in as a child rather than built here so the
   * parent decides whether it animates — the home page uses an
   * `AnimatedCounter`, while a generated Open Graph image needs plain text.
   */
  children: React.ReactNode;
};

/** A single headline figure with its label and supporting line. */
export function StatTile({ stat, children }: StatTileProps) {
  return (
    <motion.li variants={fadeUp} className="border-l border-white/10 pl-5">
      <p className="text-display-sm tabular font-mono font-semibold text-white">{children}</p>
      <p className="mt-2 text-sm font-medium text-white">{stat.label}</p>
      <p className="text-ink-400 mt-1 text-[0.8125rem] leading-relaxed">{stat.detail}</p>
    </motion.li>
  );
}
