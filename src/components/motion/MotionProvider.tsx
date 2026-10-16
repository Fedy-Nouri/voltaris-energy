'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Global motion configuration.
 *
 * `reducedMotion="user"` makes Framer Motion read the OS "reduce motion"
 * preference and automatically drop transform and layout animations while
 * still allowing opacity changes. Setting it once here means every animation
 * in the app degrades gracefully without each component having to check the
 * preference itself; the few that need to change behaviour rather than just
 * stop moving — the live dashboard, the magnetic button — still call
 * `useReducedMotion()` directly.
 *
 * Deliberately not wrapped in `LazyMotion`: that optimisation only pays off if
 * every call site uses the stripped-down `m` component, and the feature bundle
 * it would need here (`domMax`, for the shared-layout animations on the nav
 * pill and the case-study panel) is most of the library's weight anyway.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
