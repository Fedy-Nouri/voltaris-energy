'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Quote, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SpecTable } from '@/components/ui/SpecTable';
import { EASE_OUT_EXPO, fadeUp, revealViewport, staggerParent } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/types';

/**
 * Case study cards that expand into a full detail panel.
 *
 * This is the one place a shared-element transition genuinely earns its keep.
 * The card and the open panel are two different elements, but giving both the
 * same `layoutId` tells Framer Motion to treat them as one object moving and
 * resizing between two states — it measures the card's rectangle, measures the
 * panel's, and interpolates with transforms. The alternative, animating width
 * and height, would thrash layout on every frame.
 *
 * Expanding in place rather than routing to `/case-studies/[slug]` keeps four
 * studies from becoming four thin pages. The trade-off is real and worth
 * naming: the panel body is not in the DOM until it is opened, so a crawler
 * following only the HTML sees the card — headline, summary and results — but
 * not the long-form text. That is why the page also emits the full challenge
 * and solution prose as `articleBody` in its JSON-LD. If these studies ever
 * needed to rank on their own terms, they should become real routes.
 */
export function CaseStudyGrid({ studies }: { studies: readonly CaseStudy[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** The card that opened the panel, so focus can be returned to it. */
  const originRef = useRef<HTMLElement | null>(null);

  const openStudy = studies.find((study) => study.slug === openSlug) ?? null;

  // Escape to close, body scroll lock, and focus moved into the panel.
  useEffect(() => {
    if (!openStudy) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenSlug(null);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      originRef.current?.focus();
    };
  }, [openStudy]);

  function open(slug: string, element: HTMLElement) {
    originRef.current = element;
    setOpenSlug(slug);
  }

  return (
    <>
      <motion.ul
        data-reveal
        variants={staggerParent(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        /*
         * Six columns so a bento can tile exactly: the lead study takes all
         * six, the remaining three take two each. A two-column grid would
         * leave the fourth study orphaned on its own row.
         */
        className="grid grid-cols-1 gap-4 lg:grid-cols-6"
      >
        {studies.map((study, index) => {
          const isLead = index === 0;

          return (
            <motion.li
              key={study.slug}
              variants={fadeUp}
              className={cn('flex', isLead ? 'lg:col-span-6' : 'lg:col-span-2')}
            >
              <motion.article
                layoutId={`case-${study.slug}`}
                className={cn(
                  'ring-ink-100 shadow-panel hover:shadow-lift flex w-full flex-col bg-white ring-1 transition-shadow duration-300',
                  isLead ? 'rounded-panel-lg border-glow' : 'rounded-panel',
                )}
              >
                <div
                  className={cn(
                    'flex flex-1 flex-col gap-4',
                    isLead ? 'p-8 sm:p-10 lg:max-w-3xl' : 'p-6',
                  )}
                >
                  <motion.div layoutId={`case-meta-${study.slug}`} className="flex flex-wrap gap-2">
                    <Badge tone="volt">{study.sector}</Badge>
                    <Badge tone="outline">{study.location}</Badge>
                  </motion.div>

                  <motion.h3
                    layoutId={`case-title-${study.slug}`}
                    className={cn(
                      'text-ink-900 font-semibold text-balance',
                      isLead ? 'text-display-sm' : 'text-lg',
                    )}
                  >
                    {study.headline}
                  </motion.h3>

                  <p
                    className={cn(
                      'text-ink-500 leading-relaxed',
                      isLead ? 'text-[0.9375rem]' : 'text-sm',
                    )}
                  >
                    {study.summary}
                  </p>

                  {/* Headline results. Two columns on the narrow cards — four
                    would crush each figure against its neighbour. */}
                  <dl
                    className={cn(
                      'border-ink-100 mt-auto grid gap-4 border-t pt-5',
                      isLead ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2',
                    )}
                  >
                    {study.results.map((result) => (
                      <div key={result.label} className="flex flex-col">
                        <dd className="text-volt-700 tabular order-1 font-mono text-lg font-semibold">
                          {result.value}
                        </dd>
                        <dt className="text-ink-400 order-2 mt-1 text-[0.75rem] leading-snug">
                          {result.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <button
                    type="button"
                    onClick={(event) => open(study.slug, event.currentTarget)}
                    aria-expanded={openSlug === study.slug}
                    className="text-ink-900 hover:text-volt-700 group mt-2 inline-flex items-center gap-2 self-start text-sm font-medium transition-colors"
                  >
                    Read the full study
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                    {/* Names the control for assistive tech without bloating the label. */}
                    <span className="sr-only">: {study.client}</span>
                  </button>
                </div>
              </motion.article>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* ---- Expanded panel ---- */}
      <AnimatePresence>
        {openStudy && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpenSlug(null)}
              className="bg-ink-950/70 fixed inset-0 z-50 backdrop-blur-sm"
              aria-hidden
            />

            <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-4 sm:p-6">
              <motion.div
                ref={panelRef}
                layoutId={`case-${openStudy.slug}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`case-heading-${openStudy.slug}`}
                tabIndex={-1}
                className="rounded-panel relative mx-auto my-4 max-w-3xl bg-white focus:outline-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenSlug(null)}
                  aria-label="Close case study"
                  className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-lg transition-colors"
                >
                  <X className="size-4" aria-hidden />
                </button>

                <div className="flex flex-col gap-6 p-6 sm:p-9">
                  <motion.div
                    layoutId={`case-meta-${openStudy.slug}`}
                    className="flex flex-wrap gap-2 pr-10"
                  >
                    <Badge tone="volt">{openStudy.sector}</Badge>
                    <Badge tone="outline">{openStudy.location}</Badge>
                  </motion.div>

                  <div>
                    <p className="text-eyebrow text-ink-400 mb-2 font-mono uppercase">
                      {openStudy.client}
                    </p>
                    <motion.h2
                      layoutId={`case-title-${openStudy.slug}`}
                      id={`case-heading-${openStudy.slug}`}
                      className="text-display-sm text-ink-900 font-semibold text-balance"
                    >
                      {openStudy.headline}
                    </motion.h2>
                  </div>

                  {/* Body content fades in after the shape has settled. */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="flex flex-col gap-6"
                  >
                    <dl className="bg-ink-25 rounded-panel grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
                      {openStudy.results.map((result) => (
                        <div key={result.label} className="flex flex-col">
                          <dd className="text-volt-700 tabular order-1 font-mono text-xl font-semibold">
                            {result.value}
                          </dd>
                          <dt className="text-ink-500 order-2 mt-1 text-xs leading-snug">
                            {result.label}
                          </dt>
                        </div>
                      ))}
                    </dl>

                    <Section title="The challenge" body={openStudy.challenge} />
                    <Section title="What we did" body={openStudy.solution} />

                    <figure className="border-volt-500 bg-volt-50/50 rounded-r-lg border-l-2 py-4 pr-4 pl-5">
                      <Quote className="text-volt-600/40 mb-2 size-5" aria-hidden />
                      <blockquote className="text-ink-800 text-[0.9375rem] leading-relaxed">
                        <p>“{openStudy.quote.text}”</p>
                      </blockquote>
                      <figcaption className="text-ink-500 mt-3 text-[0.8125rem]">
                        <span className="text-ink-900 font-medium">{openStudy.quote.author}</span>
                        {' — '}
                        {openStudy.quote.role}
                      </figcaption>
                    </figure>

                    <div>
                      <h3 className="text-eyebrow text-ink-400 mb-3 font-mono uppercase">
                        Deployment
                      </h3>
                      <SpecTable
                        specs={openStudy.deployment}
                        caption={`Deployment details for the ${openStudy.client} case study`}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/** A titled prose block inside the expanded panel. */
function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-eyebrow text-ink-400 mb-2 font-mono uppercase">{title}</h3>
      <p className="text-ink-600 text-[0.9375rem] leading-relaxed">{body}</p>
    </div>
  );
}
