'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { formatNumber } from '@/lib/utils';

type AnimatedCounterProps = {
  /** Final value to count up to. */
  value: number;
  /** Decimal places to show, and to interpolate at. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * Three deliberate choices:
 *
 * 1. The markup is server-rendered with the *final* figure. Crawlers, social
 *    previews and anyone without JavaScript get the real number rather than a
 *    zero, and the element reserves its final width immediately so the count
 *    cannot cause layout shift.
 *
 * 2. On mount the text is swapped to the animation's start value, which happens
 *    in the same tick as hydration and so is not perceptible. Under reduced
 *    motion this swap is skipped entirely and the server-rendered figure stands.
 *
 * 3. Frames are written straight to the DOM node via `textContent` instead of
 *    through React state. A spring emits a value every frame, so `setState`
 *    would re-render this component ~60 times a second; writing the text node
 *    directly skips reconciliation completely.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const prefersReducedMotion = useReducedMotion();

  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 70, damping: 22, mass: 1 });

  const format = useCallback(
    (n: number) => `${prefix}${formatNumber(n, decimals)}${suffix}`,
    [prefix, suffix, decimals],
  );

  // Replace the server-rendered final figure with the start value, once.
  const hasReset = useRef(false);
  useEffect(() => {
    if (prefersReducedMotion || hasReset.current || !ref.current) return;
    hasReset.current = true;
    ref.current.textContent = format(0);
  }, [prefersReducedMotion, format]);

  // Write each frame of the spring to the DOM.
  useEffect(() => {
    if (prefersReducedMotion) return;
    return spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
  }, [spring, format, prefersReducedMotion]);

  // Start the count when the element reaches the viewport.
  useEffect(() => {
    if (isInView && !prefersReducedMotion) progress.set(value);
  }, [isInView, prefersReducedMotion, progress, value]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
