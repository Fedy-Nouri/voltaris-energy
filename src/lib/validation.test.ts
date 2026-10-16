import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/validation';

/**
 * Tests for the contact schema.
 *
 * This schema is worth testing precisely because it is shared: the same object
 * guards the browser form and the Server Action, so a mistake here is a
 * mistake in both places at once. These cases pin down the boundaries rather
 * than restating the rules.
 */

const valid = {
  name: 'Jane Okonkwo',
  email: 'jane@hartwellfoods.example',
  company: 'Hartwell Foods',
  message: 'We run four chilled distribution sites and need to understand our refrigeration load.',
  website: '',
};

describe('contactSchema', () => {
  it('accepts a complete, valid submission', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('treats company as optional, whether omitted or empty', () => {
    const withoutCompany = { name: valid.name, email: valid.email, message: valid.message };
    expect(contactSchema.safeParse(withoutCompany).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, company: '' }).success).toBe(true);
  });

  it('trims surrounding whitespace before validating and storing', () => {
    const result = contactSchema.safeParse({ ...valid, name: '   Jane Okonkwo   ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Jane Okonkwo');
  });

  it('rejects a name shorter than two characters', () => {
    expect(contactSchema.safeParse({ ...valid, name: 'J' }).success).toBe(false);
  });

  it('rejects whitespace-only input that would otherwise look filled in', () => {
    // Without the trim this would pass the min-length check on spaces alone.
    expect(contactSchema.safeParse({ ...valid, name: '      ' }).success).toBe(false);
  });

  it('rejects a malformed email address', () => {
    for (const email of ['not-an-email', 'jane@', '@example.com', 'jane @example.com']) {
      expect(contactSchema.safeParse({ ...valid, email }).success).toBe(false);
    }
  });

  it('rejects a message under the twenty character minimum', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'too short' }).success).toBe(false);
  });

  it('accepts a message exactly at the minimum length', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(20) }).success).toBe(true);
  });

  it('rejects a message over the two thousand character maximum', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('rejects a submission with the honeypot filled in', () => {
    // A real visitor cannot reach this field, so any value means a bot.
    expect(contactSchema.safeParse({ ...valid, website: 'http://spam.example' }).success).toBe(
      false,
    );
  });

  it('reports an error for every invalid field at once, not just the first', () => {
    const result = contactSchema.safeParse({ name: 'J', email: 'nope', message: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = new Set(result.error.issues.map((issue) => issue.path[0]));
      expect(fields).toEqual(new Set(['name', 'email', 'message']));
    }
  });
});
