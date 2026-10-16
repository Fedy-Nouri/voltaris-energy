'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { productCategories } from '@/content/products';
import { cn } from '@/lib/utils';
import { staggerParent } from '@/lib/motion';
import type { Product, ProductCategory } from '@/types';

type Filter = ProductCategory | 'all';

/**
 * Category filter over the product catalogue.
 *
 * Filtering is client-side state rather than a URL query parameter, which is a
 * deliberate trade-off: six products need no deep-linkable, shareable filtered
 * view, and keeping it local avoids a server round trip on every tab press. If
 * the catalogue grew to the point where a filtered list were worth sharing or
 * indexing, this is where `useSearchParams` would replace `useState`.
 *
 * `layout` on each card means removing one from the list slides the rest into
 * their new positions rather than snapping — Framer Motion measures before and
 * after and animates the difference, which plain CSS cannot do for a grid
 * reflow.
 */
export function ProductFilter({ products }: { products: readonly Product[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  // Only the categories actually represented in the catalogue get a tab, so
  // adding a product in a new category surfaces its tab automatically and
  // removing the last one of a category removes it.
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((product) => product.category));
    return (Object.keys(productCategories) as ProductCategory[]).filter((category) =>
      present.has(category),
    );
  }, [products]);

  const visible = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.category === filter)),
    [products, filter],
  );

  const tabs: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All products' },
    ...availableCategories.map((category) => ({
      value: category as Filter,
      label: productCategories[category],
    })),
  ];

  return (
    <div>
      {/* ---- Tabs ---- */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="border-ink-100 mb-8 flex flex-wrap items-center gap-1 border-b pb-3"
      >
        {tabs.map((tab) => {
          const isSelected = filter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                isSelected ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800',
              )}
            >
              {/* One shared layoutId slides the pill between tabs. */}
              {isSelected && (
                <motion.span
                  layoutId="product-filter-pill"
                  className="bg-ink-100 absolute inset-0 -z-10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}

        <p aria-live="polite" className="text-ink-400 ml-auto font-mono text-xs max-sm:hidden">
          {visible.length} of {products.length}
        </p>
      </div>

      {/* ---- Grid ---- */}
      <motion.ul
        data-reveal
        variants={staggerParent(0.07)}
        initial="hidden"
        animate="visible"
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {/*
          `popLayout` takes an exiting card out of the layout flow immediately,
          so the remaining cards begin sliding into their new positions while
          the old one is still fading rather than after it has gone.
        */}
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
