import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

/** Open Graph images are 1200×630 by convention; every platform expects it. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

type OgImageOptions = {
  /** Small uppercase label above the title, e.g. a category. */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. */
  description?: string;
  /** Up to three figures rendered along the bottom. */
  metrics?: readonly { value: string; label: string }[];
};

/**
 * Renders a branded social card.
 *
 * Generated at build time with `next/og` rather than shipped as static PNGs,
 * which means a product's card always matches its actual specs — there is no
 * image file to forget to update when the content changes.
 *
 * `ImageResponse` renders through Satori, which supports only a deliberate
 * subset of CSS: flexbox, absolute positioning, and a limited set of
 * properties. That is why this uses inline styles and explicit `display: flex`
 * everywhere instead of the Tailwind classes used in the rest of the app —
 * Satori has no stylesheet, and any element with more than one child needs its
 * display mode stated outright.
 */
export function createOgImage({ eyebrow, title, description, metrics }: OgImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#06090b',
        padding: '64px 72px',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Accent glow, echoing the site's hero treatment. */}
      <div
        style={{
          position: 'absolute',
          top: -260,
          left: 180,
          width: 900,
          height: 560,
          background: 'radial-gradient(ellipse at center, rgba(29,224,181,0.20), transparent 62%)',
        }}
      />

      {/* Top rule in the brand accent. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: '#1de0b5',
        }}
      />

      {/* ---- Brand lockup ---- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
          <path
            d="M5.5 24.5a13 13 0 1 1 21 0"
            stroke="#1de0b5"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d="M11 22V17M16 22V11M21 22v-8"
            stroke="#1de0b5"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="16" cy="26" r="1.75" fill="#1de0b5" />
        </svg>
        <span style={{ color: '#ffffff', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>
          {site.name}
        </span>
      </div>

      {/* ---- Title block ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 940 }}>
        <span
          style={{
            color: '#1de0b5',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </span>

        <span
          style={{
            color: '#ffffff',
            fontSize: title.length > 52 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
          }}
        >
          {title}
        </span>

        {description && (
          <span style={{ color: '#8295a3', fontSize: 26, lineHeight: 1.4, maxWidth: 860 }}>
            {description}
          </span>
        )}
      </div>

      {/* ---- Metrics or tagline ---- */}
      {metrics && metrics.length > 0 ? (
        <div style={{ display: 'flex', gap: 56 }}>
          {metrics.slice(0, 3).map((metric) => (
            <div
              key={metric.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                borderLeft: '2px solid rgba(255,255,255,0.14)',
                paddingLeft: 20,
              }}
            >
              <span style={{ color: '#ffffff', fontSize: 38, fontWeight: 700 }}>
                {metric.value}
              </span>
              <span style={{ color: '#5c6e7d', fontSize: 20 }}>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <span style={{ color: '#5c6e7d', fontSize: 24 }}>{site.tagline}</span>
      )}
    </div>,
    OG_SIZE,
  );
}
