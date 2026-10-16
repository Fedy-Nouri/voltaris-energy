'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin reading-progress bar pinned under the header.
 *
 * `useScroll` gives a 0–1 MotionValue for the document, which drives `scaleX`
 * directly. Because the value is written to the transform rather than to React
 * state, scrolling never triggers a re-render, and a transform-only animation
 * stays on the compositor instead of forcing layout.
 *
 * The spring removes the 1:1 stiffness of raw scroll, which otherwise makes the
 * bar feel mechanically attached to the wheel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="via-volt-400 to-volt-300 fixed inset-x-0 top-18 z-50 h-px origin-left bg-gradient-to-r from-transparent"
    />
  );
}
