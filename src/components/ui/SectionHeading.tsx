import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
  /**
   * Heading level. Sections default to `h2`; pass `h1` only on the one element
   * per page that is the page's actual title.
   */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

/**
 * Section intro block: eyebrow, heading and supporting line.
 *
 * Centralised so vertical rhythm, measure and reveal timing are identical in
 * every section, and so heading levels stay explicit rather than accidental.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  onDark = false,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <Reveal
      className={cn('flex flex-col gap-4', isCentered && 'items-center text-center', className)}
    >
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}

      <Tag
        className={cn(
          'text-display-md max-w-2xl font-semibold text-balance',
          onDark ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </Tag>

      {description && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed sm:text-[1.0625rem]',
            onDark ? 'text-ink-300' : 'text-ink-500',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
