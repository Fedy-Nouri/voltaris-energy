import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { JsonLd } from '@/components/JsonLd';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { site, siteUrl } from '@/content/site';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import './globals.css';

/**
 * Fonts are self-hosted at build time by `next/font`, so there is no request to
 * Google at runtime — one less third party, no layout shift, and no CLS from a
 * late-arriving font file. `display: swap` keeps text readable while the real
 * face loads.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  /**
   * Every relative URL in page metadata — canonicals, Open Graph images — is
   * resolved against this. Without it, Next emits relative OG image paths,
   * which social crawlers cannot fetch.
   */
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — IoT energy monitoring for industrial sites`,
    // Page titles supply only their own part; the brand suffix is added here.
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'energy management',
    'IoT energy monitoring',
    'industrial energy metering',
    'submetering',
    'ISO 50001 reporting',
    'demand response',
    'power quality monitoring',
    'energy analytics platform',
  ],
  authors: [{ name: site.legalName, url: siteUrl }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: false, address: false },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_GB',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the dark header, so mobile browser chrome blends with the page.
  themeColor: '#06090b',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {/*
          Framer Motion writes its `initial` state into the server-rendered
          markup, which means a reveal's hidden state is the *final* state for
          anyone whose JavaScript never runs. This rule reinstates those
          elements so content is never dependent on the animation layer.

          `> *` covers the direct children of a stagger group, which are hidden
          through variant inheritance rather than by their own `initial`. It is
          deliberately not `*`: descendants deeper than that include the live
          dashboard's chart bars, whose transforms carry real meaning and must
          not be reset.
        */}
        <noscript>
          <style>{`[data-page-transition],[data-reveal],[data-reveal]>*{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        {/* Describes the company and the site once, for the whole domain. */}
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />

        <MotionProvider>
          <SiteHeader />
          <ScrollProgress />

          {/*
            Target of the "skip to content" link in the header.

            `overflow-x-clip` contains the transient sideways travel of entry
            animations: a `Reveal from="right"` starts 24px to the right of its
            final position, which is more than the 20px gutter on a 375px
            screen, so for the moment before it animates in it would widen the
            document and produce a horizontal scrollbar.

            `clip` rather than `hidden` matters — `hidden` establishes a scroll
            container, which silently breaks `position: sticky` for descendants
            such as the specifications panel on a product page. `clip` prevents
            the scroll without creating one.
          */}
          <main id="main" className="flex-1 overflow-x-clip">
            {children}
          </main>

          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
