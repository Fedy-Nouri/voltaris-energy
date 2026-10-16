import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { productCategories } from '@/content/products';
import { Icon } from '@/lib/icons';
import type { Product } from '@/types';

/**
 * Side-by-side comparison of the catalogue.
 *
 * Rendered as a real table with a header row and row headers so the
 * relationship between a figure and its product survives a screen reader. The
 * wrapper scrolls horizontally on narrow screens rather than the table
 * collapsing into cards — six columns of numeric specs are genuinely easier to
 * compare side by side, even if that means scrolling on a phone.
 */
export function ComparisonTable({ products }: { products: readonly Product[] }) {
  // Each product exposes three headline metrics; the labels differ per product,
  // so the table shows them positionally with the label inside the cell.
  const metricRows = [0, 1, 2];

  return (
    <Reveal>
      <div className="rounded-panel ring-ink-100 overflow-x-auto bg-white ring-1">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparison of Voltaris products by category, key metrics and warranty
          </caption>

          <thead>
            <tr className="border-ink-100 border-b">
              <th scope="col" className="text-eyebrow text-ink-400 p-4 font-mono uppercase">
                Product
              </th>
              {products.map((product) => (
                <th key={product.slug} scope="col" className="p-4 align-top">
                  <Link href={`/products/${product.slug}`} className="group block">
                    <span className="bg-ink-900 text-volt-400 mb-2.5 flex size-9 items-center justify-center rounded-lg">
                      <Icon name={product.icon} className="size-[1.125rem]" />
                    </span>
                    <span className="text-ink-900 group-hover:text-volt-700 block font-semibold transition-colors">
                      {product.model}
                    </span>
                    <span className="text-ink-400 text-eyebrow mt-1 block font-mono uppercase">
                      {productCategories[product.category]}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {metricRows.map((index) => (
              <tr key={index} className="border-ink-100 border-b last:border-0">
                <th
                  scope="row"
                  className="text-ink-500 p-4 text-[0.8125rem] font-normal whitespace-nowrap"
                >
                  Key metric {index + 1}
                </th>
                {products.map((product) => {
                  const metric = product.metrics[index];
                  return (
                    <td key={product.slug} className="p-4 align-top">
                      <span className="text-ink-900 tabular block font-mono font-semibold">
                        {metric?.value ?? '—'}
                      </span>
                      <span className="text-ink-400 mt-0.5 block text-xs">
                        {metric?.label ?? ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr>
              <th
                scope="row"
                className="text-ink-500 p-4 text-[0.8125rem] font-normal whitespace-nowrap"
              >
                Warranty
              </th>
              {products.map((product) => {
                const warranty = product.specs.find((spec) => spec.label === 'Warranty');
                return (
                  <td
                    key={product.slug}
                    className="text-ink-800 p-4 align-top font-mono text-[0.8125rem]"
                  >
                    {warranty?.value ?? 'Subscription'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
