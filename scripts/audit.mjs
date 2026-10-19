/**
 * Accessibility and responsive audit.
 *
 *   npm run build && npm start      # in one terminal
 *   npm run audit                   # in another
 *
 * Drives headless Chrome over the DevTools Protocol and checks every route at
 * three widths for the things that are easy to break and tedious to catch by
 * eye:
 *
 *   - horizontal overflow (the classic mobile grid bug)
 *   - exactly one `h1`, and no skipped heading levels
 *   - every form control labelled, every control with an accessible name
 *   - text colour contrast against its effective background (WCAG AA)
 *
 * The contrast check exists because an earlier version of this script passed
 * clean while four tokens on the dark surfaces were failing AA — one as low as
 * 1.66:1. Checking structure but not colour gave false confidence.
 *
 * Not wired into CI: it needs a built app, a running server and a real Chrome,
 * which makes it slow and flaky in a hosted runner. It is a local gate run
 * before shipping visual changes.
 */
import { spawn } from 'node:child_process';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const PORT = Number(process.env.CDP_PORT ?? 9444);
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ROUTES = [
  '/',
  '/products',
  '/products/vx-200-energy-meter',
  '/solutions',
  '/case-studies',
  '/about',
  '/contact',
];
const WIDTHS = [375, 768, 1280];

/* -------------------------------------------------------------------------- */
/* In-page audit                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Runs inside the page. Returns a JSON string rather than an object so it
 * survives `Runtime.evaluate` without needing deep serialisation.
 */
const AUDIT = `(async () => {
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
  /* ---- contrast helpers ---- */
  const channel = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const contrast = (a, b) => {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const parseRgb = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(',').map((n) => parseFloat(n));
    return { rgb: parts.slice(0, 3), alpha: parts.length > 3 ? parts[3] : 1 };
  };
  /** Composites a translucent colour over what sits behind it. */
  const over = (fg, bg, alpha) => fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));

  /**
   * Finds what is actually painted behind a piece of text.
   *
   * Deliberately uses \`elementsFromPoint\` rather than walking ancestors. The
   * ancestor chain lies whenever an element overlays something it is not
   * descended from — the fixed header sits above the dark hero but is a sibling
   * of it, so an ancestor walk reports the white page background and every
   * header link looks like a 1:1 failure. Hit-testing returns the real visual
   * stack, which is what the eye sees.
   */
  function effectiveBackground(el) {
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 1);
    const y = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);

    const stack = document.elementsFromPoint(x, y);
    const start = stack.indexOf(el);
    // Only consider what is at or behind the text itself.
    const behind = start === -1 ? stack : stack.slice(start);

    const layers = [];
    for (const node of behind) {
      const cs = getComputedStyle(node);
      // A gradient or image behind the text means the colour is not a single
      // value; reporting a number would be misleading, so skip the element.
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const parsed = parseRgb(cs.backgroundColor);
      if (parsed && parsed.alpha > 0) {
        layers.push(parsed);
        if (parsed.alpha === 1) break;
      }
    }

    let result = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) {
      result = layers[i].alpha === 1 ? layers[i].rgb : over(layers[i].rgb, result, layers[i].alpha);
    }
    return result;
  }

  const docWidth = document.documentElement.clientWidth;

  /* ---- horizontal overflow ---- */
  const overflowing = [];
  document.querySelectorAll('*').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.right > docWidth + 1) {
      if (getComputedStyle(el).position === 'fixed') return;
      let parent = el.parentElement, clipped = false;
      while (parent) {
        const cs = getComputedStyle(parent);
        if (['hidden', 'auto', 'scroll', 'clip'].includes(cs.overflowX) || cs.overflow === 'hidden') { clipped = true; break; }
        parent = parent.parentElement;
      }
      if (!clipped) overflowing.push(el.tagName + '.' + String(el.className).slice(0, 60));
    }
  });

  /* ---- headings ---- */
  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  let headingSkips = 0;
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) headingSkips++;

  /* ---- labels and accessible names ---- */
  const unlabelled = [...document.querySelectorAll('input,textarea,select')].filter(
    (el) => el.type !== 'hidden' && !el.labels?.length && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'),
  ).length;
  const nameless = [...document.querySelectorAll('button,a')].filter(
    (el) => !el.textContent.trim() && !el.getAttribute('aria-label') && !el.querySelector('[aria-label]'),
  ).length;

  /* ---- contrast ----
     Measured in viewport slices. Hit-testing only works for coordinates inside
     the viewport, so an element below the fold would otherwise be tested
     against whatever happens to sit at the clamped coordinate — which produced
     confident nonsense like white-on-white at 1:1. */
  const contrastFailures = [];
  const seen = new Set();

  const candidates = [...document.querySelectorAll('*')].filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1),
  );

  const pageHeight = document.body.scrollHeight;
  const step = Math.floor(window.innerHeight * 0.75);

  for (let y = 0; y < pageHeight; y += step) {
    window.scrollTo(0, y);
    await nextFrame();

    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      // Only elements fully inside the viewport right now can be hit-tested.
      if (rect.top < 0 || rect.bottom > window.innerHeight) continue;
      if (rect.width < 2 || rect.height < 2) continue;   // sr-only and friends

      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (parseFloat(cs.opacity) < 0.95) continue;       // mid-animation, not a real state

      // SVG text takes its colour from \`fill\`, not \`color\` — reading \`color\`
      // compares an inherited value that is never painted, and reports
      // confident nonsense for the dashboard gauge.
      const isSvg = el.ownerSVGElement !== undefined && el.ownerSVGElement !== null;
      const colourSource = isSvg ? cs.fill : cs.color;
      const classes = el.getAttribute('class') ?? '';

      const key = colourSource + '|' + classes.slice(0, 40);
      if (seen.has(key)) continue;

      const fg = parseRgb(colourSource);
      const bg = effectiveBackground(el);
      if (!fg || !bg) continue;
      const colour = fg.alpha === 1 ? fg.rgb : over(fg.rgb, bg, fg.alpha);

      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      // WCAG "large text": >=24px, or >=18.66px when bold.
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = isLarge ? 3 : 4.5;
      const ratio = contrast(colour, bg);

      seen.add(key);
      if (ratio < required) {
        contrastFailures.push({
          text: el.textContent.trim().slice(0, 32),
          cls: classes.slice(0, 48),
          ratio: +ratio.toFixed(2),
          required,
          size: Math.round(size),
        });
      }
    }
  }

  window.scrollTo(0, 0);

  return JSON.stringify({
    overflow: document.documentElement.scrollWidth > docWidth + 1,
    overflowing: overflowing.slice(0, 3),
    h1Count: document.querySelectorAll('h1').length,
    headingSkips,
    unlabelled,
    nameless,
    contrastFailures,
  });
})()`;

