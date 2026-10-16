import { cn } from '@/lib/utils';
import type { Spec } from '@/types';

type SpecTableProps = {
  specs: readonly Spec[];
  onDark?: boolean;
  /** Visually hidden caption describing the table for screen readers. */
  caption?: string;
  className?: string;
};

/**
 * Key/value specification list.
 *
 * Built as a real `<table>` with row headers rather than a flex grid: this is
 * genuinely tabular data, so the semantics let a screen reader announce
 * "Sampling rate, 1 second" as a pair instead of reading two loose strings.
 * Values are monospaced and tabular-figured so the numeric column lines up.
 */
export function SpecTable({ specs, onDark = false, caption, className }: SpecTableProps) {
  return (
    <table className={cn('w-full border-collapse text-left text-sm', className)}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {specs.map((spec, index) => (
          <tr
            key={spec.label}
            className={cn(
              'align-baseline',
              index !== 0 && (onDark ? 'border-t border-white/8' : 'border-ink-100 border-t'),
            )}
          >
            <th
              scope="row"
              className={cn(
                'w-1/2 py-2.5 pr-4 font-normal',
                onDark ? 'text-ink-400' : 'text-ink-500',
              )}
            >
              {spec.label}
            </th>
            <td
              className={cn(
                'py-2.5 font-mono text-[0.8125rem] font-medium',
                onDark ? 'text-ink-100' : 'text-ink-800',
              )}
            >
              {spec.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
