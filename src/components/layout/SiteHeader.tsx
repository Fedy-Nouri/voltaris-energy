'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

import { Logo } from '@/components/layout/Logo';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { primaryNav } from '@/content/site';
import { cn } from '@/lib/utils';
import { EASE_OUT_QUINT } from '@/lib/motion';

/**
 * Sticky site header.
 *
 * Every page opens with a dark hero band, which is what lets the header use a
 * single light-on-dark treatment throughout instead of inverting its colours
 * per route — one less thing that can look wrong on a page added later.
 *
 * It starts transparent over the hero and gains a blurred, bordered background
 * once the page scrolls, so it reads as chrome rather than as part of the hero.
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
    <header className="fixed inset-x-0 top-0 z-50">
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
          backgroundColor: isScrolled ? 'rgba(6, 9, 11, 0.82)' : 'rgba(6, 9, 11, 0)',
          borderBottomColor: isScrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.3, ease: EASE_OUT_QUINT }}
        className={cn('border-b', isScrolled && 'backdrop-blur-xl')}
      >
        <Container width="wide">
          <div className="flex h-18 items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Voltaris — home"
              className="group/logo -mx-2 rounded-lg px-2 py-1.5 transition-opacity hover:opacity-80"
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
                          'group relative block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
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
                            className="absolute inset-0 -z-10 rounded-lg bg-white/8"
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
        </Container>
      </motion.div>
    </header>
  );
}
