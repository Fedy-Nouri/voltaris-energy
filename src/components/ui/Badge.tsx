import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'volt' | 'signal' | 'outline';

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  onDark?: boolean;
  /** Shows a small pulsing dot, for live or in-stock style states. */
  withDot?: boolean;
  className?: string;
};

const tones: Record<BadgeTone, { light: string; dark: string }> = {
  neutral: {
    light: 'bg-ink-50 text-ink-600 ring-1 ring-ink-100',
    dark: 'bg-white/5 text-ink-200 ring-1 ring-white/10',
  },
  volt: {
    light: 'bg-volt-50 text-volt-800 ring-1 ring-volt-200',
    dark: 'bg-volt-400/10 text-volt-300 ring-1 ring-volt-400/25',
  },
  signal: {
    light: 'bg-signal-400/12 text-signal-600 ring-1 ring-signal-400/30',
    dark: 'bg-signal-400/10 text-signal-300 ring-1 ring-signal-400/25',
  },
  outline: {
    light: 'text-ink-500 ring-1 ring-ink-200',
    dark: 'text-ink-300 ring-1 ring-white/12',
  },
};

/** Compact status or category chip. */
export function Badge({
  children,
  tone = 'neutral',
  onDark = false,
  withDot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'text-eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono font-medium uppercase',
        tones[tone][onDark ? 'dark' : 'light'],
        className,
      )}
    >
      {withDot && (
        <span
          aria-hidden
          className="animate-led size-1.5 shrink-0 rounded-full bg-current text-current"
        />
      )}
      {children}
    </span>
  );
}
