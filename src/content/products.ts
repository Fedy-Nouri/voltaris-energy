import type { Product, ProductCategory } from '@/types';

/**
 * Product catalogue.
 *
 * This array drives the products index, every `/products/[slug]` route, the
 * per-product Open Graph image, the footer links and the sitemap. Adding a
 * seventh product here produces all of those automatically — no page needs
 * editing.
 */
export const products: readonly Product[] = [
  {
    slug: 'vx-200-energy-meter',
    name: 'VX-200 Energy Meter',
    model: 'VX-200',
    category: 'metering',
    icon: 'gauge',
    flag: 'Most deployed',
    tagline: 'Revenue-grade three-phase metering with per-cycle resolution.',
    summary:
      'A Class 0.2S three-phase meter for main incomers and large loads. Samples 128 points per cycle, so it captures the transients and harmonic distortion that interval meters average away.',
    description:
      'The VX-200 sits on your main incomer or on any load worth measuring properly. It is a Class 0.2S instrument built to IEC 62053-22 and MID Annex B+D, which means its readings stand up in a billing dispute or a regulatory audit, not just on an internal dashboard. Sampling at 128 points per cycle gives you harmonic content to the 63rd order and the ability to see voltage sags and inrush events that one-minute interval data quietly smooths out. Two million interval records are stored on the device itself, so a network outage costs you nothing.',
    capabilities: [
      'Class 0.2S accuracy, certified to IEC 62053-22 and MID Annex B+D',
      'Harmonic analysis to the 63rd order, per phase',
      'Voltage sag, swell and inrush event capture with 20 ms resolution',
      'Two million interval records stored on-device for outage resilience',
      'Modbus RTU and Modbus TCP out of the box, optional LTE uplink',
      'Field-upgradable firmware, signed and verified on boot',
    ],
    specs: [
      { label: 'Accuracy class', value: 'Class 0.2S (active energy)' },
      { label: 'Configuration', value: '3-phase 4-wire, 3-phase 3-wire, single phase' },
      { label: 'Voltage input', value: '57.7–480 V AC L-N, direct connect' },
      { label: 'Current input', value: '3 × 1 A / 5 A CT, or Rogowski coil' },
      { label: 'Sampling rate', value: '128 samples per cycle' },
      { label: 'Harmonics', value: 'THD and individual to 63rd order' },
      { label: 'On-device storage', value: '2,000,000 interval records' },
      {
        label: 'Communications',
        value: 'RS-485 Modbus RTU, 10/100 Modbus TCP, optional LTE Cat-1',
      },
      { label: 'Power supply', value: '85–264 V AC / 100–300 V DC' },
      { label: 'Operating range', value: '−25 °C to +70 °C, 5–95 % RH non-condensing' },
      { label: 'Mounting', value: '96 × 96 mm panel cut-out or 35 mm DIN rail' },
      { label: 'Enclosure', value: 'IP51 front, IP20 terminals' },
      { label: 'Warranty', value: '5 years' },
    ],
    metrics: [
      { value: '0.2S', label: 'Accuracy class' },
      { value: '128', label: 'Samples per cycle' },
      { value: '63rd', label: 'Harmonic order' },
    ],
    useCases: [
      'Main incomer metering where readings must be defensible against a supplier bill',
      'Tenant billing in multi-let industrial estates',
      'Power quality investigation on lines feeding sensitive process equipment',
      'Baseline measurement before and after an efficiency retrofit',
    ],
  },
  {
    slug: 'pulse-gateway-g4',
    name: 'Pulse Gateway G4',
    model: 'G4',
    category: 'connectivity',
    icon: 'cable',
    tagline: 'One edge gateway for every protocol already on your site.',
    summary:
      'Speaks Modbus, BACnet, M-Bus, OPC UA and LoRaWAN simultaneously, normalises everything to MQTT, and holds thirty days of data locally if the uplink drops.',
    description:
      'Most industrial sites are an archaeology of protocols: a BACnet BMS from 2009, Modbus drives, M-Bus heat meters, and whatever the last contractor installed. The G4 talks to all of it at once, normalises the readings into a single schema, and ships them out over MQTT. It handles up to 250 downstream devices and keeps thirty days of store-and-forward buffer on local eMMC, so a cellular outage or a firewall change delays your data rather than losing it. Security is not an afterthought: keys live in a TPM 2.0 module, firmware is signed, and the uplink is mutually authenticated TLS 1.3.',
    capabilities: [
      'Concurrent Modbus RTU/TCP, BACnet/IP, M-Bus, OPC UA and LoRaWAN',
      'Up to 250 downstream devices per gateway',
      '30-day store-and-forward buffer on local storage',
      'Hardware root of trust: TPM 2.0, signed firmware, verified boot',
      'Mutual TLS 1.3 to the platform, outbound-only — no inbound firewall rules',
      'Protocol mapping configurable from the platform, no site visit required',
    ],
    specs: [
      { label: 'Processor', value: 'Quad-core ARM Cortex-A53, 1.4 GHz' },
      { label: 'Memory', value: '2 GB LPDDR4, 16 GB eMMC' },
      { label: 'Fieldbus', value: '2 × RS-485, 1 × RS-232, 2 × dry contact pulse' },
      { label: 'Field protocols', value: 'Modbus RTU/TCP, BACnet/IP, M-Bus, OPC UA, DLMS' },
      { label: 'Wireless', value: 'LoRaWAN 868/915 MHz, BLE 5.2, Wi-Fi 802.11ac' },
      { label: 'Uplink', value: 'Gigabit Ethernet, dual-SIM LTE Cat-4 with carrier failover' },
      { label: 'Downstream devices', value: 'Up to 250 per gateway' },
      { label: 'Local buffer', value: '30 days at 1-minute resolution' },
      { label: 'Security', value: 'TPM 2.0, signed firmware, TLS 1.3 mutual auth' },
      { label: 'Power', value: '9–36 V DC or 802.3at PoE, 7 W typical' },
      { label: 'Operating range', value: '−20 °C to +60 °C' },
      { label: 'Mounting', value: '35 mm DIN rail, IP30' },
      { label: 'Warranty', value: '5 years' },
    ],
    metrics: [
      { value: '250', label: 'Devices per gateway' },
      { value: '30 d', label: 'Offline buffer' },
      { value: '5', label: 'Field protocols' },
    ],
    useCases: [
      'Consolidating a mixed estate of legacy meters onto one data pipeline',
      'Bringing a BACnet BMS and standalone Modbus meters into the same reports',
      'Remote or rented sites where running new network cable is not an option',
      'Deployments where IT will not open an inbound firewall rule',
    ],
  },
  {
    slug: 'voltaris-insight',
    name: 'Voltaris Insight',
    model: 'Insight',
    category: 'software',
    icon: 'lineChart',
    flag: 'Platform',
    tagline: 'The analytics layer that turns load data into verified savings.',
    summary:
      'Second-resolution data, ten-year retention, anomaly detection trained per site, and compliance reporting for ISO 50001, SECR and CSRD that exports without manual assembly.',
    description:
      'Insight is where the data becomes decisions. It ingests at one-second resolution and keeps raw data for ten years, so a baseline from four years ago is still available when someone questions a savings claim. Anomaly detection is trained per meter rather than on a global threshold, which is the only way to tell a genuine fault from a shift pattern that simply looks unusual. Reporting for ISO 50001, SECR, CSRD and GRI generates from the same measured data rather than from a spreadsheet someone maintains by hand, and everything in the interface is reachable through a REST or GraphQL API if you would rather build your own view.',
    capabilities: [
      'One-second ingest resolution with ten years of raw retention',
      'Per-meter anomaly detection, trained on each asset’s own behaviour',
      'Load forecasting and automatic tariff-aware cost attribution',
      'ISO 50001, SECR, CSRD and GRI reports generated from measured data',
      'REST and GraphQL APIs, plus outbound webhooks for every alert',
      'SAML 2.0 SSO and SCIM provisioning, with per-site role scoping',
    ],
    specs: [
      { label: 'Ingest resolution', value: '1 second' },
      { label: 'Raw data retention', value: '10 years' },
      { label: 'Anomaly detection', value: 'Per-meter models, retrained nightly' },
      { label: 'Reporting standards', value: 'ISO 50001, SECR, CSRD, GRI, GHG Protocol' },
      { label: 'APIs', value: 'REST, GraphQL, outbound webhooks' },
      { label: 'Authentication', value: 'SAML 2.0 SSO, SCIM, enforced MFA' },
      { label: 'Data residency', value: 'EU, UK, US or APAC region, pinned per tenant' },
      { label: 'Uptime SLA', value: '99.95 % monthly' },
      { label: 'Compliance', value: 'SOC 2 Type II, ISO 27001, GDPR' },
      { label: 'Export formats', value: 'CSV, Parquet, XLSX, PDF, scheduled or on demand' },
    ],
    metrics: [
      { value: '1 s', label: 'Ingest resolution' },
      { value: '10 yr', label: 'Raw retention' },
      { value: '99.95%', label: 'Uptime SLA' },
    ],
    useCases: [
      'Proving a retrofit delivered what the business case promised',
      'Producing audit-ready ISO 50001 and CSRD submissions without manual assembly',
      'Catching equipment faults from their power signature before they cause downtime',
      'Giving each site manager a scoped view of only their own assets',
    ],
  },
  {
    slug: 'submeter-s-16',
    name: 'Submeter S-16',
    model: 'S-16',
    category: 'metering',
    icon: 'circuitBoard',
    tagline: 'Sixteen circuits measured individually, in one DIN-rail unit.',
    summary:
      'Branch-circuit metering at the panel. Sixteen independent channels with split-core CTs, so you can attribute consumption to a machine rather than to a floor.',
    description:
      'Knowing a building used 400 MWh tells you nothing actionable. Knowing which sixteen circuits in a panel used it tells you where to go. The S-16 measures sixteen branch circuits independently with split-core CTs that clip on without breaking the conductor, so retrofitting a live panel does not mean a shutdown. Each channel reports energy, demand, current, voltage and power factor at one-second resolution. Up to thirty-two units daisy-chain on a single RS-485 run, which keeps the wiring in a large distribution room sane.',
    capabilities: [
      '16 independent measurement channels, Class 1 accuracy',
      'Split-core CTs from 20 A to 600 A, fitted without breaking conductors',
      'Per-channel energy, demand, current, voltage and power factor',
      'One-second resolution on every channel simultaneously',
      'Up to 32 units daisy-chained on one RS-485 segment',
      'Per-channel CT ratio and phase assignment set in software',
    ],
    specs: [
      { label: 'Channels', value: '16, independently configurable' },
      { label: 'Accuracy class', value: 'Class 1 per IEC 61557-12' },
      { label: 'CT range', value: '20 A to 600 A split-core' },
      { label: 'Measured values', value: 'kWh, kW, kVAr, A, V, PF, frequency' },
      { label: 'Resolution', value: '1 second, all channels concurrently' },
      { label: 'Voltage reference', value: '3-phase 4-wire, up to 415 V L-L' },
      { label: 'Communications', value: 'RS-485 Modbus RTU, up to 32 units per segment' },
      { label: 'Power supply', value: '100–240 V AC, 4 W' },
      { label: 'Operating range', value: '−10 °C to +60 °C' },
      { label: 'Mounting', value: '35 mm DIN rail, 9 modules wide' },
      { label: 'Warranty', value: '5 years' },
    ],
    metrics: [
      { value: '16', label: 'Channels per unit' },
      { value: '600 A', label: 'Max CT rating' },
      { value: '32', label: 'Units per segment' },
    ],
    useCases: [
      'Attributing consumption to individual machines rather than whole floors',
      'Retrofitting metering into a live panel without a planned shutdown',
      'Tenant or department-level cost allocation in shared facilities',
      'Finding standby and out-of-hours load that nobody has accounted for',
    ],
  },
  {
    slug: 'thermal-air-sensor-t3',
    name: 'Thermal & Air Sensor T3',
    model: 'T3',
    category: 'sensing',
    icon: 'thermometer',
    flag: 'New',
    tagline: 'The environmental context that explains your load curve.',
    summary:
      'Temperature, humidity, CO₂ and particulates on a five-year battery over LoRaWAN. Energy data without environmental context is half a story.',
    description:
      'A rise in HVAC consumption is only meaningful next to the conditions the plant was working against. The T3 supplies that context: temperature to ±0.3 °C, humidity, NDIR CO₂ and PM2.5, reported over LoRaWAN from a sensor that runs five years on a pair of lithium AAs. Because it needs no mains supply and no data cable, it goes where the measurement actually matters — inside a cold store, in a duct, on a warehouse wall forty metres from the nearest socket — and an IP65 housing means a wash-down does not end its life.',
    capabilities: [
      'Temperature ±0.3 °C, humidity ±2 % RH',
      'NDIR CO₂ sensing with automatic baseline correction',
      'PM2.5 and PM10 particulate measurement',
      'Five-year battery life on two lithium AA cells',
      'LoRaWAN uplink, 2 km urban range to a Pulse gateway',
      'IP65 housing rated for wash-down environments',
    ],
    specs: [
      { label: 'Temperature', value: '−40 °C to +85 °C, ±0.3 °C' },
      { label: 'Relative humidity', value: '0–100 % RH, ±2 %' },
      { label: 'CO₂', value: 'NDIR, 0–5000 ppm, ±(30 ppm + 3 % of reading)' },
      { label: 'Particulates', value: 'PM2.5 and PM10, 0–1000 µg/m³' },
      { label: 'Reporting interval', value: '1 to 60 minutes, configurable over the air' },
      { label: 'Radio', value: 'LoRaWAN 1.0.4 Class A, 868/915 MHz' },
      { label: 'Range', value: '2 km urban, 10 km line of sight' },
      { label: 'Battery life', value: '5 years at 15-minute reporting' },
      { label: 'Power', value: '2 × AA lithium, field replaceable' },
      { label: 'Enclosure', value: 'IP65, wall or duct mount' },
      { label: 'Warranty', value: '3 years' },
    ],
    metrics: [
      { value: '±0.3°C', label: 'Temperature accuracy' },
      { value: '5 yr', label: 'Battery life' },
      { value: 'IP65', label: 'Ingress rating' },
    ],
    useCases: [
      'Explaining HVAC load against the conditions the plant was fighting',
      'Cold chain compliance records tied to the same timeline as energy data',
      'Ventilation tuned to measured CO₂ rather than a fixed schedule',
      'Measurement points with no mains supply or data cable within reach',
    ],
  },
  {
    slug: 'load-control-relay-lc-8',
    name: 'Load Control Relay LC-8',
    model: 'LC-8',
    category: 'control',
    icon: 'toggleRight',
    tagline: 'Act on the data — shed load in under half a second.',
    summary:
      'Eight controllable outputs with OpenADR 2.0b demand response, local fallback schedules, and a physical override that always wins.',
    description:
      'Monitoring tells you what is happening; the LC-8 does something about it. Eight 16 A relay outputs let you shed non-critical load against a demand threshold, participate in OpenADR 2.0b demand response programmes, or stage equipment start-up to flatten an inrush peak. Control decisions execute in under 500 ms. Critically, schedules are held on the device, so a lost connection falls back to sensible local behaviour instead of leaving outputs in an unknown state — and a physical override switch on the front takes precedence over anything the platform asks for, because an operator standing in front of the panel should always win.',
    capabilities: [
      '8 relay outputs, 16 A resistive each, independently addressable',
      'OpenADR 2.0b certified for utility demand response programmes',
      'Sub-500 ms execution from threshold breach to contact change',
      'Local fallback schedules retained through connection loss',
      'Physical override switch that takes priority over remote commands',
      'Additional 2 × 0–10 V analogue outputs for modulating plant',
    ],
    specs: [
      { label: 'Relay outputs', value: '8 × SPDT, 16 A resistive at 250 V AC' },
      { label: 'Analogue outputs', value: '2 × 0–10 V, 12-bit' },
      { label: 'Digital inputs', value: '4 × dry contact, for status feedback' },
      { label: 'Demand response', value: 'OpenADR 2.0b VEN certified' },
      { label: 'Execution latency', value: '< 500 ms, threshold to contact' },
      { label: 'Local autonomy', value: 'Full schedule retention, indefinite' },
      { label: 'Override', value: 'Front-panel per-channel manual override and lockout' },
      { label: 'Standards', value: 'IEC 60947-4-1, IEC 61010-1' },
      { label: 'Power supply', value: '24 V DC, 3 W' },
      { label: 'Operating range', value: '−20 °C to +60 °C' },
      { label: 'Mounting', value: '35 mm DIN rail, 6 modules wide' },
      { label: 'Warranty', value: '5 years' },
    ],
    metrics: [
      { value: '8', label: 'Switched outputs' },
      { value: '<500 ms', label: 'Execution latency' },
      { value: '16 A', label: 'Per-channel rating' },
    ],
    useCases: [
      'Shedding non-critical load before a demand charge threshold is crossed',
      'Earning revenue from utility demand response programmes',
      'Staging plant start-up to flatten the morning inrush peak',
      'Automatic out-of-hours shutdown of equipment left running',
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Human-readable labels for the category filter. */
export const productCategories: Record<ProductCategory, string> = {
  metering: 'Metering',
  connectivity: 'Connectivity',
  sensing: 'Sensing',
  control: 'Control',
  software: 'Software',
};

/** Looks up a single product. Returns `undefined` so routes can call `notFound()`. */
export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Every slug, for `generateStaticParams` and the sitemap. */
export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/**
 * Two other products to show at the foot of a detail page. Prefers products
 * sharing a category, then fills from the rest of the catalogue so the section
 * is never short.
 */
export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProduct(slug);
  if (!current) return [];

  const sameCategory = products.filter(
    (product) => product.slug !== slug && product.category === current.category,
  );
  const others = products.filter(
    (product) => product.slug !== slug && product.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
