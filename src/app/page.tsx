import { FeatureGrid } from '@/components/home/FeatureGrid';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProductTeaser } from '@/components/home/ProductTeaser';
import { StatsBand } from '@/components/home/StatsBand';
import { Testimonial } from '@/components/home/Testimonial';
import { ValueProps } from '@/components/home/ValueProps';
import { CtaBand } from '@/components/ui/CtaBand';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'IoT energy monitoring for industrial & commercial sites',
  description:
    'Voltaris builds revenue-grade energy metering, edge gateways and analytics for industrial and commercial sites. Measure to the circuit, prove the saving, report without the spreadsheet.',
  path: '/',
});

/**
 * Home page.
 *
 * A Server Component that composes sections in a deliberate order: the hero
 * demonstrates the product, the value proposition explains why it matters, then
 * proof (stats, products, process, a customer) before the closing ask. Only the
 * sections with genuine interactivity — the hero's parallax and live panel, the
 * scroll-linked process rail — ship JavaScript.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <StatsBand />
      <FeatureGrid />
      <ProductTeaser />
      <HowItWorks />
      <Testimonial />
      <CtaBand />
    </>
  );
}
