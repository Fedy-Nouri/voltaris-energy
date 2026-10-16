/**
 * Tailwind CSS v4 is wired through PostCSS rather than the Turbopack-only CSS
 * loader the Next.js scaffold ships with, so styles compile identically in dev,
 * in `next build`, and on Vercel regardless of which bundler runs.
 */
const config = {
  plugins: ['@tailwindcss/postcss'],
};

export default config;
