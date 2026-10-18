'use client';

import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Page transition wrapper.
 *
 * `template.tsx` rather than `layout.tsx`: a layout instance persists across
 * navigations, so an entrance animation declared there would play exactly once
 * in a session. A template is re-mounted on every navigation, which is precisely
 * the lifecycle an enter animation needs.
 *
 * There is intentionally no exit animation. With the App Router, the outgoing
 * tree unmounts as soon as the next route commits, so wrapping routes in
 * `AnimatePresence` to animate them out produces either a flash of the old page
 * or a stall before the new one appears. An enter-only transition is the
 * honest, jank-free option — `AnimatePresence` is used where it genuinely works
 * instead, for the mobile drawer and the case-study detail panel.
 *
 * The transition deliberately does **not** animate opacity. Every page opens
 * with a near-black hero (#06090b) while the page background is white, so
 * fading a new route in from `opacity: 0` showed white through it for the
 * first ~75ms of every navigation — a visible flash between two dark pages,
 * and on cold loads too. An opaque rise keeps the hero painted on the very
 * first frame; the hero's own `Reveal` still animates its content in, so the
 * entrance is layered rather than lost.
 *
 * The `data-page-transition` attribute is targeted by a `<noscript>` rule in
 * the root layout, which is harmless now that nothing here is transparent.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-page-transition
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
