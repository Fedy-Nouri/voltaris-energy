'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

import { Logo } from '@/components/layout/Logo';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/Button';
import { primaryNav } from '@/content/site';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/** Width of the bar at rest, matching the page container so the logo lines up. */
const WIDTH_AT_REST = 1280;
/** Narrower once detached, so the island reads as a distinct object. */
const WIDTH_CONTRACTED = 1060;

/**
 * Floating island header.
 *
 * At the top of a page it spans the full container width with no background,
 * sitting flush against the hero. Once the page scrolls it contracts into a
 * narrower, glass-backed pill detached from the top edge — so it stops being
 * part of the hero and becomes chrome floating above the content.
 *
 * Every page opens with a dark hero band, which is what lets the header keep a
 * single light-on-dark treatment throughout instead of inverting per route.
 *
 * Only `maxWidth`, `marginTop` and colours animate. Height stays fixed: a
 * changing height would reflow the page content beneath on every frame, and
 * the contraction reads clearly enough without it.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // `useMotionValueEvent` reads scroll without re-rendering on every frame;
  // state only changes when the threshold is actually crossed.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 16);
  });

  /** A nav item is active on its own page and on anything nested below it. */
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
      {/* Keyboard users can jump the nav entirely. Visible only on focus.
          `data-no-smooth` opts it out of the anchor glide — focus has to move
          immediately, not after an animation. */}
      <a
        href="#main"
        data-no-smooth
        className="text-ink-950 bg-volt-400 sr-only rounded-b-lg px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-0 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      <motion.div
        initial={false}
        animate={{
          maxWidth: isScrolled ? WIDTH_CONTRACTED : WIDTH_AT_REST,
          marginTop: isScrolled ? 14 : 0,
          // 0.82 rather than a lighter glass: the island sits over white
          // content once scrolled, and a thinner fill turns muddy grey instead
          // of reading as dark chrome.
          backgroundColor: isScrolled ? 'rgba(10, 15, 20, 0.82)' : 'rgba(10, 15, 20, 0)',
          borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
        className={cn(
          'mx-auto rounded-full border px-4 sm:px-6',
          // The blur and shadow are toggled rather than animated — a
          // backdrop-filter that animates every frame is expensive, and these
          // only need to appear once the island detaches.
          isScrolled && 'shadow-[0_18px_40px_-20px_rgb(6_9_11/0.7)] backdrop-blur-xl',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Voltaris — home"
            className="-mx-2 rounded-full px-2 py-1.5 transition-opacity hover:opacity-80"
          >
            <Logo onDark />
          </Link>

          {/*
            ---- Desktop navigation ----
            `max-lg:hidden` rather than `hidden lg:block`: one utility that
            says "hidden below lg" instead of two that have to resolve
            against each other in the cascade. Besides being clearer, it is
            immune to the surprisingly common browser extensions that inject
            `.hidden { display: none !important }` and would otherwise keep
            this nav hidden at every width.
          */}
          <nav aria-label="Main" className="max-lg:hidden">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                        active ? 'text-white' : 'text-ink-300 hover:text-white',
                      )}
                    >
                      {/*
                        A single shared `layoutId` across all nav items means
                        Framer Motion animates the pill from the old active
                        link to the new one on navigation, rather than
                        cross-fading two separate elements.
                      */}
                      {active && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>

                      {/* Underline that grows from the centre on hover. */}
                      {!active && (
                        <span
                          aria-hidden
                          className="bg-volt-400 absolute bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 transition-[width] duration-300 ease-out group-hover:w-4"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href="/contact" size="sm" icon="arrowRight" className="max-sm:hidden">
              Book a site survey
            </Button>

            <MobileNav isActive={isActive} />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
