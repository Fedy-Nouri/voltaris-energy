import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { valueProps } from '@/content/features';
import { Icon } from '@/lib/icons';

/**
 * Three-up value proposition, immediately under the hero.
 *
 * A Server Component. `StaggerGroup` and `Card` are the only client pieces, so
 * the copy itself costs no JavaScript.
 */
export function ValueProps() {
  return (
    <section className="bg-ink-25 border-ink-100 border-y py-16 sm:py-20">
      <Container width="wide">
        <StaggerGroup className="grid gap-5 md:grid-cols-3" stagger={0.1}>
          {valueProps.map((prop) => (
            <Card key={prop.title} spotlight className="gap-4 p-7">
              <span className="bg-volt-50 text-volt-700 ring-volt-100 flex size-11 items-center justify-center rounded-xl ring-1">
                <Icon name={prop.icon} className="size-5" />
              </span>

              <h3 className="text-ink-900 text-[1.0625rem] font-semibold">{prop.title}</h3>
              <p className="text-ink-500 text-sm leading-relaxed">{prop.description}</p>
            </Card>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
