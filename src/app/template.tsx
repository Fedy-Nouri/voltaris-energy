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
 * The `data-page-transition` attribute is targeted by a `<noscript>` rule in
 * the root layout, so the content is never left at `opacity: 0` for a visitor
 * whose JavaScript fails to load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-page-transition
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
