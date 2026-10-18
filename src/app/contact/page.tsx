import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ContactForm } from '@/components/contact/ContactForm';
import { FaqList } from '@/components/contact/FaqList';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { StaggerItem } from '@/components/motion/StaggerItem';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faqs } from '@/content/faqs';
import { offices, site } from '@/content/site';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Book a site survey or ask us a question. Voltaris replies within one working day, from offices in Rotterdam, Manchester and Singapore.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={faqSchema(faqs)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <PageHero
        eyebrow="Get in touch"
        title="Tell us what you need to find out."
        description="Most conversations start with a question somebody cannot currently answer — which shift is costing more, why the bill moved, whether a retrofit actually worked. Describe yours and we will tell you honestly whether we can measure it."
      />

      {/* ---- Form & details ---- */}
      <section className="section-y">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
            {/* Form */}
            <Reveal>
              <div className="rounded-panel ring-ink-100 shadow-panel bg-white p-6 ring-1 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-ink-900 text-xl font-semibold">Book a site survey</h2>
                  <p className="text-ink-500 mt-1.5 text-sm">
                    No obligation and no pilot fee. A survey takes about a day per site.
                  </p>
                </div>

                <ContactForm />
              </div>
            </Reveal>

            {/* Direct contact details */}
            <Reveal from="right" delay={0.1} className="flex flex-col gap-8">
              <div>
                <h2 className="text-ink-900 mb-4 text-xl font-semibold">Or reach us directly</h2>

                <ul className="flex flex-col gap-3">
                  <ContactMethod
                    icon={<Mail className="size-4" aria-hidden />}
                    label="Email"
                    value={site.email}
                    href={`mailto:${site.email}`}
                  />
                  <ContactMethod
                    icon={<Phone className="size-4" aria-hidden />}
                    label="Phone"
                    value={site.phone}
                    href={`tel:${site.phoneHref}`}
                  />
                  <ContactMethod
                    icon={<Clock className="size-4" aria-hidden />}
                    label="Response time"
                    value="Within one working day"
                  />
                </ul>
              </div>

              <div>
                <h2 className="text-ink-900 mb-4 text-xl font-semibold">Offices</h2>

                <StaggerGroup as="ul" stagger={0.08} className="flex flex-col gap-3">
                  {offices.map((office) => (
                    <StaggerItem
                      as="li"
                      key={office.city}
                      className="rounded-panel ring-ink-100 flex items-start gap-3 bg-white p-4 ring-1"
                    >
                      <span className="bg-ink-900 text-volt-400 flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <MapPin className="size-4" aria-hidden />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-ink-900 text-[0.9375rem] font-semibold">
                            {office.city}
                          </h3>
                          <Badge tone="outline">{office.timezone}</Badge>
                        </div>
                        <p className="text-ink-500 mt-0.5 text-[0.8125rem]">{office.role}</p>
                        <address className="text-ink-400 mt-1.5 text-[0.8125rem] not-italic">
                          {office.lines.join(', ')}, {office.country}
                        </address>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---- FAQ ---- */}
      {/* No `scroll-mt`: `scroll-padding-top` on <html> already offsets anchor
          targets, and setting both doubles the gap. */}
      <section id="faq" className="bg-ink-25 border-ink-100 section-y-lg border-y">
        <Container>
          <SectionHeading
            eyebrow="Before you ask"
            title="Questions we get on nearly every first call."
            description="If yours is not here, put it in the form above — we will answer it directly rather than send you a brochure."
            className="mb-10"
          />

          <FaqList faqs={faqs} />
        </Container>
      </section>
    </>
  );
}

/** One row in the direct-contact list. */
function ContactMethod({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="bg-volt-50 text-volt-700 flex size-9 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="text-eyebrow text-ink-400 block font-mono uppercase">{label}</span>
        <span className="text-ink-900 mt-0.5 block truncate font-mono text-sm font-medium">
          {value}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          className="ring-ink-100 hover:ring-volt-200 hover:bg-volt-50/30 flex items-center gap-3 rounded-lg bg-white p-3 ring-1 transition-colors"
        >
          {content}
        </a>
      ) : (
        <div className="ring-ink-100 flex items-center gap-3 rounded-lg bg-white p-3 ring-1">
          {content}
        </div>
      )}
    </li>
  );
}
