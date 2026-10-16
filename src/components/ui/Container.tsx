import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  /**
   * `default` suits most content, `wide` is for full-bleed dashboards and
   * grids, `narrow` keeps long-form prose at a readable measure.
   */
  width?: 'narrow' | 'default' | 'wide';
  className?: string;
};

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const;

/**
 * The single source of horizontal rhythm. Every section uses it, so page gutters
 * and max widths are consistent and only change in one place.
 */
export function Container({ children, width = 'default', className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', widths[width], className)}>{children}</div>
  );
}
