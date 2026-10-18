import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { valueProps } from '@/content/features';
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';

/**
 * Three-up value proposition, immediately under the hero.
 *
 * Laid out asymmetrically: the first point takes a tall cell down the left and
 * the other two stack beside it. Three equal cards gave all three the same
 * weight, which wasted the position directly under the hero — the first thing
 * read after the headline should be the strongest claim.
 *
 * A Server Component; `StaggerGroup` and `Card` are the only client pieces.
 */
export function ValueProps() {
  return (
    <section
      className="bg-ink-25 border-ink-100 section-y border-y"
      aria-labelledby="value-props-heading"
    >
      <Container width="wide">
        {/*
          This section is deliberately heading-less in the design — cards
          straight under the hero. Without an `h2` the document outline would
          jump from the page `h1` to the cards' `h3`s, which is exactly the
          kind of gap that makes a screen reader's heading list confusing. A
          visually hidden heading closes it without touching the layout.
        */}
        <h2 id="value-props-heading" className="sr-only">
          Why measure with Voltaris
        </h2>

        <StaggerGroup
          className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          stagger={0.1}
        >
          {valueProps.map((prop, index) => {
            const isLead = index === 0;

            return (
              <Card
                key={prop.title}
                spotlight
                className={cn(
                  'gap-5',
                  isLead
                    ? 'rounded-panel-lg border-glow justify-end p-8 sm:p-10 lg:row-span-2'
                    : 'p-6 sm:p-7',
                )}
              >
                <span
                  className={cn(
                    'bg-volt-50 text-volt-700 ring-volt-100 flex items-center justify-center rounded-xl ring-1',
                    isLead ? 'size-14' : 'size-11',
                  )}
                >
                  <Icon name={prop.icon} className={isLead ? 'size-6' : 'size-5'} />
                </span>

                <div>
                  <h3
                    className={cn(
                      'text-ink-900 font-semibold',
                      isLead ? 'text-display-sm' : 'text-[1.0625rem]',
                    )}
                  >
                    {prop.title}
                  </h3>
                  <p
                    className={cn(
                      'text-ink-500 mt-2.5 leading-relaxed',
                      isLead ? 'max-w-sm text-[0.9375rem]' : 'text-sm',
                    )}
                  >
                    {prop.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
