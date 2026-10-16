import type { CaseStudy } from '@/types';

/**
 * Customer deployments. Rendered as cards on `/case-studies` that expand into
 * a full detail panel via a shared-element transition, so there is no separate
 * route per study.
 */
export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'hartwell-foods',
    client: 'Hartwell Foods',
    sector: 'Food manufacturing',
    location: '14 sites, UK & Ireland',
    headline: 'Cut refrigeration spend 23% across fourteen sites in one year',
    summary:
      'A chilled-food producer with fourteen plants could see a group energy bill but not which site, let alone which compressor, was responsible for its growth.',
    challenge:
      'Hartwell’s energy cost had risen 31% in two years while output stayed flat. The group had half-hourly data from the supplier for each site and nothing below that. Engineering suspected refrigeration but could not prove it, and with fourteen sites competing for the same capital budget, nobody would release funds on a suspicion. An earlier attempt at a group dashboard had failed because each plant used a different BMS.',
    solution:
      'We installed a Pulse Gateway G4 at each site to bridge whatever protocol that plant already used, with VX-200 meters on the refrigeration incomers and S-16 submeters on individual compressor circuits. T3 sensors went inside each cold store so box temperature sat on the same timeline as power draw. Within three weeks Insight showed that four of the fourteen sites accounted for 61% of the group’s refrigeration energy, and that two compressors were running continuously because a defrost schedule had been left in a manual override since a 2019 service visit.',
    results: [
      { value: '23%', label: 'reduction in refrigeration energy' },
      { value: '£412k', label: 'annualised saving' },
      { value: '5.1 mo', label: 'payback on the full deployment' },
      { value: '61%', label: 'of load traced to four of fourteen sites' },
    ],
    quote: {
      text: 'We had spent two years arguing about where the energy was going. It took three weeks of actual data to end the argument, and most of the first year’s saving came from fixing things that cost nothing to fix.',
      author: 'Rhian Protheroe',
      role: 'Group Engineering Director, Hartwell Foods',
    },
    deployment: [
      { label: 'Sites', value: '14 across the UK and Ireland' },
      { label: 'Gateways', value: '14 × Pulse Gateway G4' },
      { label: 'Meters', value: '38 × VX-200, 96 × S-16 submeters' },
      { label: 'Sensors', value: '210 × T3 thermal and air sensors' },
      { label: 'Measurement points', value: '1,784' },
      { label: 'Time to first insight', value: '19 days from kick-off' },
    ],
  },
  {
    slug: 'meridian-dc',
    client: 'Meridian DC',
    sector: 'Colocation data centre',
    location: 'Amsterdam & Frankfurt',
    headline: 'Took PUE from 1.58 to 1.41 without touching the cooling plant',
    summary:
      'A colocation operator reporting PUE monthly discovered that its average was hiding three hours a day of serious cooling overshoot.',
    challenge:
      'Meridian reported PUE to its customers monthly as a single figure. That figure was acceptable, so nobody looked harder. But the facilities team suspected the monthly average was concealing short periods of significant inefficiency, and their existing metering — one meter on the UPS output and one on the main incomer — could not resolve anything finer than a daily total. Any capital proposal for new cooling plant needed evidence this metering could not produce.',
    solution:
      'S-16 submeters were fitted to every PDU branch circuit across both halls, with T3 sensors at rack inlet height in each cold aisle. At one-second resolution the problem was immediately visible: the chillers were short-cycling between 02:00 and 05:00 against a setpoint tuned for daytime load, burning roughly 340 kW for three hours a night to no benefit. A second finding was that 11% of racks were drawing less than a fifth of their provisioned power, meaning cooling was being delivered to largely empty cabinets.',
    results: [
      { value: '1.41', label: 'PUE, down from 1.58' },
      { value: '€268k', label: 'annual energy saving' },
      { value: '340 kW', label: 'overnight overshoot eliminated' },
      { value: '0', label: 'capital spend on new cooling plant' },
    ],
    quote: {
      text: 'Our PUE was fine on paper every single month. At one-second resolution it turned out we were wasting three hours a night. The fix was a setpoint schedule, not a chiller.',
      author: 'Joost Veenhuizen',
      role: 'Head of Critical Facilities, Meridian DC',
    },
    deployment: [
      { label: 'Halls', value: '2 (Amsterdam, Frankfurt)' },
      { label: 'Submeters', value: '144 × S-16, 2,304 metered circuits' },
      { label: 'Sensors', value: '96 × T3 at rack inlet height' },
      { label: 'Resolution', value: '1 second, all circuits' },
      { label: 'Integration', value: 'Existing BMS via Pulse Gateway G4' },
      { label: 'Deployment window', value: '6 weeks, no customer downtime' },
    ],
  },
  {
    slug: 'nordkraft',
    client: 'NORDKRAFT',
    sector: 'Metals processing',
    location: 'Kristiansand, Norway',
    headline: 'Earned €1.1m in grid flexibility revenue from existing equipment',
    summary:
      'An aluminium processor turned its own process flexibility into a revenue line by proving dispatch performance at settlement-grade accuracy.',
    challenge:
      'NORDKRAFT knew parts of its process could tolerate short interruptions and that the Norwegian system operator paid for exactly that flexibility. The obstacle was proof: participation required demonstrating response within seconds at an accuracy their existing metering could not evidence, and a failed dispatch carried penalties. Without defensible measurement the commercial team would not sign up to the obligation.',
    solution:
      'VX-200 meters at Class 0.2S were installed on each flexible load group, paired with LC-8 relays certified for OpenADR 2.0b. Dispatch instructions and the measured response are written to the same audit trail in Insight, so settlement is a report rather than a negotiation. The first full year delivered 312 dispatch events with 98.6% inside tolerance, and the two groups that fell outside it were traced to a single relay with a sticking contact, replaced under warranty.',
    results: [
      { value: '€1.1m', label: 'flexibility revenue, year one' },
      { value: '98.6%', label: 'dispatch events within tolerance' },
      { value: '312', label: 'dispatch events settled' },
      { value: '<500 ms', label: 'instruction to measured response' },
    ],
    quote: {
      text: 'The flexibility was always there. What we were missing was measurement good enough that the system operator would pay us for it without argument.',
      author: 'Ingrid Haugeland',
      role: 'Operations Manager, NORDKRAFT',
    },
    deployment: [
      { label: 'Flexible load groups', value: '9' },
      { label: 'Meters', value: '9 × VX-200 at Class 0.2S' },
      { label: 'Control', value: '6 × LC-8, OpenADR 2.0b VEN' },
      { label: 'Programme', value: 'Statnett mFRR' },
      { label: 'Settlement', value: 'Automated from measured data' },
      { label: 'Commissioning', value: '11 weeks including certification' },
    ],
  },
  {
    slug: 'kessler-pharma',
    client: 'Kessler Pharma',
    sector: 'Pharmaceutical manufacturing',
    location: 'Basel, Switzerland',
    headline: 'Caught a failing air handler nine days before it would have stopped a batch',
    summary:
      'Continuous power-signature monitoring on cleanroom plant turned an unplanned shutdown into a scheduled Tuesday-morning repair.',
    challenge:
      'Kessler runs GMP cleanrooms where an air handling failure does not merely cost energy — it can invalidate a production batch worth considerably more than the plant itself. Maintenance was calendar-based, which meant healthy units were serviced unnecessarily while a unit degrading between intervals went unnoticed until it failed.',
    solution:
      'S-16 submeters on each air handling unit feed per-asset anomaly models in Insight, trained on each unit’s own signature rather than on a shared threshold — essential here, because the units are of four different ages and vintages. In the eleventh month the model flagged AHU-07 drawing 8% more current at unchanged airflow, a classic bearing wear signature. Vibration analysis confirmed it, and the unit was rebuilt during a planned changeover nine days later.',
    results: [
      { value: '9 days', label: 'advance warning of imminent failure' },
      { value: '1', label: 'unplanned shutdown avoided' },
      { value: '8%', label: 'current deviation detected at constant airflow' },
      { value: '31%', label: 'fewer unnecessary maintenance interventions' },
    ],
    quote: {
      text: 'Per-asset models mattered more than we expected. Our handlers span four vintages — a single threshold across all of them would have been either deaf or screaming constantly.',
      author: 'Dr. Markus Brunner',
      role: 'Head of Facilities Engineering, Kessler Pharma',
    },
    deployment: [
      { label: 'Monitored assets', value: '22 air handling units' },
      { label: 'Submeters', value: '22 × S-16' },
      { label: 'Environmental', value: '64 × T3 sensors' },
      { label: 'Models', value: 'Per-asset, retrained nightly' },
      { label: 'Integration', value: 'Existing CMMS via webhook' },
      { label: 'Validation', value: 'GMP-compliant audit trail' },
    ],
  },
] as const;

/** Looks up a single case study. */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
