'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { clamp } from '@/lib/utils';

type MagneticButtonProps = {
  children: React.ReactNode;
  /** Maximum pull in pixels. Kept small — this should be felt, not noticed. */
  strength?: number;
  className?: string;
};

/**
 * Leans its child towards the cursor while hovered, then springs back.
 *
 * Reserved for the one primary call to action per page. Applied broadly it
 * makes a layout feel unstable, so it is a separate wrapper rather than a
 * Button variant — using it has to be a conscious decision.
 */
export function MagneticButton({ children, strength = 10, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // The spring is what makes the release feel physical rather than linear.
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.6 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const bounds = ref.current.getBoundingClientRect();

    // Offset of the cursor from the element's centre, normalised to -1..1.
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

    x.set(clamp(offsetX, -1, 1) * strength);
    y.set(clamp(offsetY, -1, 1) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  if (prefersReducedMotion) {
    return <div className={cn('inline-flex', className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  );
}
