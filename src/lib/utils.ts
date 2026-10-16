/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not `clsx` + `tailwind-merge`: this project composes classes by
 * keeping variant maps mutually exclusive rather than by overriding earlier
 * utilities, so conflict resolution is never needed and two dependencies are
 * saved. If a component ever genuinely needs to override a base utility from
 * the outside, that is the point to reach for `tailwind-merge`.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Formats a number with thin thousands separators, e.g. 1 240 → "1,240". */
export function formatNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Small deterministic PRNG (mulberry32).
 *
 * Used by the live dashboard so the first rendered frame is identical on the
 * server and on the client. Calling `Math.random()` during render would
 * produce different markup in each place and trip a hydration mismatch.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Constrains a value to the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
