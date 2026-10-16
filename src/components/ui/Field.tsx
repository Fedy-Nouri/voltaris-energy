'use client';

import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_QUINT } from '@/lib/motion';

type BaseFieldProps = {
  label: string;
  /** Validation message. Its presence is what puts the field in an error state. */
  error?: string;
  /** Helper text shown under the control while there is no error. */
  hint?: string;
  required?: boolean;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* Shared control styling                                                     */
/* -------------------------------------------------------------------------- */

const controlBase =
  'w-full rounded-lg bg-white px-3.5 py-3 text-[0.9375rem] text-ink-900 ' +
  'placeholder:text-ink-300 transition-[box-shadow,background-color] duration-200 ' +
  'ring-1 ring-ink-200 hover:ring-ink-300 ' +
  'focus:outline-none focus:ring-2 focus:ring-volt-500';

const controlError = 'ring-alert-400 hover:ring-alert-400 focus:ring-alert-500';

/**
 * Label, control and validation message as one unit.
 *
 * Accessibility is wired here once so no individual form can get it wrong:
 * `htmlFor`/`id` tie the label to the control, `aria-describedby` points at
 * whichever of the hint or error is currently showing, and `aria-invalid`
 * exposes the error state to assistive technology rather than relying on the
 * red ring alone.
 */
function FieldShell({
  label,
  error,
  hint,
  required,
  controlId,
  describedById,
  className,
  children,
}: BaseFieldProps & {
  controlId: string;
  describedById: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={controlId} className="text-ink-700 text-sm font-medium">
        {label}
        {required && (
          <span className="text-alert-500 ml-1" aria-hidden>
            *
          </span>
        )}
      </label>

      {children}

      {/* Reserve the message row so the form does not jump as errors appear. */}
      <div className="min-h-5" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {error ? (
            <motion.p
              key="error"
              id={describedById}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUINT }}
              className="text-alert-500 flex items-center gap-1.5 text-[0.8125rem]"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
              {error}
            </motion.p>
          ) : (
            hint && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                id={describedById}
                className="text-ink-400 text-[0.8125rem]"
              >
                {hint}
              </motion.p>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Text input                                                                 */
/* -------------------------------------------------------------------------- */

type InputFieldProps = BaseFieldProps & {
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  autoComplete?: string;
} & React.ComponentPropsWithRef<'input'>;

export function InputField({
  label,
  error,
  hint,
  required,
  className,
  type = 'text',
  ...inputProps
}: InputFieldProps) {
  const generatedId = useId();
  const controlId = inputProps.id ?? generatedId;
  const describedById = `${controlId}-message`;

  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      required={required}
      controlId={controlId}
      describedById={describedById}
      className={className}
    >
      <input
        {...inputProps}
        id={controlId}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? describedById : undefined}
        className={cn(controlBase, error && controlError)}
      />
    </FieldShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Textarea                                                                   */
/* -------------------------------------------------------------------------- */

type TextareaFieldProps = BaseFieldProps & React.ComponentPropsWithRef<'textarea'>;

export function TextareaField({
  label,
  error,
  hint,
  required,
  className,
  rows = 5,
  ...textareaProps
}: TextareaFieldProps) {
  const generatedId = useId();
  const controlId = textareaProps.id ?? generatedId;
  const describedById = `${controlId}-message`;

  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      required={required}
      controlId={controlId}
      describedById={describedById}
      className={className}
    >
      <textarea
        {...textareaProps}
        id={controlId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? describedById : undefined}
        className={cn(controlBase, 'resize-y', error && controlError)}
      />
    </FieldShell>
  );
}