/* -------------------------------------------------------------------------- */
/* CDP plumbing                                                               */
/* -------------------------------------------------------------------------- */

const chrome = spawn(CHROME, [
  '--headless',
  '--disable-gpu',
  `--remote-debugging-port=${PORT}`,
  '--no-first-run',
  `--user-data-dir=/tmp/voltaris-audit-${PORT}`,
  'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);

const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let messageId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
const send = (method, params = {}) => {
  const id = ++messageId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve) => pending.set(id, resolve));
};

await send('Page.enable');
await send('Runtime.enable');

let failures = 0;

for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  for (const route of ROUTES) {
    await send('Page.navigate', { url: BASE + route });
    await sleep(1500);
    // Scroll through so `whileInView` reveals have settled before measuring.
    await send('Runtime.evaluate', {
      expression: `(async()=>{const h=document.body.scrollHeight;
        for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45))}
        window.scrollTo(0,0);await new Promise(r=>setTimeout(r,250))})()`,
      awaitPromise: true,
    });

    const response = await send('Runtime.evaluate', {
      expression: AUDIT,
      returnByValue: true,
      awaitPromise: true,
    });
    const result = JSON.parse(response.result.result.value);

    const problems = [];
    if (result.overflow) problems.push('horizontal overflow');
    if (result.h1Count !== 1) problems.push(`${result.h1Count} h1 elements`);
    if (result.headingSkips) problems.push(`${result.headingSkips} heading skips`);
    if (result.unlabelled) problems.push(`${result.unlabelled} unlabelled inputs`);
    if (result.nameless) problems.push(`${result.nameless} controls without a name`);
    if (result.contrastFailures.length)
      problems.push(`${result.contrastFailures.length} contrast failures`);

    if (problems.length) {
      failures++;
      console.log(`${String(width).padStart(4)}  ${route.padEnd(32)} ✗ ${problems.join(', ')}`);
      result.overflowing.forEach((o) => console.log(`         overflow: ${o}`));
      result.contrastFailures.forEach((c) =>
        console.log(
          `         contrast ${c.ratio}:1 (needs ${c.required}) ${c.size}px "${c.text}" — ${c.cls}`,
        ),
      );
    } else {
      console.log(`${String(width).padStart(4)}  ${route.padEnd(32)} ✓`);
    }
  }
}

console.log(
  failures === 0
    ? `\nAll ${ROUTES.length * WIDTHS.length} page/width combinations passed.`
    : `\n${failures} combination(s) failed.`,
);

ws.close();
chrome.kill();
process.exit(failures === 0 ? 0 : 1);
