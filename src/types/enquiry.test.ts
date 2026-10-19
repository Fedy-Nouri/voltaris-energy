import { describe, expect, it } from 'vitest';
import { buildEnquiryDocument } from '@/types/enquiry';
import { contactSchema } from '@/lib/validation';

/**
 * Tests for the stored document shape.
 *
 * The insert itself needs a live database, but the mapping from validated form
 * input to stored document is pure — and it is where the mistakes actually
 * live, because it decides what gets persisted about a person. Testing it here
 * means CI covers it without needing MongoDB.
 */

const validInput = {
  name: 'Jane Okonkwo',
  email: 'jane@hartwellfoods.example',
  company: 'Hartwell Foods',
  message: 'We run four chilled distribution sites and need to understand our refrigeration load.',
  website: '',
};

/** Runs input through the real schema first, as the action does. */
function parse(overrides: Partial<typeof validInput> = {}) {
  const result = contactSchema.safeParse({ ...validInput, ...overrides });
  if (!result.success) throw new Error('fixture should be valid');
  return result.data;
}

describe('buildEnquiryDocument', () => {
  const receivedAt = new Date('2026-03-04T09:30:00.000Z');

  it('carries the validated fields through unchanged', () => {
    const doc = buildEnquiryDocument(parse(), receivedAt);
    expect(doc.name).toBe('Jane Okonkwo');
    expect(doc.email).toBe('jane@hartwellfoods.example');
    expect(doc.company).toBe('Hartwell Foods');
    expect(doc.message).toContain('chilled distribution sites');
  });

  it('marks every new enquiry as unread for the dashboard', () => {
    expect(buildEnquiryDocument(parse(), receivedAt).status).toBe('new');
  });

  it('records the time it was received', () => {
    expect(buildEnquiryDocument(parse(), receivedAt).createdAt).toEqual(receivedAt);
  });

  it('tags the channel so a second one stays distinguishable later', () => {
    expect(buildEnquiryDocument(parse(), receivedAt).source).toBe('website');
  });

  it('normalises an omitted company to null rather than an empty string', () => {
    // The dashboard can then tell "not given" from "given as empty" without
    // relying on a falsy check.
    expect(buildEnquiryDocument(parse({ company: '' }), receivedAt).company).toBeNull();
  });

  it('never persists an IP address or user agent', () => {
    // Guards the privacy decision: the rate limiter uses an IP transiently and
    // discards it, and the site's FAQ claims GDPR compliance. If someone adds
    // tracking fields later, this test should make them think twice.
    const doc = buildEnquiryDocument(parse(), receivedAt);
    expect(Object.keys(doc).sort()).toEqual(
      ['company', 'createdAt', 'email', 'message', 'name', 'source', 'status'].sort(),
    );
  });

  it('defaults the timestamp to now when one is not supplied', () => {
    const before = Date.now();
    const doc = buildEnquiryDocument(parse());
    expect(doc.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(doc.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
