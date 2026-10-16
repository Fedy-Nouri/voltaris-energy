import type { IconKey } from '@/lib/icons';

/**
 * Shapes for everything under `src/content/`.
 *
 * Note that icons are stored as a string `IconKey` rather than as a component
 * reference. Content objects therefore stay fully serialisable, which matters
 * because they are passed from Server Components into Client Components — a
 * function reference cannot cross that boundary, a string can. It also means
 * this content layer could be swapped for a CMS response without touching a
 * single component.
 */

/** One row of a specification table. */
export type Spec = {
  label: string;
  value: string;
};

export type ProductCategory = 'metering' | 'connectivity' | 'sensing' | 'control' | 'software';

export type Product = {
  slug: string;
  name: string;
  /** Short model designation, e.g. "VX-200". */
  model: string;
  category: ProductCategory;
  icon: IconKey;
  /** One line for cards and meta descriptions. */
  tagline: string;
  /** Two or three sentences for the product card. */
  summary: string;
  /** Longer copy for the detail page. */
  description: string;
  /** Headline capabilities, shown as a checked list. */
  capabilities: readonly string[];
  specs: readonly Spec[];
  /** Typical deployments, shown on the detail page. */
  useCases: readonly string[];
  /** Three figures pulled out as stat tiles on the detail page. */
  metrics: readonly { label: string; value: string }[];
  /** Optional chip on the card, e.g. "New" or "Most deployed". */
  flag?: string;
};

export type Solution = {
  slug: string;
  industry: string;
  icon: IconKey;
  challenge: string;
  approach: string;
  /** Outcome figures, e.g. "18%" / "average energy cost reduction". */
  outcomes: readonly { value: string; label: string }[];
  /** Slugs of the products typically deployed here. */
  products: readonly string[];
};

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  location: string;
  /** Headline result, e.g. "Cut HVAC spend by 23% across 14 sites". */
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  results: readonly { value: string; label: string }[];
  quote: { text: string; author: string; role: string };
  deployment: readonly Spec[];
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /** Two-letter monogram used in place of a photograph. */
  initials: string;
  focus: string;
};

export type Feature = {
  title: string;
  description: string;
  icon: IconKey;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Stat = {
  /** Numeric part, animated by AnimatedCounter. */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export type NavItem = {
  href: string;
  label: string;
};
