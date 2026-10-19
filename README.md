# Voltaris — IoT energy monitoring website

A marketing site for a fictional energy management company that sells IoT energy
monitoring hardware and analytics to industrial and commercial clients.

**Live:** https://voltaris-energy-one.vercel.app
**Repo:** https://github.com/Fedy-Nouri/voltaris-energy

---

## What's in it

| Route              | What it does                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/`                | Hero with a simulated live monitoring dashboard, value proposition, platform features, process, stats, testimonial |
| `/products`        | Six products with a category filter and a side-by-side comparison table                                            |
| `/products/[slug]` | Per-product detail — full specifications, capabilities, deployments, related products                              |
| `/solutions`       | Six industries, each with its challenge, approach and outcome figures                                              |
| `/case-studies`    | Four deployments; each card expands into a full study via a shared-element transition                              |
| `/about`           | Mission, scroll-linked company timeline, team, operating principles, offices, certifications                       |
| `/contact`         | Validated contact form, direct contact details, FAQ                                                                |

Plus a styled 404, `sitemap.xml`, `robots.txt`, a web manifest, and Open Graph
images generated per page at build time.

## Tech stack

| Tool                     | Version | Why                                                                                         |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------- |
| **Next.js** (App Router) | 16.4    | Static generation for every page, Server Components by default, Server Actions for the form |
| **TypeScript**           | 5       | `strict` on, no `any` anywhere in `src/`                                                    |
| **Tailwind CSS**         | 4.3     | CSS-first config — the whole design system is `@theme` tokens in one file                   |
| **Framer Motion**        | 14.3    | Scroll reveals, shared-element transitions, springs, scroll-linked progress                 |
| **Zod**                  | 4       | One validation schema shared by the browser and the server                                  |
| **react-hook-form**      | 7       | Uncontrolled inputs, so typing does not re-render the form                                  |
| **lucide-react**         | 1.58    | Icon set                                                                                    |
| **MongoDB driver**       | 7       | Enquiry persistence, no ODM — Zod already owns the schema                                   |
| **Vitest**               | 5       | 38 tests over validation, content integrity and the stored document shape                   |
| **Vercel**               | —       | Hosting                                                                                     |

## Running it locally

Requires Node 20.9 or newer.

```bash
git clone https://github.com/Fedy-Nouri/voltaris-energy.git
cd voltaris-energy
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are needed to run or build —
`NEXT_PUBLIC_SITE_URL` only affects canonical URLs and Open Graph image
resolution, and falls back to `http://localhost:3000`. See `.env.example`.

| Script              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Dev server                                                   |
| `npm run build`     | Production build                                             |
| `npm start`         | Serve the production build                                   |
| `npm run typecheck` | `tsc --noEmit`                                               |
| `npm run lint`      | ESLint                                                       |
| `npm test`          | Vitest                                                       |
| `npm run format`    | Prettier, including Tailwind class sorting                   |
| `npm run audit`     | Accessibility + responsive sweep (needs `npm start` running) |

CI runs typecheck, lint, tests and a build on every push and pull request.

> **One note on `package.json`:** there is an `overrides` entry pinning `ajv` to
> v6. Without it, npm 11 writes a lockfile that `npm ci` then rejects as
> out of sync — it resolves eslint's `ajv@^6` dependency one way for `install`
> and another for `ci`. Only eslint uses ajv, and it wants v6, so pinning it
> removes the ambiguity. Worth knowing because Vercel builds with `npm ci`.

## Project structure

```
src/
├─ app/                        routes, metadata, sitemap/robots/manifest, OG images
│  ├─ layout.tsx               fonts, metadataBase, header/footer, JSON-LD
│  ├─ template.tsx             page transition (re-mounts per navigation)
│  ├─ globals.css              the entire design system as Tailwind v4 @theme tokens
│  └─ contact/actions.ts       'use server' form handler
├─ components/
│  ├─ motion/                  Reveal, StaggerGroup, StaggerItem, AnimatedCounter,
│  │                           MagneticButton, SpotlightCard, MotionProvider
│  ├─ layout/                  SiteHeader, MobileNav, SiteFooter, PageHero, ScrollProgress, Logo
│  ├─ ui/                      Button, Card, Badge, Field, SpecTable, Container, …
│  └─ home/ products/ about/ case-studies/ contact/
├─ content/                    all copy, as typed data modules
├─ lib/                        seo.ts, schema.ts, validation.ts, motion.ts, icons.tsx, utils.ts
└─ types/                      shared content types
```

---

## Design decisions

### Content is data, not markup

Every product, case study, solution, team member and FAQ lives in a typed module
under `src/content/`. Pages map over that data; none of them hardcode copy.
Adding a seventh product to `content/products.ts` produces a card on the index,
a detail route, a comparison-table column, a sitemap entry and its own Open Graph
image — without editing a single page.

Icons are stored as **string keys** into a registry rather than as imported
components. That is not stylistic: a Lucide icon is a function, and React Server
Components cannot pass a function across the boundary into a Client Component.
Keying them keeps the content layer serialisable, and `keyof typeof icons` turns
a typo into a compile error.

### An instrumentation aesthetic

The brief asked for something suited to a B2B industrial audience, so the design
leans on the visual language of measurement equipment rather than generic SaaS:
monospaced tabular figures for every number, hairline rules, specification tables
instead of prose, small uppercase labels, and a CSS-drawn technical grid. Dark
hero and CTA bands bracket light content sections so the page has structure when
you scroll past it quickly.

The palette is a cool blue-green graphite with a single teal accent in two
weights — `volt-400` for dark backgrounds, `volt-700` for light — because no one
teal clears 4.5:1 contrast against both ends.

