'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Faq } from '@/types';

/**
 * FAQ accordion.
 *
 * Built on buttons with `aria-expanded` and `aria-controls` rather than the
 * native `<details>` element, because `<details>` cannot animate its open
 * height — the browser snaps it. Framer Motion animating `height: auto` gets
 * the motion while the ARIA attributes keep the semantics a native element
 * would have given for free.
 *
 * Several answers can be open at once. A single-open accordion would close the
 * answer someone is halfway through reading the moment they open another, and
 * these answers are long enough that comparing two is a reasonable thing to
 * want.
 */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  function toggle(index: number) {
    setOpenIndexes((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    );
  }

  return (
    <ul className="border-ink-100 flex flex-col border-t">
      {faqs.map((faq, index) => {
        const isOpen = openIndexes.includes(index);
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <li key={faq.question} className="border-ink-100 border-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    'text-[0.9375rem] font-medium transition-colors sm:text-base',
                    isOpen ? 'text-volt-700' : 'text-ink-900 group-hover:text-volt-700',
                  )}
                >
                  {faq.question}
                </span>

                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen ? 'bg-volt-100 text-volt-800' : 'bg-ink-50 text-ink-500',
                  )}
                >
                  <Plus className="size-3.5" aria-hidden />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="text-ink-500 max-w-2xl pb-5 text-[0.9375rem] leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
