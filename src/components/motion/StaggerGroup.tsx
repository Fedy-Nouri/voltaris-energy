'use client';

import { motion } from 'framer-motion';
import { revealViewport, staggerParent } from '@/lib/motion';
import { cn } from '@/lib/utils';

type StaggerGroupProps = {
  children: React.ReactNode;
  /** Gap between each child's start, in seconds. */
  stagger?: number;
  /** Hold before the first child starts, in seconds. */
  delay?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  className?: string;
};

/**
 * Releases its children one after another as the group scrolls into view.
 *
 * Only the group observes the viewport. Children just declare
 * `variants={fadeUp}` and inherit the `visible` state through Framer Motion's
 * variant propagation, which is why a twelve-card grid costs one observer
 * instead of twelve, and why the cards cannot drift out of sequence.
 */
export function StaggerGroup({
  children,
  stagger = 0.08,
  delay = 0,
  as = 'div',
  className,
}: StaggerGroupProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </MotionTag>
  );
}
