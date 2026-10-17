'use client';

import { useEffect } from 'react';

/**
 * Smooth scrolling for same-page anchor links.
 *
 * This exists because the obvious implementation — `html { scroll-behavior:
 * smooth }` — quietly breaks navigation. That property applies to *every*
 * programmatic scroll in the document, including the `scrollIntoView()` calls
 * the App Router makes while working out where to put the viewport after a
 * route change. Under `smooth` those calls become queued animations that race
 * each other, and the new page settles wherever the last one was heading rather
 * than at the top: you click a header link and land below the hero.
 *
 * Scoping the behaviour to an explicit anchor click keeps the nicety and leaves
 * the scroll the router owns completely alone.
 *
 * One delegated listener rather than a handler per link: the anchors are
 * rendered by Server Components, which cannot attach one, and delegation means
 * links added later are covered without touching this file.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleClick(event: MouseEvent) {
      // Leave anything that is not a plain left click to the browser, so
      // open-in-new-tab and middle-click still behave normally.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a');
      if (!(link instanceof HTMLAnchorElement)) return;

      // Same-page anchors only. A link to another route that happens to carry a
      // hash is a navigation, and the router handles the scroll for it.
      if (link.getAttribute('href')?.startsWith('#') !== true) return;

      // The skip link opts out: a keyboard user needs focus to move at once,
      // and an animation would delay it.
      if (link.dataset.noSmooth !== undefined) return;

      // Under reduced motion, fall through to the browser's instant jump.
      if (prefersReducedMotion.matches) return;

      const id = decodeURIComponent(link.hash.slice(1));
      const destination = id ? document.getElementById(id) : null;
      if (!destination) return;

      event.preventDefault();

      // `scroll-padding-top` on <html> is honoured here, which is what keeps the
      // target clear of the fixed header.
      destination.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Keep the address bar in step so the anchor stays shareable and Back
      // works, matching what a native anchor click does to the history stack.
      // `history.pushState` is supported directly by the App Router.
      window.history.pushState(null, '', link.hash);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
