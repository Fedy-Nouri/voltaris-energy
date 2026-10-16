'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { clamp, cn } from '@/lib/utils';

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
    // Reduced motion is honoured by not moving, rather than by rendering a
    // different element — see the note below the component.
    if (!ref.current || prefersReducedMotion) return;
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

  /*
   * One tree, in every case.
   *
   * Returning a plain `div` under reduced motion and a `motion.div` otherwise
   * would be a hydration mismatch: `useReducedMotion()` reads a media query
   * that does not exist on the server, so SSR always produces the non-reduced
   * branch. A visitor with "reduce motion" enabled would then render something
   * different on the client and React would discard the server markup.
   * Instead the element is identical and the pointer handler simply declines
   * to move it.
   */
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
