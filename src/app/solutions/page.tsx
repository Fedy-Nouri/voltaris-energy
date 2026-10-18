import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { StaggerItem } from '@/components/motion/StaggerItem';
import { Container } from '@/components/ui/Container';
import { CtaBand } from '@/components/ui/CtaBand';
import { getProduct } from '@/content/products';
import { solutions } from '@/content/solutions';
import { Icon } from '@/lib/icons';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import type { Solution } from '@/types';

export const metadata = buildMetadata({
  title: 'Solutions by industry',
  description:
    'How Voltaris energy monitoring is deployed in manufacturing, data centres, commercial property, cold chain, campuses and grid services — with the outcomes each typically delivers.',
  path: '/solutions',
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/solutions' },
        ])}
      />

      <PageHero
        eyebrow="By industry"
        title="The same instruments. Very different questions."
        description="A data centre and a cold store both want to spend less on energy, but what they need to measure — and what counts as an answer — have almost nothing in common. These are the six patterns we deploy most."
        stats={[
          { value: '22', label: 'Countries with live deployments' },
          { value: '17%', label: 'Median first-year consumption reduction' },
          { value: '4.3 mo', label: 'Median payback across all sectors' },
        ]}
      />

      {/* ---- Index ---- */}
      <section className="border-ink-100 border-b py-10">
        <Container width="wide">
          <StaggerGroup as="ul" stagger={0.05} className="flex flex-wrap gap-2">
            {solutions.map((solution) => (
              <StaggerItem as="li" key={solution.slug}>
                <a
                  href={`#${solution.slug}`}
                  className="text-ink-600 ring-ink-200 hover:border-ink-300 hover:bg-ink-25 hover:text-ink-900 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors"
                >
                  <Icon name={solution.icon} className="text-volt-700 size-4" />
                  {solution.industry}
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* ---- Each industry ---- */}
      {solutions.map((solution, index) => (
        <SolutionSection key={solution.slug} solution={solution} index={index} />
      ))}

      <CtaBand
        eyebrow="Your industry"
        title="Not on the list? The question is usually still answerable."
        description="These six are simply where we have the deepest pattern library. The measurement principles transfer — tell us what you need to know and we will tell you honestly whether we can prove it."
      />
    </>
  );
}

/**
 * One industry block: challenge, approach, outcome figures and the products
 * typically deployed.
 *
 * Alternating background colour gives the long page a rhythm without needing a
 * divider between each section.
 */
function SolutionSection({ solution, index }: { solution: Solution; index: number }) {
  const isAlternate = index % 2 === 1;

  return (
    <section
      id={solution.slug}
      // No `scroll-mt` here: `scroll-padding-top: 6rem` on <html> already holds
      // anchor targets clear of the fixed header. Setting both made them stack,
      // landing the heading 192px down instead of 96px.
      className={`section-y ${isAlternate ? 'bg-ink-25 border-ink-100 border-y' : ''}`}
    >
      <Container width="wide">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <span className="bg-ink-900 text-volt-400 flex size-12 items-center justify-center rounded-xl">
              <Icon name={solution.icon} className="size-6" />
            </span>

            <h2 className="text-display-sm text-ink-900 font-semibold">{solution.industry}</h2>

            <div>
              <h3 className="text-eyebrow text-volt-700 mb-2 font-mono uppercase">The challenge</h3>
              <p className="text-ink-600 text-[0.9375rem] leading-relaxed">{solution.challenge}</p>
            </div>

            <div>
              <h3 className="text-eyebrow text-volt-700 mb-2 font-mono uppercase">Our approach</h3>
              <p className="text-ink-600 text-[0.9375rem] leading-relaxed">{solution.approach}</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {/* Outcome figures */}
            <Reveal from="right" delay={0.1}>
              <dl className="rounded-panel ring-ink-100 shadow-panel grid gap-6 bg-white p-6 ring-1 sm:grid-cols-3 sm:p-7">
                {solution.outcomes.map((outcome) => (
                  <div key={outcome.label} className="flex flex-col">
                    <dd className="text-volt-700 tabular order-1 font-mono text-2xl font-semibold">
                      {outcome.value}
                    </dd>
                    <dt className="text-ink-500 order-2 mt-1.5 text-[0.8125rem] leading-snug">
                      {outcome.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Products typically deployed */}
            <Reveal from="right" delay={0.18}>
              <div className="rounded-panel ring-ink-100 bg-white p-6 ring-1 sm:p-7">
                <h3 className="text-eyebrow text-ink-400 mb-4 font-mono uppercase">
                  Typically deployed
                </h3>
                <ul className="flex flex-col gap-2">
                  {solution.products.map((productSlug) => {
                    const product = getProduct(productSlug);
                    if (!product) return null;

                    return (
                      <li key={productSlug}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="group hover:bg-ink-25 -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
                        >
                          <span className="bg-ink-900 text-volt-400 flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <Icon name={product.icon} className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-ink-900 group-hover:text-volt-700 block text-sm font-medium transition-colors">
                              {product.name}
                            </span>
                            <span className="text-ink-400 block truncate text-xs">
                              {product.tagline}
                            </span>
                          </span>
                          <ArrowUpRight
                            className="text-ink-300 group-hover:text-volt-600 size-4 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
