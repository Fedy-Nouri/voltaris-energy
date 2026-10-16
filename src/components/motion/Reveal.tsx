'use client';

import { motion, type Variants } from 'framer-motion';
import { EASE_OUT_EXPO, revealViewport } from '@/lib/motion';

type RevealProps = {
  children: React.ReactNode;
  /** Direction the element travels from. */
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  /** Seconds to hold before starting — use sparingly, prefer StaggerGroup. */
  delay?: number;
  duration?: number;
  /** Travel distance in pixels. */
  distance?: number;
  as?: 'div' | 'section' | 'li' | 'span' | 'article';
  className?: string;
};

const offsets = {
  bottom: { y: 1, x: 0 },
  top: { y: -1, x: 0 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
} as const;

/**
 * Animates its children in the first time they scroll into view.
 *
 * Wraps `whileInView` rather than a hand-rolled IntersectionObserver: Framer
 * Motion shares one observer across every instance and runs the resulting
 * animation off the main thread where it can, so a page with forty reveals
 * does not pay for forty observers.
 *
 * `once: true` (from `revealViewport`) means an element settles permanently
 * after its first entrance — replaying on every scroll-by reads as noise.
 */
export function Reveal({
  children,
  from = 'bottom',
  delay = 0,
  duration = 0.6,
  distance = 24,
  as = 'div',
  className,
}: RevealProps) {
  const offset = offsets[from];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x * distance,
      y: offset.y * distance,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: EASE_OUT_EXPO },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      /*
       * Marks this element for the `<noscript>` rule in the root layout, which
       * forces it visible if JavaScript never runs. Without it, a reveal's
       * `hidden` state would be the final state for such a visitor.
       */
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </MotionTag>
  );
}
