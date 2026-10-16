import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Crumb = { name: string; path: string };

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  /** Breadcrumb trail, excluding the current page. */
  crumbs?: readonly Crumb[];
  /** Optional figures rendered along the bottom edge. */
  stats?: readonly { value: string; label: string }[];
  children?: React.ReactNode;
};

/**
 * Dark page header used by every route except the home page.
 *
 * Having one of these on every page is what allows the site header to keep a
 * single light-on-dark treatment rather than inverting itself per route, and
 * it gives the whole site a consistent opening rhythm.
 */
export function PageHero({ eyebrow, title, description, crumbs, stats, children }: PageHeroProps) {
  return (
    <section className="bg-ink-950 relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 text-white/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-[28rem] w-[56rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgb(29_224_181/0.12),transparent_62%)] blur-2xl"
        aria-hidden
      />

      <Container width="wide" className="relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="text-ink-500 flex flex-wrap items-center gap-1.5 text-xs">
              {crumbs.map((crumb) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  <Link href={crumb.path} className="hover:text-volt-300 transition-colors">
                    {crumb.name}
                  </Link>
                  <ChevronRight className="size-3" aria-hidden />
                </li>
              ))}
              {/* The current page is the last crumb and is not a link. */}
              <li className="text-ink-300" aria-current="page">
                {typeof title === 'string' ? title : eyebrow}
              </li>
            </ol>
          </nav>
        )}

        <Reveal className="flex max-w-3xl flex-col gap-5">
          <Eyebrow onDark>{eyebrow}</Eyebrow>

          <h1 className="text-display-lg font-semibold text-balance text-white">{title}</h1>

          <p className="text-ink-300 text-lg leading-relaxed">{description}</p>

          {children}
        </Reveal>

        {stats && (
          <Reveal delay={0.15} className="mt-12">
            {/*
              Flex ordering, not source ordering: a definition list requires
              each `dt` to precede its `dd` in the markup, but the figure should
              read first visually.
            */}
            <dl className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col border-l border-white/10 pl-4">
                  <dt className="text-ink-400 order-2 mt-1 text-[0.8125rem]">{stat.label}</dt>
                  <dd className="tabular order-1 font-mono text-2xl font-semibold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
