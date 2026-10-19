'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { primaryNav, site } from '@/content/site';
import { cn } from '@/lib/utils';
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from '@/lib/motion';

type MobileNavProps = {
  /** Shared with the desktop nav so both mark the same route as current. */
  isActive: (href: string) => boolean;
};

/**
 * Slide-over navigation for small screens.
 *
 * `AnimatePresence` is used here rather than for page transitions because this
 * is a case where exit animation genuinely works: the drawer's unmount is
 * something this component controls, so it can be deferred until the animation
 * finishes. Route changes are not — see `src/app/template.tsx`.
 */
export function MobileNav({ isActive }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * The drawer closes from the link's own click handler rather than from an
   * effect watching `usePathname()`. A client-side navigation does not unmount
   * the header, so something has to close it — but reacting to the route
   * change after the fact means a render with the drawer still open over the
   * new page, and it is a `setState` in an effect for an event we already
   * know about. Closing at the source is both simpler and a frame earlier.
   */

  // Escape to close, and lock body scroll so the page behind cannot move.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the panel so a keyboard user is not left behind it.
    panelRef.current?.focus();

    // Captured on open: by the time cleanup runs the ref may point elsewhere,
    // and focus needs to return to the button that actually opened this.
    const trigger = triggerRef.current;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Open menu"
        className="text-ink-200 inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/8 hover:text-white lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Scrim. Clicking it closes the drawer. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="bg-ink-950/70 fixed inset-0 z-50 backdrop-blur-sm lg:hidden"
              aria-hidden
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: EASE_IN_OUT_QUART }}
              className="bg-ink-900 fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 focus:outline-none lg:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 px-5">
                <Logo onDark />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="text-ink-300 inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/8 hover:text-white"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
                <ul className="flex flex-col gap-1">
                  {primaryNav.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      // Stagger by index so the list unrolls rather than
                      // appearing all at once.
                      transition={{
                        delay: 0.08 + index * 0.05,
                        duration: 0.4,
                        ease: EASE_OUT_EXPO,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-3 text-lg font-medium transition-colors',
                          isActive(item.href)
                            ? 'text-volt-300 bg-white/6'
                            : 'text-ink-200 hover:bg-white/5 hover:text-white',
                        )}
                      >
                        {item.label}
                        {isActive(item.href) && (
                          <span className="bg-volt-400 size-1.5 rounded-full" aria-hidden />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="shrink-0 space-y-4 border-t border-white/8 px-5 py-6">
                <Button href="/contact" fullWidth size="md" onClick={() => setIsOpen(false)}>
                  Book a site survey
                </Button>
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink-300 hover:text-volt-300 block text-center font-mono text-sm transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
