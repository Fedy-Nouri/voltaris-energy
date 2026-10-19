import type { ContactInput } from '@/lib/validation';

/**
 * Lifecycle of an enquiry, for the admin dashboard that will read these.
 *
 * Stored from the first insert even though nothing sets anything but `new`
 * yet — adding the field later would mean backfilling every existing document
 * or writing queries that handle its absence.
 */
export type EnquiryStatus = 'new' | 'read' | 'archived';

/**
 * An enquiry as stored in MongoDB.
 *
 * Note what is absent: no IP address and no user agent. The rate limiter
 * derives an IP transiently and discards it; persisting one would turn a
 * contact form into a store of personal data with no present purpose, which
 * sits badly against the GDPR claim the site's own FAQ makes. If abuse tracing
 * is ever needed, a salted hash is the thing to add — not the raw value.
 */
export type EnquiryDocument = {
  name: string;
  email: string;
  /** Optional on the form, normalised to `null` rather than an empty string. */
  company: string | null;
  message: string;
  /** Indexed descending — the dashboard lists newest first. */
  createdAt: Date;
  status: EnquiryStatus;
  /** Where the enquiry came from, so a future second channel stays distinguishable. */
  source: 'website';
};

/**
 * Builds the document to store from validated form input.
 *
 * Split out as a pure function so the shape can be tested without a database
 * connection — the insert itself needs Mongo, but the mapping is where the
 * mistakes actually live.
 *
 * `receivedAt` is injected rather than read from the clock inside, so a test
 * can assert an exact value.
 */
export function buildEnquiryDocument(
  input: ContactInput,
  receivedAt: Date = new Date(),
): EnquiryDocument {
  return {
    name: input.name,
    email: input.email,
    // The schema allows '' for an omitted company; store null so the dashboard
    // can distinguish "not given" from "given as empty" without a falsy check.
    company: input.company ? input.company : null,
    message: input.message,
    createdAt: receivedAt,
    status: 'new',
    source: 'website',
  };
}
