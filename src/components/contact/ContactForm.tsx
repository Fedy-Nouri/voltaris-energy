'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { submitContactForm } from '@/app/contact/actions';
import { InputField, TextareaField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { contactSchema, type ContactInput, type ContactState } from '@/lib/validation';
import { EASE_OUT_EXPO } from '@/lib/motion';

const initialState: ContactState = { status: 'idle' };

/**
 * Contact form.
 *
 * Two validation layers working together rather than competing:
 *
 * - **react-hook-form + zodResolver** runs in the browser against
 *   `contactSchema`, so a mistake is flagged as soon as a field is left rather
 *   than after a round trip. RHF keeps inputs uncontrolled, so typing does not
 *   re-render the form on every keystroke.
 * - **The Server Action** re-validates against the *same* schema. The client
 *   check is a convenience; this one is the actual gate.
 *
 * The `<form>` keeps a real `action`, so if JavaScript has not loaded the
 * browser posts it natively, the action runs, and the result still comes back —
 * the enhanced experience layers on top rather than being a prerequisite.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /**
   * Whether the client has taken over.
   *
   * Server-rendered markup — which is all a visitor without JavaScript ever
   * gets — needs the Server Action's per-field errors, because react-hook-form
   * has not run. Once hydrated, react-hook-form is authoritative and the
   * server's copies must be ignored: both sides validate against the same
   * schema, so they cannot disagree, and continuing to read the server's
   * errors would leave a stale message under a field the visitor has already
   * corrected.
   */
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit: validateThen,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    // Validate when a field is left, then live as it is corrected — nagging
    // while someone is still halfway through typing their email is hostile.
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // Clear the fields once the server confirms, and move focus to the
  // confirmation so a screen reader announces the outcome rather than the
  // visitor being left on a now-empty form wondering what happened.
  useEffect(() => {
    if (state.status === 'success') {
      reset();
      formRef.current?.reset();
      successRef.current?.focus();
    }
  }, [state.status, reset]);

  /**
   * Validates on the client, then invokes the Server Action by hand.
   *
   * The obvious version of this — `onSubmit={async e => { if (!await trigger())
   * e.preventDefault() }}` — silently does nothing. `preventDefault` only has
   * an effect while the event is still being dispatched, and the first `await`
   * ends that window, so React has already fired the form's action by the time
   * the validation result comes back. Invalid submissions reach the server
   * anyway.
   *
   * So the submit is always cancelled, and the action is called explicitly once
   * validation passes. Progressive enhancement survives intact: this handler
   * only exists when JavaScript has loaded, and without it the form's `action`
   * posts natively as a plain HTML form.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Captured now: `currentTarget` is nulled once the event finishes
    // dispatching, and the callback below runs after validation resolves.
    const form = event.currentTarget;

    void validateThen(() => {
      // Actions from `useActionState` must be dispatched inside a transition.
      startTransition(() => formAction(new FormData(form)));
    })(event);
  }

  const serverError = state.status === 'error' ? state.message : undefined;

  /** Client error once hydrated, server error before then. */
  const fieldError = (field: keyof ContactInput) =>
    isHydrated ? errors[field]?.message : state.errors?.[field];

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-1"
    >
      {/* ---- Server-level outcome ---- */}
      <AnimatePresence mode="wait">
        {state.status === 'success' && (
          <motion.div
            ref={successRef}
            key="success"
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="bg-volt-50 ring-volt-200 mb-5 flex items-start gap-3 rounded-lg p-4 ring-1 focus:outline-none"
          >
            <CheckCircle2 className="text-volt-700 mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-volt-900 text-sm">{state.message}</p>
          </motion.div>
        )}

        {serverError && (
          <motion.div
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="bg-alert-400/10 ring-alert-400/30 mb-5 flex items-start gap-3 rounded-lg p-4 ring-1"
          >
            <AlertCircle className="text-alert-500 mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-ink-800 text-sm">{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <InputField
          label="Name"
          required
          autoComplete="name"
          placeholder="Jane Okonkwo"
          error={fieldError('name')}
          {...register('name')}
        />

        <InputField
          label="Work email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@company.com"
          error={fieldError('email')}
          {...register('email')}
        />
      </div>

      <InputField
        label="Company"
        autoComplete="organization"
        placeholder="Optional"
        hint="Helps us bring the right engineer to the call."
        error={fieldError('company')}
        {...register('company')}
      />

      <TextareaField
        label="What would you like to measure?"
        required
        rows={6}
        placeholder="Tell us about the site — what you run, roughly how big it is, and what you are trying to find out. A couple of sentences is plenty to start."
        hint="At least 20 characters."
        error={fieldError('message')}
        {...register('message')}
      />

      {/*
        Honeypot. Hidden from sight, from the tab order and from the
        accessibility tree, so only an automated client will ever fill it.
        `aria-hidden` plus `tabIndex={-1}` is what makes this honest — a
        screen-reader user is never asked to skip a field they cannot see.
      */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isPending} icon="arrowRight">
          {isPending ? 'Sending…' : 'Send enquiry'}
        </Button>

        <p className="text-ink-400 flex items-center gap-2 text-[0.8125rem]">
          <Send className="size-3.5 shrink-0" aria-hidden />
          We reply within one working day.
        </p>
      </div>
    </form>
  );
}
