'use client';

import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { Icon } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { Feature } from '@/types';

type FeatureTileProps = {
  feature: Feature;
  /**
   * The lead cell of the bento grid. Renders larger and with more room, so the
   * grid has a clear entry point instead of eight cells of equal weight.
   */
  featured?: boolean;
  /** Spans two columns without the full lead treatment. */
  wide?: boolean;
};

/**
 * One cell of the platform bento grid.
 *
 * Each tile is a discrete panel rather than a cell in a hairline-divided table.
 * That is what lets cells take different sizes — a shared divider grid has to
 * stay rectangular, where separate panels can be arranged freely.
 */
export function FeatureTile({ feature, featured = false, wide = false }: FeatureTileProps) {
  return (
    <motion.li
      variants={fadeUp}
      className={cn('group', featured && 'sm:col-span-2 sm:row-span-2', wide && 'sm:col-span-2')}
    >
      <SpotlightCard
        glow="rgb(8 157 125 / 0.07)"
        className={cn(
          'ring-ink-100 hover:ring-ink-200 hover:shadow-lift flex h-full flex-col bg-white ring-1 transition-shadow duration-300',
          featured
            ? 'rounded-panel-lg border-glow shadow-panel gap-5 p-8 sm:p-10'
            : 'rounded-panel gap-4 p-6 sm:p-7',
        )}
      >
        <span
          className={cn(
            'text-volt-700 bg-volt-50 ring-volt-100 flex items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:-translate-y-0.5',
            featured ? 'size-14' : 'size-11',
          )}
        >
          <Icon name={feature.icon} className={featured ? 'size-6' : 'size-5'} />
        </span>

        <div className="mt-auto">
          <h3
            className={cn(
              'text-ink-900 font-semibold',
              featured ? 'text-display-sm' : 'text-[1.0625rem]',
            )}
          >
            {feature.title}
          </h3>
          <p
            className={cn(
              'text-ink-500 mt-2.5 leading-relaxed',
              featured ? 'max-w-md text-[0.9375rem]' : 'text-sm',
            )}
          >
            {feature.description}
          </p>
        </div>
      </SpotlightCard>
    </motion.li>
  );
}
