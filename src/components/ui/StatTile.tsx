'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { Stat } from '@/types';

type StatTileProps = {
  stat: Stat;
  /** Renders as the lead figure of the band, at a much larger size. */
  featured?: boolean;
  /**
   * The rendered figure. Passed in as a child rather than built here so the
   * parent decides whether it animates — the home page uses an
   * `AnimatedCounter`, while a generated Open Graph image needs plain text.
   */
  children: React.ReactNode;
};

/** A single headline figure with its label and supporting line. */
export function StatTile({ stat, featured = false, children }: StatTileProps) {
  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        'rounded-panel relative flex flex-col justify-end ring-1 ring-white/10 transition-colors duration-300 hover:ring-white/20',
        featured
          ? 'rounded-panel-lg border-glow bg-white/[0.04] p-8 sm:col-span-2 sm:p-10 lg:col-span-1 lg:row-span-3'
          : 'bg-white/[0.02] p-6',
      )}
    >
      <p
        className={cn(
          'tabular font-mono font-semibold text-white',
          featured ? 'text-display-lg' : 'text-display-sm',
        )}
      >
        {children}
      </p>
      <p className={cn('font-medium text-white', featured ? 'mt-3 text-lg' : 'mt-2 text-sm')}>
        {stat.label}
      </p>
      <p
        className={cn(
          'text-ink-400 mt-1.5 leading-relaxed',
          featured ? 'max-w-xs text-sm' : 'text-[0.8125rem]',
        )}
      >
        {stat.detail}
      </p>
    </motion.li>
  );
}
