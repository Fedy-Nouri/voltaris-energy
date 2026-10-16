import type { Solution } from '@/types';

/**
 * Industries served. Drives the `/solutions` page and its in-page anchors,
 * which the footer links to directly.
 */
export const solutions: readonly Solution[] = [
  {
    slug: 'manufacturing',
    industry: 'Manufacturing',
    icon: 'factory',
    challenge:
      'Energy is a top-three cost line, but it arrives as one monthly invoice with no way to connect it to a shift, a line or a product.',
    approach:
      'Meter at the main incomer and submeter each production line, then attribute consumption per unit produced. Once energy has a denominator, a process engineer can act on it the same way they act on scrap rate.',
    outcomes: [
      { value: '11–19%', label: 'typical reduction in energy per unit produced' },
      { value: '4.3 mo', label: 'median payback on hardware and installation' },
      { value: '94%', label: 'of consumption attributed to a named asset' },
    ],
    products: ['vx-200-energy-meter', 'submeter-s-16', 'voltaris-insight'],
  },
  {
    slug: 'data-centres',
    industry: 'Data centres',
    icon: 'server',
    challenge:
      'PUE is reported monthly as a single figure, which hides the handful of hours where cooling overshoots and the racks where power draw has quietly drifted from the design assumption.',
    approach:
      'Branch-circuit metering at every PDU plus environmental sensing in the cold aisle, resolved to one second. PUE becomes a live curve rather than a retrospective average, and cooling can be tuned against measured inlet conditions.',
    outcomes: [
      { value: '0.09', label: 'average PUE improvement within two quarters' },
      { value: '1 s', label: 'resolution on per-rack power draw' },
      { value: '100%', label: 'of PDU circuits individually metered' },
    ],
    products: ['submeter-s-16', 'thermal-air-sensor-t3', 'voltaris-insight'],
  },
  {
    slug: 'commercial-property',
    industry: 'Commercial property',
    icon: 'building',
    challenge:
      'Landlords recharge energy by floor area because that is the only data they have, which means efficient tenants subsidise wasteful ones and nobody can prove a service charge is fair.',
    approach:
      'Per-tenant submetering with revenue-grade accuracy, feeding automated recharge statements. Each tenant sees their own consumption, and the landlord has defensible figures when a service charge is challenged.',
    outcomes: [
      { value: '100%', label: 'of recharge based on measured consumption' },
      { value: '22%', label: 'drop in out-of-hours base load once visible' },
      { value: '3 wks', label: 'from install to first automated statement' },
    ],
    products: ['submeter-s-16', 'vx-200-energy-meter', 'voltaris-insight'],
  },
  {
    slug: 'cold-chain',
    industry: 'Cold chain & logistics',
    icon: 'snowflake',
    challenge:
      'Refrigeration is the dominant load and also the biggest compliance risk, yet temperature records and energy records usually live in two systems that never share a timeline.',
    approach:
      'Environmental sensing inside each store alongside circuit-level metering of the refrigeration plant, on one timeline. A failing compressor shows up in its power signature days before the box temperature drifts.',
    outcomes: [
      { value: '6–9 d', label: 'earlier warning of compressor degradation' },
      { value: '17%', label: 'refrigeration energy saved through defrost tuning' },
      { value: '0', label: 'temperature excursions unaccounted for in audit' },
    ],
    products: ['thermal-air-sensor-t3', 'submeter-s-16', 'load-control-relay-lc-8'],
  },
  {
    slug: 'campuses',
    industry: 'Universities & campuses',
    icon: 'graduationCap',
    challenge:
      'Dozens of buildings of wildly different vintages, a small estates team, and a reporting obligation that expects a single consistent dataset across all of it.',
    approach:
      'One gateway per building bridges whatever protocol that building already speaks, so a 1970s BMS and a new-build meter land in the same dataset. Reporting is generated from measured data instead of assembled by hand each year.',
    outcomes: [
      { value: '60+', label: 'buildings on one dataset, mixed protocols' },
      { value: '14%', label: 'reduction in campus-wide consumption' },
      { value: '2 days', label: 'to produce annual statutory reporting' },
    ],
    products: ['pulse-gateway-g4', 'vx-200-energy-meter', 'voltaris-insight'],
  },
  {
    slug: 'utilities',
    industry: 'Utilities & grid services',
    icon: 'zap',
    challenge:
      'Flexibility is worth real money, but monetising it requires proving dispatch performance at a resolution the incumbent metering simply cannot provide.',
    approach:
      'Revenue-grade metering paired with OpenADR-certified load control, so a dispatch instruction and its measured response sit in the same audit trail. Settlement stops being an argument.',
    outcomes: [
      { value: '<500 ms', label: 'dispatch to measured response' },
      { value: '0.2S', label: 'settlement-grade metering accuracy' },
      { value: '98.6%', label: 'dispatch events delivered within tolerance' },
    ],
    products: ['vx-200-energy-meter', 'load-control-relay-lc-8', 'voltaris-insight'],
  },
] as const;

/** Looks up a solution by its anchor slug. */
export function getSolution(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}
