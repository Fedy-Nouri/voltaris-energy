'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { SpotlightCard } from '@/components/motion/SpotlightCard';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const MotionLink = motion.create(Link);

type CardProps = {
  children: React.ReactNode;
  onDark?: boolean;
  /** Makes the whole card a link, with a lift on hover. */
  href?: string;
  /** Pointer-tracked highlight. Worth it for feature cards, noise elsewhere. */
  spotlight?: boolean;
  /**
   * Entrance variants. Defaults to `fadeUp`, which a parent `StaggerGroup`
   * drives; pass `false` for a card that should not animate at all.
   */
  variants?: Variants | false;
  className?: string;
};

/**
 * The standard surface: hairline border, subtle shadow, and a lift on hover
 * when it is interactive. Static and linked cards share one definition so a
 * grid mixing the two still looks uniform.
 */
export function Card({
  children,
  onDark = false,
  href,
  spotlight = false,
  variants = fadeUp,
  className,
}: CardProps) {
  const surface = onDark
    ? 'bg-ink-850/70 ring-1 ring-white/8 backdrop-blur-sm'
    : 'bg-white ring-1 ring-ink-100 shadow-panel';

  const interactive = onDark
    ? 'hover:ring-volt-400/35 hover:bg-ink-800/80'
    : 'hover:ring-ink-200 hover:shadow-lift';

  const classes = cn(
    'rounded-panel relative flex flex-col transition-[box-shadow,background-color] duration-300',
    surface,
    href && interactive,
    className,
  );

  const motionProps = {
    ...(variants === false ? {} : { variants }),
    ...(href ? { whileHover: { y: -4 }, whileTap: { y: -1 } } : {}),
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  };

  const inner = spotlight ? (
    <SpotlightCard
      className="rounded-panel flex h-full flex-col"
      glow={onDark ? 'rgb(29 224 181 / 0.16)' : 'rgb(8 157 125 / 0.08)'}
    >
      {children}
    </SpotlightCard>
  ) : (
    children
  );

  if (href) {
    return (
      <MotionLink href={href} className={classes} {...motionProps}>
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.div className={classes} {...motionProps}>
      {inner}
    </motion.div>
  );
}
