import { JsonLd } from '@/components/JsonLd';
import { CaseStudyGrid } from '@/components/case-studies/CaseStudyGrid';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { CtaBand } from '@/components/ui/CtaBand';
import { caseStudies } from '@/content/case-studies';
import { breadcrumbSchema, caseStudyListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Case studies',
  description:
    'Four Voltaris deployments in detail — a food manufacturer cutting refrigeration spend 23%, a colocation operator improving PUE by 0.17, an aluminium processor earning €1.1m in grid flexibility, and a pharmaceutical plant catching a failure nine days early.',
  path: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd schema={caseStudyListSchema(caseStudies)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Case studies', path: '/case-studies' },
        ])}
      />

      <PageHero
        eyebrow="Proof"
        title="Four deployments, with the numbers attached."
        description="Every figure below came out of the same metering the customer still runs today. Where a saving was achieved by changing a setting rather than buying equipment, we have said so — that is usually where the first year's return comes from."
        stats={[
          { value: '€1.8m', label: 'Combined annual saving across these four' },
          { value: '4,190', label: 'Measurement points deployed' },
          { value: '0', label: 'Of these results came from estimates' },
        ]}
      />

      <section className="section-y" aria-labelledby="studies-heading">
        <Container width="wide">
          {/* Keeps the outline continuous between the page h1 and each card's h3. */}
          <h2 id="studies-heading" className="sr-only">
            Customer deployments
          </h2>
          <CaseStudyGrid studies={caseStudies} />
        </Container>
      </section>

      <CtaBand
        eyebrow="Your site"
        title="We will show you the equivalent figures for your own operation."
        description="A site survey produces a measurement plan and a costed proposal with an expected payback period. If we do not think the numbers work, we will say so."
      />
    </>
  );
}
