import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { TeamGrid } from '@/components/about/TeamGrid';
import { Timeline } from '@/components/about/Timeline';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { StaggerItem } from '@/components/motion/StaggerItem';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { CtaBand } from '@/components/ui/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { certifications, offices, site } from '@/content/site';
import { milestones, team, values } from '@/content/team';
import { Icon } from '@/lib/icons';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About us',
  description:
    'Voltaris builds energy measurement instruments and the analytics behind them. Founded in Rotterdam in 2016, now measuring 4,800 sites across 22 countries from offices in Rotterdam, Manchester and Singapore.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <PageHero
        eyebrow="About Voltaris"
        title="We started by admitting nobody could see what they were buying."
        description="Voltaris began in 2016 when an energy procurement project stalled on an uncomfortable realisation: the client had no measurement finer than a monthly invoice, so no amount of negotiation could tell them whether they were buying well. We decided the measurement had to come first."
        stats={[
          { value: '2016', label: 'Founded in Rotterdam' },
          { value: '4,800+', label: 'Sites under measurement' },
          { value: '22', label: 'Countries with live deployments' },
        ]}
      />

      {/* ---- Mission ---- */}
      <section className="py-16 sm:py-24">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <SectionHeading
              eyebrow="What we do"
              title="Instruments first, opinions second."
              description="We build the hardware that measures energy properly and the software that makes the measurement mean something. We do not sell retrofits, we do not take a commission on equipment anyone else supplies, and we do not claim a saving we cannot evidence from our own data."
            />

            <Reveal from="right" delay={0.1} className="flex flex-col gap-6">
              <p className="text-ink-600 text-[0.9375rem] leading-relaxed">
                That independence matters more than it sounds. An energy consultancy that also sells
                you the chillers has an obvious reason to find a chiller-shaped problem. We supply
                measurement, and the measurement is just as likely to tell you that a schedule left
                in manual override since 2019 is costing you more than any capital project would
                save.
              </p>
              <p className="text-ink-600 text-[0.9375rem] leading-relaxed">
                In practice most of the first year&rsquo;s return on a Voltaris deployment comes
                from things that cost nothing to fix. We are comfortable with that. The equipment
                pays for itself on the findings, and the ongoing value is in catching the next one
                before it becomes a year of quiet waste.
              </p>
              <p className="text-ink-600 text-[0.9375rem] leading-relaxed">
                Today {site.name} measures across twenty-two countries, from single industrial units
                to sixty-building university campuses, with engineering in Rotterdam and deployment
                teams in Manchester and Singapore.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---- Values ---- */}
      <section className="bg-ink-25 border-ink-100 border-y py-16 sm:py-20">
        <Container width="wide">
          <SectionHeading
            eyebrow="How we operate"
            title="Four things we do not compromise on."
            className="mb-12"
          />

          <StaggerGroup as="ul" stagger={0.08} className="grid gap-5 sm:grid-cols-2">
            {values.map((value) => (
              <StaggerItem
                as="li"
                key={value.title}
                className="rounded-panel ring-ink-100 flex flex-col gap-4 bg-white p-6 ring-1 sm:p-7"
              >
                <span className="bg-volt-50 text-volt-700 ring-volt-100 flex size-11 items-center justify-center rounded-xl ring-1">
                  <Icon name={value.icon} className="size-5" />
                </span>
                <h3 className="text-ink-900 text-[1.0625rem] font-semibold">{value.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{value.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* ---- Timeline ---- */}
      <section className="py-16 sm:py-24">
        <Container width="wide">
          <SectionHeading
            eyebrow="Company history"
            title="Ten years of making measurement defensible."
            className="mb-12"
          />
          <Timeline milestones={milestones} />
        </Container>
      </section>

      {/* ---- Team ---- */}
      <section className="bg-ink-25 border-ink-100 border-y py-16 sm:py-24">
        <Container width="wide">
          <SectionHeading
            eyebrow="The team"
            title="Engineers who have met your site before."
            description="Between them, the people below have commissioned metering in steelworks, cleanrooms, cold stores and substations. Most of what this company knows was learnt in a plant room."
            className="mb-12"
          />

          <StaggerGroup as="ul" stagger={0.07} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <TeamGrid members={team} />
          </StaggerGroup>
        </Container>
      </section>

      {/* ---- Offices & certifications ---- */}
      <section className="py-16 sm:py-24">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Where we are"
                title="Three offices, one dataset."
                className="mb-8"
              />

              <StaggerGroup as="ul" stagger={0.08} className="flex flex-col gap-4">
                {offices.map((office) => (
                  <StaggerItem
                    as="li"
                    key={office.city}
                    className="rounded-panel ring-ink-100 flex items-start justify-between gap-4 bg-white p-5 ring-1"
                  >
                    <div>
                      <h3 className="text-ink-900 text-[0.9375rem] font-semibold">
                        {office.city}, {office.country}
                      </h3>
                      <p className="text-ink-500 mt-1 text-[0.8125rem]">{office.role}</p>
                      <address className="text-ink-400 mt-2 text-[0.8125rem] not-italic">
                        {office.lines.join(', ')}
                      </address>
                    </div>
                    <Badge tone="outline">{office.timezone}</Badge>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>

            <div>
              <SectionHeading
                eyebrow="Accreditation"
                title="Certified where it has to count."
                description="Accuracy classes and security certifications are what let our readings be used for billing, for statutory reporting and inside regulated facilities."
                className="mb-8"
              />

              <StaggerGroup as="ul" stagger={0.05} className="flex flex-wrap gap-2">
                {certifications.map((certification) => (
                  <StaggerItem as="li" key={certification}>
                    <span className="text-ink-600 ring-ink-200 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8125rem] font-medium ring-1">
                      <Icon name="shieldCheck" className="text-volt-700 size-4" />
                      {certification}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="Come and see whether we are as useful as we claim."
        description="A site survey is the cheapest way to find out. One day on site, a measurement plan at the end of it, and an honest answer about whether the numbers work."
      />
    </>
  );
}
