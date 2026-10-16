import { z } from 'zod';

/**
 * The contact form's validation rules — the single definition used by both
 * sides of the form.
 *
 * The client imports it for `zodResolver`, so a visitor sees an error the
 * moment they leave a field. The Server Action imports the same object and
 * re-validates before doing anything with the data.
 *
 * Both halves matter. Client-side validation is a convenience and nothing more:
 * anyone can post directly to the action with `curl` and never run a line of
 * our JavaScript, so the server treats every submission as untrusted. Sharing
 * one schema is what stops the two sides drifting apart — a rule changed here
 * changes in both places at once, which is not true of two hand-written
 * validators that merely look similar.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is longer than we can store.'),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('That does not look like a valid email address.')
    .max(254, 'That email address is too long.'),

  company: z
    .string()
    .trim()
    .max(120, 'That company name is too long.')
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .trim()
    .min(20, 'Please give us at least a sentence or two — 20 characters minimum.')
    .max(2000, 'Please keep this under 2,000 characters.'),

  /**
   * Honeypot.
   *
   * Hidden from sighted users with CSS and from screen readers with
   * `aria-hidden` plus `tabIndex={-1}`, so no real person ever fills it in.
   * Most naive bots fill every input they find, which makes a non-empty value
   * here a reliable spam signal — and a far better experience than a CAPTCHA,
   * which taxes every genuine visitor to stop a few.
   */
  website: z.literal('', { message: 'Submission rejected.' }).optional(),
});

/** The validated shape, inferred rather than written out twice. */
export type ContactInput = z.infer<typeof contactSchema>;

/** What the Server Action returns to the form. */
export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Field-level messages, keyed by field name, for a no-JS submission. */
  errors?: Partial<Record<keyof ContactInput, string>>;
};
