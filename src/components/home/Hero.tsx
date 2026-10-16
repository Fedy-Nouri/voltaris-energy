'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { LiveDashboard } from '@/components/home/LiveDashboard';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { clientLogos, site } from '@/content/site';
import { EASE_OUT_EXPO, staggerParent } from '@/lib/motion';

/**
 * Home page hero.
 *
 * A Client Component because of the scroll-linked parallax. The parallax is
 * driven by `useScroll` scoped to this section with `useTransform` mapping
 * progress onto a small vertical offset — two layers moving at slightly
 * different rates, which gives the section depth without the queasy
 * over-the-top travel that full-page parallax produces.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // `offset` reads: start tracking when the section's top meets the viewport
  // top, finish when its bottom meets the viewport top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="bg-ink-950 relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* ---- Background layers ---- */}
      <div
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 text-white/50"
        aria-hidden
      />

      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(29_224_181/0.16),transparent_62%)] blur-2xl"
        aria-hidden
      />

      <Container width="wide" className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          {/* ---- Copy ---- */}
          <motion.div
            data-reveal
            style={{ y: textY }}
            variants={staggerParent(0.1)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <motion.div variants={heroItem}>
              <Badge tone="volt" onDark withDot>
                4,800 sites under measurement
              </Badge>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="text-display-xl font-semibold text-balance text-white"
            >
              Every kilowatt, <span className="text-gradient-volt">accounted for</span>.
            </motion.h1>

            <motion.p variants={heroItem} className="text-ink-300 max-w-xl text-lg leading-relaxed">
              A monthly invoice tells you what you spent. Voltaris tells you which circuit, which
              shift and which machine spent it — with revenue-grade metering, edge gateways that
              speak every protocol on your site, and analytics that make a saving provable.
            </motion.p>

            <motion.div variants={heroItem} className="flex flex-wrap items-center gap-3">
              {/* The one magnetic element on the page, reserved for the primary CTA. */}
              <MagneticButton>
                <Button href="/contact" size="lg" icon="arrowRight">
                  Book a site survey
                </Button>
              </MagneticButton>

              <Button
                href="/products"
                size="lg"
                variant="outline"
                onDark
                icon="playCircle"
                iconPosition="left"
              >
                See the hardware
              </Button>
            </motion.div>

            <motion.p variants={heroItem} className="text-ink-500 font-mono text-xs">
              Typical first-year reduction: 17%. Median payback: 4.3 months.
            </motion.p>
          </motion.div>

          {/* ---- Live dashboard ---- */}
          <motion.div
            data-reveal
            style={{ y: panelY }}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="relative"
          >
            {/* Soft glow behind the panel to lift it off the background. */}
            <div
              className="bg-volt-500/8 pointer-events-none absolute -inset-6 rounded-[2rem] blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <LiveDashboard />
            </div>
          </motion.div>
        </div>

        {/* ---- Client logo marquee ---- */}
        <div className="mt-16 sm:mt-20">
          <p className="text-eyebrow text-ink-600 mb-5 text-center font-mono uppercase">
            Measuring for
          </p>
          <LogoMarquee />
        </div>
      </Container>
    </section>
  );
}

/** Shared entrance for each hero element, released by the parent's stagger. */
const heroItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

/**
 * Infinite client logo strip.
 *
 * The list is rendered twice and the track is translated by exactly -50%, so
 * the second copy sits where the first began at the moment the animation loops
 * — which is what makes the repeat seamless. The animation is pure CSS
 * (`animate-marquee`) rather than Framer Motion: it runs indefinitely with no
 * JavaScript involvement at all, and it is automatically disabled by the
 * `prefers-reduced-motion` rule in globals.css.
 */
function LogoMarquee() {
  return (
    <div className="mask-fade-x relative overflow-hidden">
      {/*
        The visible track is hidden from assistive technology in full: it
        contains every name twice, and a screen reader announcing a duplicated,
        endlessly scrolling list is worse than useless. The real content is the
        sentence below it.
      */}
      <div className="animate-marquee flex w-max items-center gap-12 sm:gap-16" aria-hidden>
        {[...clientLogos, ...clientLogos].map((logo, index) => (
          <span
            key={`${logo}-${index}`}
            className="text-ink-500 shrink-0 font-mono text-sm font-medium tracking-wide whitespace-nowrap uppercase"
          >
            {logo}
          </span>
        ))}
      </div>
      <p className="sr-only">
        {site.name} clients include {clientLogos.join(', ')}.
      </p>
    </div>
  );
}
