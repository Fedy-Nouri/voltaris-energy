import { certifications, offices, site, siteUrl } from '@/content/site';
import type { CaseStudy, Faq, Product } from '@/types';

/**
 * JSON-LD structured data builders.
 *
 * Kept separate from `lib/seo.ts` because they answer a different question.
 * Meta tags describe the *page* to a crawler and a social card; JSON-LD
 * describes the *thing the page is about* in a vocabulary search engines
 * reason over — an Organization, a Product, a FAQ. One is presentation, the
 * other is semantics, and conflating them tends to produce invalid markup.
 *
 * Each builder returns a plain object which the page renders inside a
 * `<script type="application/ld+json">`.
 */

/** The company itself. Emitted once, in the root layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: siteUrl,
    description: site.description,
    foundingDate: site.founded,
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    logo: `${siteUrl}/icon.svg`,
    hasCredential: certifications,
    address: offices.map((office) => ({
      '@type': 'PostalAddress',
      streetAddress: office.lines[0],
      addressLocality: office.city,
      addressCountry: office.country,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.salesEmail,
      telephone: site.phone,
      availableLanguage: ['English', 'Dutch', 'German'],
    },
  };
}

/** The site as a searchable entity. Emitted once, in the root layout. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    description: site.description,
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en-GB',
  };
}

/**
 * A single product.
 *
 * Specifications map to `additionalProperty` rather than being flattened into
 * the description, so a crawler can read "Accuracy class: Class 0.2S" as a
 * structured pair. No `offers` block is included — publishing a price we do
 * not actually quote publicly would be invalid structured data.
 */
export function productSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/products/${product.slug}/#product`,
    name: product.name,
    sku: product.model,
    category: product.category,
    description: product.description,
    url: `${siteUrl}/products/${product.slug}`,
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@id': `${siteUrl}/#organization` },
    additionalProperty: product.specs.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    })),
  };
}

/** Breadcrumb trail. Takes already-resolved labels and paths. */
export function breadcrumbSchema(crumbs: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

/** FAQ block for the contact page. */
export function faqSchema(items: readonly Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Case studies, described as articles about a deployment.
 *
 * `articleBody` carries the full challenge and solution prose. On the page
 * itself that text lives inside a panel that is only mounted once a card is
 * opened, so without this a crawler would only ever see the summary. This is
 * the honest way to expose it — the structured data says exactly what the
 * article contains, rather than hiding a duplicate copy in the markup.
 */
export function caseStudyListSchema(studies: readonly CaseStudy[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: studies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: study.headline,
        description: study.summary,
        articleBody: `${study.challenge}\n\n${study.solution}`,
        about: study.sector,
        locationCreated: study.location,
        publisher: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/case-studies#${study.slug}`,
      },
    })),
  };
}
