'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';
import type { Feature } from '@/types';

/**
 * One cell of a hairline-separated feature grid.
 *
 * The grid draws its dividers with a 1px gap over a background colour rather
 * than with borders on each tile, which avoids the doubled lines and awkward
 * edge cases that per-tile borders produce as the column count changes across
 * breakpoints. That is why the tile itself is plain white with no border.
 */
export function FeatureTile({ feature }: { feature: Feature }) {
  return (
    <motion.li variants={fadeUp} className="group hover:bg-ink-25 bg-white p-7 transition-colors">
      <span className="text-volt-600 bg-volt-50 ring-volt-100 flex size-10 items-center justify-center rounded-lg ring-1 transition-transform duration-300 group-hover:-translate-y-0.5">
        <Icon name={feature.icon} className="size-[1.125rem]" />
      </span>

      <h3 className="text-ink-900 mt-5 text-[0.9375rem] font-semibold">{feature.title}</h3>
      <p className="text-ink-500 mt-2 text-[0.8125rem] leading-relaxed">{feature.description}</p>
    </motion.li>
  );
}
