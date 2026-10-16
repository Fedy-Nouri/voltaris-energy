import type { Feature, Stat } from '@/types';

/**
 * Home page content: the value proposition, the platform feature grid, the
 * deployment steps and the headline statistics.
 */

/** Three-up value proposition directly under the hero. */
export const valueProps: readonly Feature[] = [
  {
    title: 'Measure what the invoice hides',
    description:
      'A monthly bill is one number. Class 0.2S metering at one-second resolution tells you which circuit, which shift and which machine produced it.',
    icon: 'gauge',
  },
  {
    title: 'Works with the site you already have',
    description:
      'Modbus, BACnet, M-Bus, OPC UA and LoRaWAN, concurrently, through one gateway. No rip-and-replace and no inbound firewall rules.',
    icon: 'cable',
  },
  {
    title: 'Savings you can evidence',
    description:
      'Ten years of raw retention means a baseline from four years ago is still there when someone questions the number you reported.',
    icon: 'trendingDown',
  },
];

/** Platform capability grid. */
export const platformFeatures: readonly Feature[] = [
  {
    title: 'One-second resolution',
    description:
      'Ingest at one second and keep it raw for ten years. Averaging is a decision you make when reporting, not one forced on you at collection.',
    icon: 'activity',
  },
  {
    title: 'Per-asset anomaly detection',
    description:
      'Models trained on each meter’s own behaviour, retrained nightly. A single global threshold across mixed-vintage plant is either deaf or constantly crying wolf.',
    icon: 'barChart',
  },
  {
    title: 'Offline-tolerant by design',
    description:
      'Thirty days of store-and-forward on every gateway, two million records on every meter. A network outage delays your data; it never loses it.',
    icon: 'database',
  },
  {
    title: 'Compliance that generates itself',
    description:
      'ISO 50001, SECR, CSRD and GRI reports produced from measured data, not assembled by hand in a spreadsheet each year.',
    icon: 'shieldCheck',
  },
  {
    title: 'Alerting that reaches people',
    description:
      'Threshold, anomaly and asset-health alerts to email, SMS, Teams, Slack or your own endpoint via webhook, with per-site routing rules.',
    icon: 'bell',
  },
  {
    title: 'Open by default',
    description:
      'REST and GraphQL APIs cover everything the interface can do. Export raw interval data to CSV or Parquet whenever you like.',
    icon: 'workflow',
  },
  {
    title: 'Act, not just observe',
    description:
      'OpenADR-certified load control shedding non-critical circuits in under half a second, with local fallback and a physical override that always wins.',
    icon: 'toggleRight',
  },
  {
    title: 'Security that passes audit',
    description:
      'SOC 2 Type II, ISO 27001, TPM-backed device identity, signed firmware and mutual TLS. Data residency pinned to your region.',
    icon: 'lock',
  },
];

/** The deployment process, shown as a numbered sequence. */
export const deploymentSteps = [
  {
    title: 'Site survey',
    description:
      'A field engineer walks the site, catalogues what protocols are actually in use, and agrees the measurement points that will answer your question. Usually one day per site.',
    duration: '1–2 days',
    icon: 'workflow',
  },
  {
    title: 'Install & commission',
    description:
      'Split-core CTs clip onto live conductors, so no shutdown is needed in most panels. Gateways come pre-provisioned to your tenant and connect outbound only.',
    duration: '1–3 weeks',
    icon: 'plug',
  },
  {
    title: 'Baseline & calibrate',
    description:
      'Two to three weeks of measurement establishes the baseline every later saving is proven against, and surfaces the obvious anomalies immediately.',
    duration: '2–3 weeks',
    icon: 'gauge',
  },
  {
    title: 'Operate & report',
    description:
      'Alerting goes live, reports schedule themselves, and your team works from measured data. Quarterly reviews with our engineers are included for the first year.',
    duration: 'Ongoing',
    icon: 'lineChart',
  },
] as const;

/** Headline figures, animated as counters. */
export const stats: readonly Stat[] = [
  {
    value: 4800,
    suffix: '+',
    label: 'Sites under measurement',
    detail: 'Across 22 countries, from single units to 60-building campuses.',
  },
  {
    value: 1.9,
    decimals: 1,
    suffix: ' TWh',
    label: 'Measured annually',
    detail: 'Energy passing through Voltaris metering each year.',
  },
  {
    value: 17,
    suffix: '%',
    label: 'Median reduction',
    detail: 'Typical consumption drop in the first twelve months.',
  },
  {
    value: 99.95,
    decimals: 2,
    suffix: '%',
    label: 'Platform uptime',
    detail: 'Contractual monthly SLA, met for 31 consecutive months.',
  },
];

/** Single testimonial used on the home page. */
export const featuredTestimonial = {
  text: 'We had spent two years arguing about where the energy was going. It took three weeks of actual data to end the argument, and most of the first year’s saving came from fixing things that cost nothing to fix.',
  author: 'Rhian Protheroe',
  role: 'Group Engineering Director',
  company: 'Hartwell Foods',
  metric: { value: '23%', label: 'refrigeration energy saved' },
} as const;
