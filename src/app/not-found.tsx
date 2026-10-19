import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { primaryNav } from '@/content/site';

export const metadata = {
  title: 'Page not found',
  description: 'That page does not exist.',
  robots: { index: false, follow: true },
};

/**
 * 404 page.
 *
 * Deliberately a Server Component with no animation. A visitor who has already
 * hit a dead end should get the useful links instantly, not watch them fade in.
 */
export default function NotFound() {
  return (
    <section className="bg-ink-950 relative flex min-h-[70vh] items-center overflow-hidden py-24">
      <div
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 text-white/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(29_224_181/0.12),transparent_64%)] blur-2xl"
        aria-hidden
      />

      <Container className="relative">
        <div className="flex max-w-2xl flex-col gap-6">
          <Eyebrow onDark>Error 404</Eyebrow>

          <h1 className="text-display-lg font-semibold text-balance text-white">
            This reading is out of range.
          </h1>

          <p className="text-ink-300 text-lg leading-relaxed">
            The page you asked for does not exist — it may have moved, or the link may be wrong.
            Everything below is still where you left it.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Button href="/" size="lg" icon="arrowRight">
              Back to the home page
            </Button>
            <Button href="/contact" size="lg" variant="outline" onDark>
              Contact us
            </Button>
          </div>

          <nav aria-label="Site sections" className="mt-6 border-t border-white/10 pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-300 hover:text-volt-300 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
