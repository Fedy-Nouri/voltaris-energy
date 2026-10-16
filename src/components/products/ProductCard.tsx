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
 * Wrapped in a `motion.li` so it participates in a parent `StaggerGroup` while
 * still being a list item — a grid of products is a list, and making it a
 * series of `div`s would cost a screen-reader user the item count.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.li variants={fadeUp} className="flex">
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
