'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { productCategories } from '@/content/products';
import { Icon } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';
import type { Product } from '@/types';

/**
 * Product card, shared by the home page teaser and the products index.
 *
 * It renders its own `motion.li` rather than being wrapped by the caller for
 * two reasons. A grid of products is genuinely a list, so the item has to be an
 * `li` — wrapping it in a `motion.div` inside the `ul` would produce invalid
 * markup and cost a screen-reader user the item count. And owning the element
 * means it can carry `layout` and `exit` itself, which is what lets the
 * products index animate cards into new positions as the filter changes.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.li
      variants={fadeUp}
      layout
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex"
    >
      <Card href={`/products/${product.slug}`} spotlight className="w-full gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="bg-ink-900 text-volt-400 flex size-11 items-center justify-center rounded-xl">
            <Icon name={product.icon} className="size-5" />
          </span>

          <div className="flex items-center gap-2">
            {product.flag && <Badge tone="volt">{product.flag}</Badge>}
            <ArrowUpRight
              className="text-ink-300 group-hover:text-volt-600 size-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-1">
          <p className="text-eyebrow text-ink-400 font-mono uppercase">
            {productCategories[product.category]} · {product.model}
          </p>
          <h3 className="text-ink-900 mt-1.5 text-[1.0625rem] font-semibold">{product.name}</h3>
        </div>

        <p className="text-ink-500 text-sm leading-relaxed">{product.summary}</p>

        {/* Pulled-out figures, so the card carries something concrete. */}
        <dl className="border-ink-100 mt-auto grid grid-cols-3 gap-3 border-t pt-4">
          {product.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-eyebrow text-ink-400 font-mono uppercase">{metric.label}</dt>
              <dd className="text-ink-900 tabular mt-1 font-mono text-sm font-semibold">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </motion.li>
  );
}
