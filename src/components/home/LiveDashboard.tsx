'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { clamp, formatNumber, seededRandom } from '@/lib/utils';
import { EASE_OUT_QUINT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Simulation parameters                                                      */
/* -------------------------------------------------------------------------- */

/** Number of bars in the load profile. */
const WINDOW = 40;
/** Milliseconds between samples. Slow enough to read, fast enough to feel live. */
const TICK_MS = 1600;
/** Contracted demand limit in kW, used for the headroom gauge. */
const DEMAND_LIMIT = 1000;
/** Chart geometry, in viewBox units. */
const CHART = { width: 480, height: 150, gap: 2.2 };

/**
 * Fixed seed for the initial series.
 *
 * This is the detail that makes the whole widget safe to server-render.
 * Generating the first frame from a seeded PRNG means the server and the
 * client produce byte-identical markup, so React finds what it expects during
 * hydration. Calling `Math.random()` or reading the clock during render would
 * produce different HTML in each place and trip a hydration mismatch — so both
 * only happen inside the interval below, which never runs on the server.
 */
const SEED = 20260216;

/** Placeholder clock shown until the client takes over after mount. */
const INITIAL_CLOCK = '--:--:--';

/** Circuits shown in the breakdown, as a share of total site load. */
const CIRCUITS = [
  { name: 'Compressor hall A', share: 0.38, status: 'nominal' },
  { name: 'Chiller plant 2', share: 0.3, status: 'nominal' },
  { name: 'Packing line 4', share: 0.17, status: 'nominal' },
  { name: 'HVAC east', share: 0.115, status: 'elevated' },
  { name: 'Lighting & aux', share: 0.035, status: 'nominal' },
] as const;

/**
 * Builds the opening load profile.
 *
 * Shaped like a real industrial day — a low overnight base, a ramp as shifts
 * start, and a plateau — rather than pure noise, because a flat random series
 * looks synthetic next to copy about load curves.
 */
function createInitialSeries(): number[] {
  const random = seededRandom(SEED);

  return Array.from({ length: WINDOW }, (_, index) => {
    const progress = index / (WINDOW - 1);
    // Base curve: overnight trough rising to a working-hours plateau.
    const base = 480 + 360 * Math.sin(progress * Math.PI * 0.86);
    const noise = (random() - 0.5) * 70;
    return Math.round(clamp(base + noise, 320, DEMAND_LIMIT - 40));
  });
}

/**
 * Advances the series by one sample using a mean-reverting random walk.
 *
 * Only ever called from inside the interval, i.e. after mount on the client,
 * which is why using `Math.random()` here is safe.
 */
function advanceSeries(previous: number[]): number[] {
  const last = previous[previous.length - 1];
  const target = 790;
  // Pull gently back towards the mean so the series cannot wander off-scale.
  const reversion = (target - last) * 0.08;
  const jitter = (Math.random() - 0.5) * 95;
  const next = Math.round(clamp(last + reversion + jitter, 340, DEMAND_LIMIT - 20));

  return [...previous.slice(1), next];
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Simulated live monitoring panel for the home page hero.
 *
 * The figures are generated locally — it is a product illustration, not a real
 * telemetry feed — but every behaviour around it is real: it server-renders,
 * hydrates cleanly, stops consuming CPU when scrolled out of view, and freezes
 * to a readable static frame when the visitor has asked for reduced motion.
 */
export function LiveDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /**
   * Deliberately not `once: true`. Unlike a scroll reveal, this needs to know
   * when the panel *leaves* the viewport as well, so the interval can be torn
   * down and stop burning battery while the visitor reads further down the page.
   */
  const isInView = useInView(containerRef, { margin: '-80px 0px -80px 0px' });

  const [samples, setSamples] = useState<number[]>(createInitialSeries);
  const [clock, setClock] = useState(INITIAL_CLOCK);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    /*
     * The clock is set from a zero-delay timeout rather than straight in the
     * effect body. Reading `Date` during render or in the render-blocking part
     * of an effect would put a client-only value into the first commit, which
     * is both a hydration hazard and the cascading re-render that
     * `react-hooks/set-state-in-effect` exists to prevent. Deferring by one
     * macrotask puts the real time on screen imperceptibly later, after
     * hydration has settled.
     */
    const firstTick = setTimeout(() => setClock(formatClock(new Date())), 0);

    const interval = setInterval(() => {
      setSamples(advanceSeries);
      setClock(formatClock(new Date()));
    }, TICK_MS);

    return () => {
      clearTimeout(firstTick);
      clearInterval(interval);
    };
  }, [isInView, prefersReducedMotion]);

  /* ---- Derived figures ---- */
  const current = samples[samples.length - 1];
  const previous = samples[samples.length - 2];
  const peak = Math.max(...samples);
  const trendUp = current >= previous;
  const headroom = ((DEMAND_LIMIT - current) / DEMAND_LIMIT) * 100;
  const scaleMax = DEMAND_LIMIT;

  const barWidth = CHART.width / WINDOW - CHART.gap;

  return (
    <div
      ref={containerRef}
      className="rounded-panel bg-ink-900/80 ring-1 ring-white/10 backdrop-blur-xl"
      /* Decorative data visualisation; the figures are summarised in text below. */
      role="img"
      aria-label={`Illustrative energy monitoring dashboard showing a site load of ${current} kilowatts against a ${DEMAND_LIMIT} kilowatt demand limit.`}
    >
      {/* ---- Title bar ---- */}
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              'text-volt-400 size-1.5 shrink-0 rounded-full bg-current',
              isInView && !prefersReducedMotion && 'animate-led',
            )}
            aria-hidden
          />
          <span className="text-eyebrow text-volt-400 shrink-0 font-mono font-medium uppercase">
            Live
          </span>
          <span className="text-ink-600" aria-hidden>
            /
          </span>
          <span className="text-ink-300 truncate text-xs font-medium">
            Hartwell Foods · Site 04
          </span>
        </div>
        <span className="text-ink-500 tabular shrink-0 font-mono text-xs">{clock}</span>
      </div>

      <div className="p-4 sm:p-5">
        {/* ---- Headline reading + gauge ---- */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow text-ink-500 font-mono uppercase">Total site load</p>
            <p className="mt-1.5 flex items-baseline gap-2">
              <motion.span
                // Keying on the value makes each new sample a fresh element, so
                // Framer Motion plays the entrance again instead of treating it
                // as the same node with changed text.
                key={current}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_QUINT }}
                className="tabular font-mono text-3xl font-semibold text-white sm:text-4xl"
              >
                {formatNumber(current)}
              </motion.span>
              <span className="text-ink-400 font-mono text-sm">kW</span>
              <span
                className={cn(
                  'flex items-center gap-0.5 font-mono text-xs',
                  trendUp ? 'text-signal-400' : 'text-volt-400',
                )}
              >
                {trendUp ? (
                  <ArrowUpRight className="size-3.5" aria-hidden />
                ) : (
                  <ArrowDownRight className="size-3.5" aria-hidden />
                )}
                {formatNumber(Math.abs(current - previous))}
              </span>
            </p>
          </div>

          <HeadroomGauge headroom={headroom} />
        </div>

        {/* ---- Load profile ---- */}
        <div className="mt-5">
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="h-28 w-full sm:h-32"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* Demand limit reference line. */}
            <line
              x1="0"
              x2={CHART.width}
              y1={CHART.height * 0.06}
              y2={CHART.height * 0.06}
              stroke="currentColor"
              className="text-signal-400/35"
              strokeWidth="1"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />

            {samples.map((value, index) => {
              const ratio = value / scaleMax;
              // The most recent few bars are brighter, so the eye is drawn to
              // the live end of the series.
              const recency = index / (WINDOW - 1);

              return (
                <motion.rect
                  /*
                   * Index, not value, as the key: each bar is a fixed slot in
                   * the chart that animates to a new height when the window
                   * shifts. Keying on value would remount every bar each tick
                   * and lose the animation entirely.
                   */
                  key={index}
                  x={index * (CHART.width / WINDOW)}
                  y={0}
                  width={barWidth}
                  height={CHART.height}
                  /*
                   * Full-height bars scaled from their base, rather than
                   * animated `height`/`y` attributes. Two reasons: `scaleY` is a
                   * transform so the browser can keep it on the compositor, and
                   * Framer Motion writes transforms into the server-rendered
                   * `style` attribute — which means the chart is drawn correctly
                   * in the initial HTML instead of appearing only once JS runs.
                   */
                  style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                  initial={{ scaleY: ratio }}
                  animate={{ scaleY: ratio }}
                  transition={{ duration: TICK_MS / 1000, ease: 'linear' }}
                  className={cn(
                    recency > 0.9
                      ? 'fill-volt-300'
                      : recency > 0.72
                        ? 'fill-volt-400'
                        : 'fill-volt-500/55',
                  )}
                />
              );
            })}
          </svg>

          <div className="text-eyebrow text-ink-600 mt-2 flex justify-between font-mono uppercase">
            <span>−10 min</span>
            <span>peak {formatNumber(peak)} kW</span>
            <span>now</span>
          </div>
        </div>

        {/* ---- Circuit breakdown ---- */}
        <div className="mt-5 border-t border-white/8 pt-4">
          <p className="text-eyebrow text-ink-500 mb-3 font-mono uppercase">By circuit</p>
          <ul className="flex flex-col gap-2.5">
            {CIRCUITS.map((circuit) => {
              const load = Math.round(current * circuit.share);
              // Width relative to the largest circuit, so the bars fill the row.
              const relative = (circuit.share / CIRCUITS[0].share) * 100;

              return (
                <li key={circuit.name} className="flex items-center gap-3 text-xs">
                  <span className="text-ink-300 w-28 shrink-0 truncate sm:w-32">
                    {circuit.name}
                  </span>

                  {/*
                    A plain element with an inline width rather than a motion
                    one. Each circuit's share is constant, so there is nothing
                    for a live animation to express — and a `width: 0` initial
                    state would mean these bars rendered empty in the server
                    HTML. The whole panel already animates in as one unit.
                  */}
                  <span className="bg-ink-800 h-1.5 flex-1 overflow-hidden rounded-full">
                    <span
                      style={{ width: `${relative}%` }}
                      className={cn(
                        'block h-full rounded-full',
                        circuit.status === 'elevated' ? 'bg-signal-400' : 'bg-volt-400/80',
                      )}
                    />
                  </span>

                  <span className="text-ink-200 tabular w-16 shrink-0 text-right font-mono">
                    {formatNumber(load)} kW
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---- Secondary readings ---- */}
        <dl className="mt-4 grid grid-cols-2 gap-px border-t border-white/8 pt-4 sm:grid-cols-4">
          <Reading label="Power factor" value="0.96" />
          <Reading label="THD" value="2.4%" />
          <Reading label="kWh today" value="9,840" />
          <Reading label="Cost today" value="€1,247" />
        </dl>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Arc gauge for remaining demand headroom.
 *
 * Framer Motion's `pathLength` is normalised to 0–1 and handles the
 * `stroke-dasharray` arithmetic itself, which is far less error-prone than
 * computing arc length and animating `stroke-dashoffset` by hand.
 */
function HeadroomGauge({ headroom }: { headroom: number }) {
  const ratio = clamp(headroom / 100, 0, 1);

  return (
    <div className="relative shrink-0">
      <svg viewBox="0 0 80 54" className="w-20 sm:w-24" aria-hidden>
        {/* Track. */}
        <path
          d="M8 48a32 32 0 1 1 64 0"
          fill="none"
          stroke="currentColor"
          className="text-white/10"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value. */}
        <motion.path
          d="M8 48a32 32 0 1 1 64 0"
          fill="none"
          stroke="currentColor"
          className={ratio < 0.15 ? 'text-alert-400' : 'text-volt-400'}
          strokeWidth="6"
          strokeLinecap="round"
          /*
           * `initial` is the current ratio rather than 0, so the arc is drawn
           * at the right length in the server HTML instead of starting empty.
           * Subsequent samples still animate, because `animate` takes over once
           * the value changes.
           */
          initial={{ pathLength: ratio }}
          animate={{ pathLength: ratio }}
          transition={{ duration: 0.9, ease: EASE_OUT_QUINT }}
        />

        {/*
          The reading sits inside the arc's opening rather than below the
          whole component: the arc ends at y=48 of a 54-unit viewBox, so there
          is a natural well between its two tips for the figure to occupy.
        */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          className="fill-white font-mono text-[13px] font-semibold"
        >
          {headroom.toFixed(1)}%
        </text>
      </svg>

      <p className="text-eyebrow text-ink-500 mt-1 text-center font-mono uppercase">Headroom</p>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1 first:pl-0">
      <dt className="text-eyebrow text-ink-500 font-mono uppercase">{label}</dt>
      <dd className="text-ink-100 tabular mt-1 font-mono text-sm font-medium">{value}</dd>
    </div>
  );
}
