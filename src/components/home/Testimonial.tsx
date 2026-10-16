import { Quote } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Container } from '@/components/ui/Container';
import { featuredTestimonial } from '@/content/features';

/**
 * Single featured customer quote.
 *
 * Marked up as a `figure` with a `figcaption`, which is the correct pairing for
 * a quotation and its attribution — a `blockquote` on its own leaves the
 * attribution semantically unconnected to the words.
 */
export function Testimonial() {
  const { text, author, role, company, metric } = featuredTestimonial;

  return (
    <section className="bg-ink-25 border-ink-100 border-y py-20 sm:py-24">
      <Container>
        <Reveal>
          <figure className="flex flex-col items-center gap-8 text-center">
            <Quote className="text-volt-600/30 size-10" aria-hidden />

            <blockquote className="text-display-sm text-ink-800 max-w-3xl font-medium text-balance">
              <p>“{text}”</p>
            </blockquote>

            <figcaption className="flex flex-col items-center gap-1">
              <span className="text-ink-900 block text-sm font-semibold">{author}</span>
              <span className="text-ink-500 block text-sm">
                {role}, {company}
              </span>
            </figcaption>

            <div className="border-ink-200 flex items-baseline gap-2.5 border-t pt-6">
              <span className="text-volt-700 tabular font-mono text-2xl font-semibold">
                {metric.value}
              </span>
              <span className="text-ink-500 text-sm">{metric.label}</span>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
