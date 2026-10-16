import type { NavItem } from '@/types';

/**
 * Single source of truth for brand, navigation and contact details.
 *
 * Imported by the header, the footer, the SEO helper, the JSON-LD builder and
 * the sitemap, so a change to the company name or a URL propagates everywhere
 * without a find-and-replace.
 */

export const site = {
  name: 'Voltaris',
  legalName: 'Voltaris Energy Systems B.V.',
  tagline: 'Every kilowatt, accounted for.',
  /** Used verbatim as the site-wide meta description fallback. */
  description:
    'Voltaris builds IoT energy monitoring hardware and analytics for industrial and commercial sites — revenue-grade metering, edge gateways and a platform that turns load data into verified savings.',
  founded: '2016',
  email: 'hello@voltaris.io',
  salesEmail: 'sales@voltaris.io',
  phone: '+31 10 258 4400',
  /** E.164 form, for `tel:` links. */
  phoneHref: '+31102584400',
} as const;

/**
 * Canonical origin for the deployment.
 *
 * Reads `NEXT_PUBLIC_SITE_URL` so canonical URLs, Open Graph image resolution
 * and the sitemap are correct per environment, and falls back to localhost so
 * a fresh clone works with no env file at all.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

/** Primary navigation. Contact is deliberately excluded — it is the header CTA. */
export const primaryNav: readonly NavItem[] = [
  { href: '/products', label: 'Products' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/about', label: 'About' },
] as const;

export const footerNav: readonly { heading: string; items: readonly NavItem[] }[] = [
  {
    heading: 'Products',
    items: [
      { href: '/products/vx-200-energy-meter', label: 'VX-200 energy meter' },
      { href: '/products/pulse-gateway-g4', label: 'Pulse Gateway G4' },
      { href: '/products/voltaris-insight', label: 'Voltaris Insight' },
      { href: '/products/submeter-s-16', label: 'Submeter S-16' },
      { href: '/products', label: 'All products' },
    ],
  },
  {
    heading: 'Solutions',
    items: [
      { href: '/solutions#manufacturing', label: 'Manufacturing' },
      { href: '/solutions#data-centres', label: 'Data centres' },
      { href: '/solutions#commercial-property', label: 'Commercial property' },
      { href: '/solutions#cold-chain', label: 'Cold chain & logistics' },
      { href: '/solutions', label: 'All industries' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { href: '/about', label: 'About us' },
      { href: '/case-studies', label: 'Case studies' },
      { href: '/contact', label: 'Contact' },
      { href: '/contact#faq', label: 'FAQ' },
    ],
  },
] as const;

export const offices = [
  {
    city: 'Rotterdam',
    country: 'Netherlands',
    role: 'Headquarters & engineering',
    lines: ['Scheepmakerspassage 14', '3011 VS Rotterdam'],
    timezone: 'CET',
  },
  {
    city: 'Manchester',
    country: 'United Kingdom',
    role: 'UK & Ireland operations',
    lines: ['Blackfriars House, Parsonage', 'Manchester M3 2JA'],
    timezone: 'GMT',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    role: 'APAC deployment',
    lines: ['71 Robinson Road, #14-01', 'Singapore 068895'],
    timezone: 'SGT',
  },
] as const;

/** Shown in the footer and on the About page. */
export const certifications = [
  'ISO 50001 aligned reporting',
  'ISO 27001 certified',
  'SOC 2 Type II',
  'MID Annex B+D metering',
  'IEC 62053-22 Class 0.2S',
  'GDPR compliant, EU data residency',
] as const;

/** Client logo strip on the home page. Wordmarks only — no image assets. */
export const clientLogos = [
  'NORDKRAFT',
  'Hartwell Foods',
  'Meridian DC',
  'ArcelorVast',
  'Thyssen Logistics',
  'Kessler Pharma',
  'Port of Antwerp',
  'Vattenhall Group',
] as const;
