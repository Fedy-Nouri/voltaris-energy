import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { site } from '@/content/site';

type CtaBandProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

/**
 * Closing call to action.
 *
 * Shared across every page, with overridable copy so each page can close on
 * something relevant rather than repeating one generic line six times.
 */
export function CtaBand({
  eyebrow = 'Next step',
  title = 'Find out what your site is actually doing.',
  description = 'A site survey takes a day and produces a measurement plan and a costed proposal. No obligation, and no pilot fee.',
}: CtaBandProps) {
  return (
    <section className="bg-ink-950 relative overflow-hidden">
      <div className="bg-grid-sm pointer-events-none absolute inset-0 text-white/30" aria-hidden />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(29_224_181/0.14),transparent_65%)] blur-2xl"
        aria-hidden
      />

      <Container className="relative">
        <Reveal className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <Eyebrow onDark>{eyebrow}</Eyebrow>

          <h2 className="text-display-lg max-w-3xl font-semibold text-balance text-white">
            {title}
          </h2>

          <p className="text-ink-300 max-w-xl text-base leading-relaxed sm:text-lg">
            {description}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" size="lg" icon="arrowRight">
              Book a site survey
            </Button>
            <Button href={`mailto:${site.salesEmail}`} size="lg" variant="outline" onDark>
              {site.salesEmail}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
