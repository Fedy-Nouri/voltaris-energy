'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transitionSnappy } from '@/lib/motion';

const MotionLink = motion.create(Link);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Switches the neutral variants to their light-on-dark palette. */
  onDark?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  /** Renders as a Next.js `<Link>` instead of a `<button>`. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
  'aria-label'?: string;
};

/* -------------------------------------------------------------------------- */
/* Styling                                                                    */
/* -------------------------------------------------------------------------- */

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden ' +
  'rounded-lg font-medium whitespace-nowrap transition-colors duration-200 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-[0.9375rem]',
};

/**
 * Variant classes are mutually exclusive — no variant relies on overriding a
 * utility set by another. That is what lets `cn()` stay a plain join rather
 * than needing `tailwind-merge` to resolve conflicts.
 */
const variantStyles: Record<ButtonVariant, { light: string; dark: string }> = {
  primary: {
    light: 'bg-volt-500 text-ink-950 hover:bg-volt-400',
    dark: 'bg-volt-400 text-ink-950 hover:bg-volt-300',
  },
  secondary: {
    light: 'bg-ink-900 text-white hover:bg-ink-800',
    dark: 'bg-white text-ink-900 hover:bg-ink-50',
  },
  outline: {
    light: 'border border-ink-200 text-ink-800 hover:border-ink-400 hover:bg-ink-25',
    dark: 'border border-white/15 text-ink-100 hover:border-volt-400/50 hover:bg-white/5',
  },
  ghost: {
    light: 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
    dark: 'text-ink-300 hover:bg-white/5 hover:text-white',
  },
};

/* -------------------------------------------------------------------------- */
/* Motion                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The button owns the variant state and its children inherit it, so the icon
 * nudge and the sheen sweep stay in sync with the press without any of them
 * needing their own event handlers.
 */
const buttonMotion: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.975 },
};

const iconMotion: Variants = {
  rest: { x: 0 },
  hover: { x: 3 },
  tap: { x: 1 },
};

/** A highlight that sweeps across filled buttons once on hover. */
const sheenMotion: Variants = {
  rest: { x: '-130%', opacity: 0 },
  hover: { x: '130%', opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  tap: { x: '130%', opacity: 0 },
};

/* -------------------------------------------------------------------------- */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onDark = false,
  icon: Icon,
  iconPosition = 'right',
  fullWidth = false,
  className,
  href,
  type = 'button',
  disabled,
  onClick,
  target,
  rel,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isFilled = variant === 'primary' || variant === 'secondary';

  const classes = cn(
    base,
    sizeStyles[size],
    variantStyles[variant][onDark ? 'dark' : 'light'],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {/* Sheen sits behind the label and is purely decorative. */}
      {isFilled && (
        <motion.span
          aria-hidden
          variants={sheenMotion}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}

      {Icon && iconPosition === 'left' && (
        <motion.span variants={iconMotion} className="relative shrink-0">
          <Icon className="size-4" aria-hidden />
        </motion.span>
      )}

      <span className="relative">{children}</span>

      {Icon && iconPosition === 'right' && (
        <motion.span variants={iconMotion} className="relative shrink-0">
          <Icon className="size-4" aria-hidden />
        </motion.span>
      )}
    </>
  );

  // Shared motion configuration. Declared once rather than duplicated across
  // the link and button branches below.
  const motionProps = {
    variants: buttonMotion,
    initial: 'rest' as const,
    whileHover: 'hover' as const,
    whileTap: 'tap' as const,
    animate: 'rest' as const,
    transition: transitionSnappy,
  };

  // Two explicit branches instead of a polymorphic `as` prop: it keeps the
  // props fully typed with no casts, and a button only ever needs to be one of
  // these two things.
  if (href) {
    return (
      <MotionLink
        {...motionProps}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
