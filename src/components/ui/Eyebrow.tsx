import { cn } from '@/lib/utils';

type EyebrowProps = {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
};

/**
 * Small uppercase label that sits above a section heading, with a short rule
 * leading into it. Used instead of a second heading level so the document
 * outline stays clean for screen readers and SEO.
 */
export function Eyebrow({ children, onDark = false, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow flex items-center gap-2.5 font-mono font-medium uppercase',
        onDark ? 'text-volt-400' : 'text-volt-700',
        className,
      )}
    >
      <span aria-hidden className={cn('h-px w-6', onDark ? 'bg-volt-400/50' : 'bg-volt-700/40')} />
      {children}
    </p>
  );
}
