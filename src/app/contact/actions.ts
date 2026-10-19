'use server';

import { headers } from 'next/headers';
import { getEnquiries, isDatabaseConfigured } from '@/lib/mongodb';
import { buildEnquiryDocument } from '@/types/enquiry';
import { contactSchema, type ContactInput, type ContactState } from '@/lib/validation';

/**
 * Very small fixed-window rate limiter.
 *
 * In-memory on purpose. This is a marketing site deployed as serverless
 * functions, so the map lives only as long as one warm instance and is not
 * shared between them — it will not stop a determined, distributed flood, and
 * it is not pretending to. What it does do, at zero cost and with no extra
 * infrastructure, is stop a single client hammering the endpoint in a loop.
 *
 * The moment this needed to be authoritative it should move to Upstash Redis
 * or Vercel KV, which is a change to this one function and nothing else.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = submissions.get(key);

  if (!record || now > record.expiresAt) {
    submissions.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_MAX;
}

/** Best-effort client identity, from the proxy headers Vercel sets. */
async function getClientKey(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Handles a contact form submission.
 *
 * Signature matches what `useActionState` expects: `(previousState, formData)`.
 * Taking `FormData` rather than a typed object is deliberate — it means the
 * form still works as a plain HTML form when JavaScript has not loaded, with
 * the browser posting it natively and React hydrating the result afterwards.
 */
export async function submitContactForm(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1. Re-validate on the server. The client already checked, but the client
  //    is not a trustworthy place to enforce anything.
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
    website: formData.get('website'),
  });

  if (!parsed.success) {
    const errors: ContactState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput | undefined;
      // Keep the first message per field; the rest are usually noise.
      if (field && !errors[field]) errors[field] = issue.message;
    }

    return {
      status: 'error',
      message: 'Please check the highlighted fields and try again.',
      errors,
    };
  }

  // 2. Honeypot. A real visitor cannot reach this field, so anything in it
  //    came from a bot. Respond as though it succeeded rather than explaining
  //    what gave it away.
  if (parsed.data.website) {
    return { status: 'success', message: 'Thanks — we will be in touch shortly.' };
  }

  // 3. Rate limit.
  if (isRateLimited(await getClientKey())) {
    return {
      status: 'error',
      message: 'That is a few too many messages in a short time. Please try again in a minute.',
    };
  }

  // 4. Store it. A failure here must not look like a validation problem, so it
  //    returns the generic error rather than anything field-specific.
  const stored = await deliverEnquiry(parsed.data);

  if (!stored) {
    return {
      status: 'error',
      message:
        'Something went wrong on our side and your message was not saved. Please try again, or email us directly.',
    };
  }

  return {
    status: 'success',
    message: 'Thanks — your enquiry is with the team. We reply within one working day.',
  };
}

/**
 * Persists the enquiry to MongoDB, for the admin dashboard to read later.
 *
 * Returns `true` when the enquiry is safely stored and `false` when it is not,
 * rather than throwing, so the caller decides what the visitor sees.
 *
 * Degrades deliberately: with no `MONGODB_URI` configured it logs and reports
 * success. That keeps a fresh clone of this repository working — the contact
 * form should not be the thing that breaks for someone evaluating the project
 * without a database.
 */
async function deliverEnquiry(enquiry: ContactInput): Promise<boolean> {
  const document = buildEnquiryDocument(enquiry);

  if (!isDatabaseConfigured()) {
    console.info('[contact] no MONGODB_URI set — enquiry logged instead of stored', {
      name: document.name,
      email: document.email,
      company: document.company ?? '—',
      messageLength: document.message.length,
      receivedAt: document.createdAt.toISOString(),
    });
    return true;
  }

  try {
    const enquiries = await getEnquiries();
    const result = await enquiries.insertOne(document);
    console.info('[contact] enquiry stored', { id: result.insertedId.toString() });
    return true;
  } catch (error) {
    // Log the detail server-side; the visitor gets a generic message because a
    // database outage is not something they can fix by editing a field.
    console.error('[contact] failed to store enquiry', error);
    return false;
  }
}
