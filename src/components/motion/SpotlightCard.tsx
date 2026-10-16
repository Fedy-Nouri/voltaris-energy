'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightCardProps = {
  children: React.ReactNode;
  /** Tailwind colour for the spotlight, as a CSS colour string. */
  glow?: string;
  className?: string;
};

/**
 * A panel with a soft highlight that follows the cursor.
 *
 * The pointer position lives in two MotionValues that feed a CSS
 * `radial-gradient` through `useMotionTemplate`. Nothing re-renders on mouse
 * move — Framer Motion writes the composed string to the element's style
 * directly, so this stays cheap even with a dozen cards on screen.
 *
 * The effect is pointer-driven decoration only; it is skipped under reduced
 * motion and is invisible on touch devices, where there is no hover state.
 */
export function SpotlightCard({
  children,
  glow = 'rgb(29 224 181 / 0.14)',
  className,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Start far outside the card so no highlight shows before the first move.
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const background = useMotionTemplate`radial-gradient(260px circle at ${mouseX}px ${mouseY}px, ${glow}, transparent 72%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  function handlePointerLeave() {
    mouseX.set(-9999);
    mouseY.set(-9999);
  }

  return (
    <div
      ref={ref}
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      onPointerLeave={prefersReducedMotion ? undefined : handlePointerLeave}
      className={cn('group relative isolate overflow-hidden', className)}
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{ background }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </div>
  );
}
