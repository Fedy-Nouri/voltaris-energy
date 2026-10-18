'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { productCategories } from '@/content/products';
import { Icon } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  /**
   * Lead cell of a bento grid — larger, and with the product's headline
   * capabilities included. Used on the home page teaser only; the `/products`
   * catalogue keeps every card the same size so six products can be compared
   * against each other.
   */
  featured?: boolean;
};

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
export function ProductCard({ product, featured = false }: ProductCardProps) {
  return (
    <motion.li
      variants={fadeUp}
      layout
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex', featured && 'md:col-span-2 md:row-span-2')}
    >
      <Card
        href={`/products/${product.slug}`}
        spotlight
        className={cn(
          'w-full gap-4',
          featured ? 'rounded-panel-lg border-glow p-8 sm:p-10' : 'p-6',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'bg-ink-900 text-volt-400 flex items-center justify-center rounded-xl',
              featured ? 'size-14' : 'size-11',
            )}
          >
            <Icon name={product.icon} className={featured ? 'size-6' : 'size-5'} />
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
          <h3
            className={cn(
              'text-ink-900 mt-1.5 font-semibold',
              featured ? 'text-display-sm' : 'text-[1.0625rem]',
            )}
          >
            {product.name}
          </h3>
        </div>

        <p
          className={cn(
            'text-ink-500 leading-relaxed',
            featured ? 'max-w-lg text-[0.9375rem]' : 'text-sm',
          )}
        >
          {product.summary}
        </p>

        {/* The lead card has room for the capabilities, which is most of why
            it earns the extra space rather than just being bigger. */}
        {featured && (
          <ul className="text-ink-600 mt-1 flex flex-col gap-2 text-sm">
            {product.capabilities.slice(0, 3).map((capability) => (
              <li key={capability} className="flex gap-2.5">
                <span className="bg-volt-500 mt-2 size-1 shrink-0 rounded-full" aria-hidden />
                {capability}
              </li>
            ))}
          </ul>
        )}

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
