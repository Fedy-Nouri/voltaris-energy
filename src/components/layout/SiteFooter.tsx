import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { certifications, footerNav, offices, site } from '@/content/site';

/**
 * Site footer.
 *
 * A Server Component — it is entirely static markup, so there is no reason to
 * send any of it to the client as JavaScript.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-300 relative overflow-hidden">
      {/* Faint grid texture, inheriting colour from the parent. */}
      <div
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 text-white/40"
        aria-hidden
      />

      <Container width="wide" className="relative">
        <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)] lg:gap-16 lg:py-20">
          {/* ---- Brand & contact ---- */}
          <div className="flex flex-col gap-6">
            <Logo onDark />

            <p className="max-w-xs text-sm leading-relaxed">{site.description}</p>

            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <dt className="sr-only">Email</dt>
                <Mail className="text-volt-400 size-4 shrink-0" aria-hidden />
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-volt-300 font-mono transition-colors"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2.5">
                <dt className="sr-only">Phone</dt>
                <Phone className="text-volt-400 size-4 shrink-0" aria-hidden />
                <dd>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="hover:text-volt-300 font-mono transition-colors"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-start gap-2.5">
                <dt className="sr-only">Headquarters</dt>
                <MapPin className="text-volt-400 mt-0.5 size-4 shrink-0" aria-hidden />
                <dd>
                  {offices[0].lines.join(', ')}, {offices[0].country}
                </dd>
              </div>
            </dl>
          </div>

          {/* ---- Link columns ---- */}
          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="text-eyebrow mb-4 font-mono font-medium text-white uppercase">
                  {group.heading}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-volt-300 inline-block text-sm transition-all duration-200 hover:translate-x-0.5"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* ---- Offices ---- */}
        <div className="grid gap-6 border-t border-white/8 py-10 sm:grid-cols-3">
          {offices.map((office) => (
            <div key={office.city}>
              {/*
                The timezone sits outside the heading. Inside it, the two text
                nodes concatenate with no whitespace in the accessible name and
                the office is announced as "RotterdamCET" — the flex gap is
                visual only and does nothing for a screen reader.
              */}
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-medium text-white">{office.city}</h3>
                <span className="text-eyebrow text-ink-300 font-mono uppercase">
                  {office.timezone}
                </span>
              </div>
              <p className="text-ink-300 mt-1 text-[0.8125rem]">{office.role}</p>
              <address className="mt-2 text-[0.8125rem] not-italic">
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">{office.country}</span>
              </address>
            </div>
          ))}
        </div>

        {/* ---- Certifications ---- */}
        <div className="flex flex-wrap gap-2 border-t border-white/8 py-8">
          {certifications.map((certification) => (
            <Badge key={certification} tone="outline" onDark>
              {certification}
            </Badge>
          ))}
        </div>

        {/* ---- Legal ---- */}
        <div className="text-ink-300 flex flex-col gap-2 border-t border-white/8 py-8 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono">
            {site.tagline} · Established {site.founded}
          </p>
        </div>
      </Container>
    </footer>
  );
}
