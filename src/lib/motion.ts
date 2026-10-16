import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion language.
 *
 * Every animation in the app pulls its easing and timing from here so the whole
 * site moves with one character instead of each component inventing its own
 * curve. The cubic-bezier values mirror the `--ease-*` tokens in globals.css,
 * which keeps CSS transitions and Framer Motion animations consistent.
 */

/** cubic-bezier(0.16, 1, 0.3, 1) — fast start, long gentle settle. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** cubic-bezier(0.22, 1, 0.36, 1) — slightly softer variant for small moves. */
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** Symmetric curve for things that travel both ways, e.g. drawers. */
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

/** Default transition for entrances. */
export const transitionBase: Transition = {
  duration: 0.6,
  ease: EASE_OUT_EXPO,
};

/** Snappier transition for hover and tap feedback. */
export const transitionSnappy: Transition = {
  duration: 0.25,
  ease: EASE_OUT_QUINT,
};

/** Spring used where motion should feel physical rather than timed. */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

/* -------------------------------------------------------------------------- */
/* Reusable variant sets                                                      */
/* -------------------------------------------------------------------------- */

/** Rise-and-fade, the default section entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
};

/** Plain fade, for elements where vertical travel would feel fussy. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
};

/** Scale-and-fade, for panels and cards that should feel like they land. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitionBase },
};

/**
 * Parent variant that releases children one after another.
 *
 * Children only need `variants={fadeUp}` — they inherit the `visible` state
 * from the parent through Framer Motion's variant propagation, so no child
 * needs its own `whileInView` observer.
 */
export function staggerParent(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/**
 * Viewport settings for scroll-triggered reveals.
 *
 * `once: true` means an element animates the first time it enters and then
 * stays put — re-animating on every scroll-by reads as noise on a long page.
 * The negative bottom margin holds the trigger back slightly so the animation
 * starts once the element is meaningfully on screen, not at the very edge.
 */
export const revealViewport = { once: true, margin: '0px 0px -12% 0px' } as const;
