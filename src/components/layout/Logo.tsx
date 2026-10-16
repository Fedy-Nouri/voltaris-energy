import { cn } from '@/lib/utils';
import { site } from '@/content/site';

type LogoProps = {
  onDark?: boolean;
  /** Hides the wordmark, leaving just the mark. Used in tight spaces. */
  markOnly?: boolean;
  className?: string;
};

/**
 * Brand lockup: an inline SVG mark plus the wordmark.
 *
 * Drawn as SVG rather than shipped as an image file so it stays crisp at any
 * size, inherits `currentColor`, costs no extra network request, and can be
 * reused inside the generated Open Graph images.
 *
 * The mark is a meter dial arc with a bar rising through it — measurement and
 * the load being measured.
 */
export function Logo({ onDark = false, markOnly = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn('size-8 shrink-0', onDark ? 'text-volt-400' : 'text-volt-600')}
        aria-hidden
        fill="none"
      >
        {/* Dial arc, open at the bottom like an analogue gauge. */}
        <path
          d="M5.5 24.5a13 13 0 1 1 21 0"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        {/* Load bars rising through the dial. */}
        <path
          d="M11 22V17M16 22V11M21 22v-8"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="16" cy="26" r="1.75" fill="currentColor" />
      </svg>

      {!markOnly && (
        <span
          className={cn(
            'text-[1.0625rem] leading-none font-semibold tracking-tight',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        >
          {site.name}
        </span>
      )}
    </span>
  );
}
