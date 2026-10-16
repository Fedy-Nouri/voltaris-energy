import type { Feature, Milestone, TeamMember } from '@/types';

/**
 * Leadership team. Monograms are used instead of photographs so the About page
 * ships no image assets and stays visually consistent.
 */
export const team: readonly TeamMember[] = [
  {
    name: 'Sanne de Wit',
    role: 'Co-founder & CEO',
    initials: 'SW',
    focus: 'Commercial strategy',
    bio: 'Spent eleven years in industrial energy procurement before concluding the problem was not price, it was that nobody could see what they were buying. Started Voltaris to fix the measurement first.',
  },
  {
    name: 'Tobias Lindqvist',
    role: 'Co-founder & CTO',
    initials: 'TL',
    focus: 'Hardware & firmware',
    bio: 'Power electronics engineer, previously designing protection relays for substation equipment. Responsible for the decision that every Voltaris device must keep working with its uplink severed.',
  },
  {
    name: 'Amara Okonjo',
    role: 'VP Engineering',
    initials: 'AO',
    focus: 'Platform & data',
    bio: 'Built time-series infrastructure for grid operators before joining. Owns the ingest path that keeps one-second resolution affordable at ten-year retention.',
  },
  {
    name: 'Davide Ferrari',
    role: 'Head of Deployment',
    initials: 'DF',
    focus: 'Field engineering',
    bio: 'Twenty years as a commissioning engineer across European industrial sites. Has met every protocol on this website in its natural habitat, usually badly documented.',
  },
  {
    name: 'Priya Raghunathan',
    role: 'Head of Data Science',
    initials: 'PR',
    focus: 'Anomaly detection',
    bio: 'Works on the per-asset models behind Insight. Argues, with evidence, that a global threshold across mixed-vintage plant is worse than no alerting at all.',
  },
  {
    name: 'Marek Nowakowski',
    role: 'Head of Compliance',
    initials: 'MN',
    focus: 'Standards & certification',
    bio: 'Takes Voltaris hardware through MID, IEC and OpenADR certification, and translates CSRD and SECR obligations into reports the platform can actually generate.',
  },
] as const;

/** Company history, rendered as a scroll-linked timeline. */
export const milestones: readonly Milestone[] = [
  {
    year: '2016',
    title: 'Founded in Rotterdam',
    description:
      'Sanne and Tobias start Voltaris after a procurement project stalls on the realisation that the client had no measurement below a monthly invoice.',
  },
  {
    year: '2018',
    title: 'VX-200 achieves MID certification',
    description:
      'The first Voltaris meter clears MID Annex B+D and IEC 62053-22 Class 0.2S, making its readings usable for billing rather than indication only.',
  },
  {
    year: '2020',
    title: 'Insight platform launches',
    description:
      'The analytics layer ships with one-second ingest and per-meter anomaly models, moving the company from hardware supplier to measurement partner.',
  },
  {
    year: '2022',
    title: 'ISO 27001 and SOC 2 Type II',
    description:
      'Security certification completed, opening deployments with regulated manufacturers and colocation operators who audit their suppliers.',
  },
  {
    year: '2024',
    title: 'OpenADR certification and grid services',
    description:
      'The LC-8 is certified as an OpenADR 2.0b VEN, letting customers monetise process flexibility with settlement-grade evidence.',
  },
  {
    year: '2026',
    title: '4,800 sites under measurement',
    description:
      'Voltaris hardware now measures across twenty-two countries, with the Singapore office opening to support APAC deployments directly.',
  },
] as const;

/** Operating principles, shown on the About page. */
export const values: readonly Feature[] = [
  {
    title: 'Measure before you advise',
    description:
      'We do not propose a saving we cannot evidence. Every recommendation in Insight traces back to a measurement with a timestamp and an accuracy class.',
    icon: 'gauge',
  },
  {
    title: 'The device keeps working',
    description:
      'Every product functions with its uplink severed. Connectivity is how you see the data, never a precondition for collecting it or for safe local behaviour.',
    icon: 'shieldCheck',
  },
  {
    title: 'Your data stays yours',
    description:
      'Full export in open formats, any time, including raw interval data. There is no commercial advantage in making it difficult to leave, and plenty of reasons not to.',
    icon: 'lock',
  },
  {
    title: 'Accuracy is not negotiable',
    description:
      'Certified to the standard that matters for the job — Class 0.2S where a reading has to survive a billing dispute. Approximate data produces confident wrong decisions.',
    icon: 'circuitBoard',
  },
] as const;
