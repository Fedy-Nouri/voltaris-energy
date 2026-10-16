import type { Faq } from '@/types';

/**
 * Contact page FAQ. Also emitted as FAQPage JSON-LD, which is why each answer
 * is written as a complete, self-contained response rather than a fragment
 * that only makes sense next to the question.
 */
export const faqs: readonly Faq[] = [
  {
    question: 'How long does a typical deployment take?',
    answer:
      'A single site is usually surveyed in one to two days, installed within one to three weeks, and producing a usable baseline two to three weeks after that. Multi-site rollouts run in parallel, so a fourteen-site programme typically reaches first insight in under a month rather than fourteen times longer.',
  },
  {
    question: 'Do we need to shut down to install metering?',
    answer:
      'In most cases, no. Our submeters use split-core current transformers that clip around a live conductor without breaking it, so a panel can usually be retrofitted while energised by a qualified engineer. Direct-connect metering on a main incomer does need a planned outage, which we schedule around your operations.',
  },
  {
    question: 'Will this work with the metering and BMS we already own?',
    answer:
      'Usually yes. The Pulse Gateway G4 speaks Modbus RTU and TCP, BACnet/IP, M-Bus, OPC UA, DLMS and LoRaWAN concurrently, so existing meters and building management systems can feed the same dataset as new Voltaris hardware. We confirm compatibility during the site survey before anything is ordered.',
  },
  {
    question: 'What does your IT department need to open up?',
    answer:
      'Nothing inbound. Gateways establish an outbound, mutually authenticated TLS 1.3 connection on port 443 and accept no inbound connections at all. Device identity is held in a TPM 2.0 module and firmware is signed and verified on boot. We can provide our SOC 2 Type II report and ISO 27001 certificate for your supplier review.',
  },
  {
    question: 'Where is our data stored, and can we get it back out?',
    answer:
      'Data residency is pinned per tenant to the EU, UK, US or APAC region of your choice and never leaves it. Everything is exportable at any time in CSV or Parquet, including raw interval data, through the interface or the API. There is no export fee and no commercial reason for us to make leaving difficult.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'Hardware is bought outright with a five-year warranty on metering and control products. The Insight platform is licensed annually per measurement point, on a band that decreases with volume. Quarterly engineering reviews are included for the first year of any deployment. We will quote both parts explicitly after the site survey, with no per-query or per-report charges.',
  },
  {
    question: 'What happens if a site loses connectivity?',
    answer:
      'Measurement continues. Every gateway holds thirty days of store-and-forward buffer and every VX-200 stores two million interval records locally, so data backfills automatically once the link returns. Load control relays fall back to schedules held on the device, and their physical override switch takes priority over anything the platform might ask for.',
  },
  {
    question: 'Can you support a multi-country rollout?',
    answer:
      'Yes. We currently measure across twenty-two countries from offices in Rotterdam, Manchester and Singapore. Hardware is certified to IEC standards with MID Annex B+D approval for billing use in the EU, and our deployment team handles local electrical contractor coordination as part of the programme.',
  },
];
