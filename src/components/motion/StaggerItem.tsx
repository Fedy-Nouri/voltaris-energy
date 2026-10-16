'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

type StaggerItemProps = {
  children: React.ReactNode;
  as?: 'div' | 'li' | 'article' | 'section';
  className?: string;
};

/**
 * A child of `StaggerGroup`.
 *
 * Variant inheritance in Framer Motion only reaches *motion* children, so a
 * plain `<li>` inside a stagger group silently never animates. This is the
 * minimal motion element that opts an otherwise static item in — needed
 * because a Server Component cannot create one inline, having no access to
 * `motion`.
 */
export function StaggerItem({ children, as = 'div', className }: StaggerItemProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag variants={fadeUp} className={className}>
      {children}
    </MotionTag>
  );
}