There is **no dark-mode toggle**, deliberately. This is an art-directed brand
site with a fixed light/dark section rhythm, not an application; a toggle would
mean maintaining two versions of a deliberate composition for no real benefit.

### The live dashboard

The hero panel is a simulated monitoring feed — a product illustration, not real
telemetry. Everything around the simulation is real engineering, though:

- Its opening frame comes from a **seeded PRNG**, so the server and the client
  produce byte-identical markup and hydration is clean. Calling `Math.random()`
  or reading the clock during render is the classic way to break this.
- Movement only begins after mount, and the interval is **torn down when the
  panel scrolls out of view** so it stops consuming battery.
- Chart bars animate `scaleY` rather than the `height` attribute: a transform
  stays on the compositor, and Framer Motion writes transforms into the
  server-rendered `style`, so the chart is drawn correctly before JS runs.
- Under reduced motion it freezes to a readable static frame.

### Page transitions use `template.tsx`, and don't animate out

A `layout` persists across navigations, so an entrance animation declared there
plays once per session. A `template` re-mounts on every navigation, which is
exactly the lifecycle an enter animation needs.

There is intentionally no exit animation. In the App Router the outgoing tree
unmounts as soon as the next route commits, so wrapping routes in
`AnimatePresence` produces either a flash of the old page or a stall before the
new one. An enter-only transition is the honest, jank-free option.
`AnimatePresence` is used where it genuinely works instead — the mobile drawer
and the case-study panel, whose unmounts this code actually controls.

### Smooth scrolling is opt-in, never global

There is no `html { scroll-behavior: smooth }` anywhere, on purpose. That
property applies to every programmatic scroll in the document — including the
`scrollIntoView()` calls the App Router makes while deciding where to put the
viewport after a navigation. Under `smooth` those become queued animations that
race each other, and the new page settles wherever the last one was heading
instead of at the top: click a header link and you land below the hero, on
roughly every other navigation.

Smooth scrolling for in-page anchors is restored by
`components/motion/SmoothAnchors.tsx`, a delegated click handler that animates
only on an explicit `#anchor` click. It honours reduced motion, and the skip
link opts out via `data-no-smooth` so focus still moves instantly.

Anchor offset is handled solely by `scroll-padding-top: 6rem` on `html`, which
`scrollIntoView` respects. Targets carry no `scroll-mt` of their own — setting
both stacked the offsets and landed headings 192px down instead of 96px.

### One validation schema, both sides

`lib/validation.ts` exports a single Zod schema. The browser uses it through
`zodResolver` so mistakes surface on blur; the Server Action imports the same
object and re-validates before doing anything. The client check is a
convenience — anyone can POST to the action directly — and sharing one
definition is what stops the two sides drifting apart.

The form keeps a real `action`, so it still submits without JavaScript. With JS
the submit is cancelled and the action is dispatched manually after validation,
because `preventDefault()` after an `await` is too late to stop a submit that
has already been dispatched.

There's also a honeypot field (hidden from sight, tab order and the
accessibility tree) and a small per-IP rate limit.

### Enquiries are stored in MongoDB

Validated enquiries are written to an `enquiries` collection for an admin
dashboard to read later. Each document carries `createdAt` (indexed
descending), `status: 'new'` and a `source` tag — the status field exists from
the first insert so that marking things read later needs no backfill.

**No IP address or user agent is stored.** The rate limiter derives an IP
transiently and discards it; persisting one would make this a store of personal
data with no present purpose, which sits badly against the GDPR claim on the
site's own FAQ page. A test asserts the document has exactly the expected keys,
so adding tracking fields later is a deliberate act rather than an accident.

The official **`mongodb` driver** rather than an ODM: Zod already validates
every enquiry before it reaches the database, so Mongoose would mean a second
schema that can drift from the first — and its model registry misbehaves on a
warm serverless instance. The client is cached on `globalThis`, because each
invocation can get a fresh module scope and would otherwise open a connection
per submission until Atlas' limit is reached.

**It degrades on purpose.** With no `MONGODB_URI` set the form still validates,
still confirms, and logs the enquiry instead of storing it — so a fresh clone
runs with no database. If the database is configured but unreachable, the
visitor gets a generic error rather than a field-level one, because a database
outage is not something they can fix by editing a field.

### SEO

Every page builds its metadata through one `buildMetadata()` helper, so none can
ship without a canonical URL, an Open Graph block or a Twitter card. Open Graph
images are **generated at build time** by `next/og` from the same content the
pages render, so a product's social card can never disagree with its
specifications. JSON-LD lives in `lib/schema.ts` and is kept separate from meta
tags because the two answer different questions — one describes the page, the
other describes the thing the page is about.

### Accessibility

- One `h1` per page and no skipped heading levels, including visually hidden
  `h2`s where the design has no visible section heading
- A single `<MotionConfig reducedMotion="user">` plus a CSS reset means every
  animation degrades when the OS asks for less motion — and the components that
  need to change _behaviour_ rather than just stop moving never render a
  different tree, which would be a hydration mismatch
- Skip-to-content link, visible focus rings, Escape-to-close and focus return on
  both the mobile drawer and the case-study panel
- Real `<table>` markup for specifications, `<figure>`/`<figcaption>` for quotes
- A `<noscript>` rule reinstates any element an entrance animation would
  otherwise leave at `opacity: 0`

Verified at 375 / 768 / 1280 with no horizontal overflow and a clean console in
both normal and reduced-motion modes.

### Things I'd do next

- Move the rate limiter to Vercel KV — the in-memory map only covers one warm
  serverless instance, which is noted in the code
- Give case studies real routes if they ever needed to rank on their own terms;
  today their full text reaches crawlers as `articleBody` in JSON-LD
- Add Playwright coverage for the form and the drawer; the current tests cover
  the schema and content integrity, not the components
