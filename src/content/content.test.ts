import { describe, expect, it } from 'vitest';
import { getProduct, getRelatedProducts, products } from '@/content/products';
import { caseStudies } from '@/content/case-studies';
import { solutions } from '@/content/solutions';
import { faqs } from '@/content/faqs';
import { footerNav, primaryNav } from '@/content/site';
import { icons } from '@/lib/icons';

/**
 * Integrity checks over the content layer.
 *
 * Because the whole site is generated from these modules, a bad value here
 * does not fail loudly — it produces a duplicate route, a dead link, or a card
 * with a blank icon. TypeScript catches the wrong *shape*; these tests catch
 * the wrong *content*, which is the failure mode a typed data layer leaves open.
 */

describe('products', () => {
  it('has unique slugs, since each one becomes a route', () => {
    const slugs = products.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses URL-safe slugs', () => {
    for (const product of products) {
      expect(product.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('gives every product exactly three metrics, which the card and OG image assume', () => {
    for (const product of products) {
      expect(product.metrics, `${product.slug} metrics`).toHaveLength(3);
    }
  });

  it('gives every product specs, capabilities and use cases', () => {
    for (const product of products) {
      expect(product.specs.length, `${product.slug} specs`).toBeGreaterThan(4);
      expect(product.capabilities.length, `${product.slug} capabilities`).toBeGreaterThan(2);
      expect(product.useCases.length, `${product.slug} use cases`).toBeGreaterThan(2);
    }
  });

  it('references only icons that exist in the registry', () => {
    for (const product of products) {
      expect(icons, `${product.slug} icon`).toHaveProperty(product.icon);
    }
  });

  it('keeps taglines short enough to work as a meta description', () => {
    for (const product of products) {
      expect(product.tagline.length, `${product.slug} tagline`).toBeLessThanOrEqual(160);
    }
  });
});

describe('getRelatedProducts', () => {
  it('never returns the product it was asked about', () => {
    for (const product of products) {
      const related = getRelatedProducts(product.slug);
      expect(related.map((item) => item.slug)).not.toContain(product.slug);
    }
  });

  it('returns the requested number while the catalogue is large enough', () => {
    expect(getRelatedProducts(products[0].slug, 3)).toHaveLength(3);
  });

  it('returns nothing for an unknown slug rather than throwing', () => {
    expect(getRelatedProducts('no-such-product')).toEqual([]);
  });
});

describe('solutions', () => {
  it('has unique slugs, which are used as in-page anchors', () => {
    const slugs = solutions.map((solution) => solution.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('only references products that actually exist', () => {
    for (const solution of solutions) {
      for (const slug of solution.products) {
        expect(getProduct(slug), `${solution.slug} references ${slug}`).toBeDefined();
      }
    }
  });

  it('references only icons that exist in the registry', () => {
    for (const solution of solutions) {
      expect(icons).toHaveProperty(solution.icon);
    }
  });
});

describe('case studies', () => {
  it('has unique slugs, which become layout animation ids', () => {
    const slugs = caseStudies.map((study) => study.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every study exactly four results, which the card grid assumes', () => {
    for (const study of caseStudies) {
      expect(study.results, `${study.slug} results`).toHaveLength(4);
    }
  });

  it('gives every study an attributed quote', () => {
    for (const study of caseStudies) {
      expect(study.quote.text.length, `${study.slug} quote`).toBeGreaterThan(20);
      expect(study.quote.author, `${study.slug} author`).toBeTruthy();
      expect(study.quote.role, `${study.slug} role`).toBeTruthy();
    }
  });
});

describe('faqs', () => {
  it('has no duplicate questions', () => {
    const questions = faqs.map((faq) => faq.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it('answers each question fully enough to stand alone in FAQPage markup', () => {
    for (const faq of faqs) {
      expect(faq.answer.length, faq.question).toBeGreaterThan(80);
    }
  });
});

describe('navigation', () => {
  it('uses root-relative paths everywhere', () => {
    const allLinks = [...primaryNav, ...footerNav.flatMap((group) => group.items)];
    for (const item of allLinks) {
      expect(item.href, item.label).toMatch(/^\//);
    }
  });

  it('only links to product pages that exist', () => {
    const productLinks = footerNav
      .flatMap((group) => group.items)
      .map((item) => item.href)
      .filter((href) => href.startsWith('/products/'));

    for (const href of productLinks) {
      const slug = href.replace('/products/', '');
      expect(getProduct(slug), `footer links to ${href}`).toBeDefined();
    }
  });

  it('only links to solution anchors that exist', () => {
    const solutionAnchors = footerNav
      .flatMap((group) => group.items)
      .map((item) => item.href)
      .filter((href) => href.startsWith('/solutions#'));

    const known = new Set(solutions.map((solution) => solution.slug));
    for (const href of solutionAnchors) {
      expect(known, `footer links to ${href}`).toContain(href.replace('/solutions#', ''));
    }
  });
});
