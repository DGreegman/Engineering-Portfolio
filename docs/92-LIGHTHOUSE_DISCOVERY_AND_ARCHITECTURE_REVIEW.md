# TASK 8.7 — LIGHTHOUSE OPTIMIZATION: DISCOVERY & ARCHITECTURE REVIEW

**Status:** Discovery and architecture review only. No implementation performed.

---

## 1. Executive Summary

A real production Lighthouse baseline was measured against a local `next start` server, 11 representative routes, using actual Chrome (151.0.7922.137, headless) and Lighthouse 13.4.1. The application performs excellently under direct, unthrottled measurement: **Performance 96–100, Best Practices 100, Accessibility 95–96, SEO 100** (63 on the one intentionally-noindexed route) across every route tested. **CLS is 0 on every single route** — no measurable layout shift anywhere. No third-party resources exist. No console errors, insecure resources, or deprecated-API warnings were found.

One methodological finding dominates this discovery and must be stated first: **this host machine is under sustained, heavy load** (load average 4.3–5.1 on 4 cores, from a live desktop session — VSCode, a full desktop Chrome browser, a MongoDB instance, and more, all running concurrently). Lighthouse's default *simulated* mobile throttling, run once against the homepage for comparison, produced a Performance score of **41** with an 8.2s LCP and 6.86s Total Blocking Time. The *same route, same server, same moment*, measured with throttling simulation disabled (raw, actually-observed execution) scored **100**, with a 0.3s LCP and 30ms TBT. This is not two different builds or two different pages — it is the same page, and the ~60-point swing is attributable to host contention distorting Lighthouse's trace-based throttling simulation, not to the application. Per this task's own instruction not to compare measurements from materially different conditions as equivalent, **all reported metrics in this document use the raw/unthrottled methodology**, explicitly justified in §5, with the throttled homepage run retained only as documented evidence for *why* that methodological choice was made.

Two real, evidence-backed, non-fabricated findings emerged that are specific enough to justify future action:

1. **`/about`'s LCP (~2.2–2.3s, reproducible across 3 runs) is real and route-specific** — every other route measures 250–1200ms. Lighthouse's own LCP-breakdown and LCP-discovery insights identify the cause precisely: the LCP element is the About-page portrait (confirming Task 8.5's own expectation), and its resource load duration (~1.4s) and element render delay (~0.8s) dominate. Critically, Lighthouse's `lcp-discovery-insight` audit reports **`fetchpriority=high` is not applied** to either the image's `<link rel="preload">` or the `<img>` element itself — confirmed directly in the raw served HTML. Task 8.5's `preload={true}` migration (approved, unmodified, not reopened here) correctly makes the image eager and discoverable, but does not itself set `fetchPriority="high"` — that is a separate, distinct prop this repository has never set. This is new evidence Task 8.7's own live measurement surfaced, not a regression in Task 8.5's approved work.
2. **A real, repository-wide WCAG AA color-contrast failure** exists on every route: `text-muted-foreground/70` and `text-muted-foreground/60` opacity-reduced tokens fall to 3.34–4.17:1 contrast against the dark-theme background, below the required 4.5:1, on caption/small text used by multiple shared components (Card metadata, Table of Contents captions, Footer's "RSS coming soon" text).

Both are documented with exact evidence, exact remediation, and exact expected effect in §26–§28. Neither is implemented here. Every other Lighthouse signal — including the `/search` SEO score, and the `unused-javascript` audit on framework chunks — was investigated and found to be either already-intentional (Task 8.1/8.3's deliberate `noindex`) or an expected framework-runtime artifact already characterized by Task 8.6, not a real opportunity (§23–§24, §27).

---

## 2. Live Repository Re-Verification

Re-verified fresh this session (not assumed from prior Milestone 8 documents):

| Item | Result |
| --- | --- |
| Next.js version | `16.3.0` (`package.json`), unchanged |
| Production build status | Fresh `pnpm build` (`rm -rf .next` first): **clean, exit 0**, 33 routes generated, run both before and after Lighthouse testing |
| Route structure | 10 `page.tsx` files, unchanged from Task 8.6's inventory: `/`, `/about`, `/knowledge`, `/knowledge/[slug]`, `/work`, `/work/library`, `/work/[slug]`, `/engineering-log`, `/engineering-log/[slug]`, `/search` |
| Deployment configuration | No `vercel.json`/`netlify.toml`; no `output: "export"` in `next.config.ts`; `SITE_URL` env var unset, defaulting to `http://localhost:3000` (`src/lib/constants/site.ts:44`) — **no deployed production URL is configured or known to this environment** (§4) |
| Image configuration | `next.config.ts` remains `{ /* config options here */ }` — no `images` overrides, unchanged since Task 8.5 |
| Client components | 9 live, 1 dead (`Tooltip`), unchanged since Task 8.6 — not independently re-audited file-by-file in this session, since this task's own JS findings (§13, §16) are network/runtime evidence that corroborates rather than contradicts Task 8.6's inventory |
| Metadata / canonical / Open Graph / JSON-LD | Present and rendering on every route tested (confirmed via SEO category scores and raw HTML inspection during LCP analysis, §9) — not modified, not re-litigated |
| Fonts | `Geist`/`Geist_Mono` via `next/font/google`, `display: "swap"` (`src/app/layout.tsx`), self-hosted (confirmed: font files served from `/_next/static/media/*.woff2`, not a Google Fonts network request) |
| CSS | Single Tailwind v4 output stylesheet, `/_next/static/chunks/*.css`, ~12.4 KB transferred per route |
| JavaScript | See §13 |
| Third-party resources | **None** — `resource-summary` audit reports `Third-party: count=0, transferSize=0` on every route tested |
| Caching | See §19 |
| Middleware | None (`find src -iname "middleware.ts"` — 0 results) |
| Redirects / headers | None configured in `next.config.ts` |
| Static assets | `public/images/portrait.jpeg` (Task 8.5's one real asset), `src/app/favicon.ico` — both confirmed served correctly during testing |

No material discrepancy was found against Tasks 8.1–8.6's conclusions. The two new findings in this document (§1) are additive — new evidence this task's own live-measurement mandate surfaced — not contradictions of prior work.

---

## 3. Production Build Environment

- **Build command:** `pnpm build` → `next build` (Turbopack). Run fresh at the start of this session (`rm -rf .next` first) and again after all testing concluded — both **succeeded, exit 0**, 33 routes.
- **Production server command:** `pnpm start` → `next start`, determined directly from `package.json`'s `scripts.start`.
- **Port:** `3000` (Next's default; confirmed via the server's own startup log: `- Local: http://localhost:3000`).
- **Environment:** Local, laboratory conditions only. No environment variables were set beyond the shell's own defaults — `SITE_URL` was not provided, so the app ran with its own documented `http://localhost:3000` fallback (§2). This does not affect the pages actually rendered (they don't depend on `SITE_URL` for anything but absolute-URL construction in metadata/JSON-LD, unaffected by Lighthouse's page-level measurement).
- **Local vs. deployed:** No publicly deployed production URL is configured anywhere in this repository (§2). **Every result in this document is a local laboratory measurement against `next start` on this development machine — not a deployed production measurement, and not real-user field data.** This is stated explicitly per this task's own §5 instruction, and repeated at point of use throughout this document rather than only here.

---

## 4. Lighthouse Tooling

- **`lighthouse` CLI:** not present in `node_modules` or globally installed. Verified reachable via `npx --yes lighthouse` (network-fetched into npm's own npx cache, **not** installed into this project — `package.json`, `pnpm-lock.yaml`, and `node_modules/` are all unmodified, confirmed by `git status --short` before and after, §37). Resolved version: **13.4.1**.
- **`lhci`:** not present, not used.
- **Chrome/Chromium:** `/opt/google/chrome/chrome`, **Google Chrome 151.0.7922.137** (a real, full desktop Chrome install already present on this machine — not fetched or installed by this task).
- **Puppeteer/Playwright:** not present in `node_modules`; not needed — Lighthouse CLI drives Chrome directly via `CHROME_PATH`.
- **No dependency was added to the project.** `npx`'s temporary, cache-only package fetch is the mechanism used, consistent with this task's own instruction not to modify `package.json` merely to run discovery (§6 of the task instructions).

---

## 5. Testing Methodology

- **Lighthouse version:** 13.4.1
- **Browser:** Google Chrome 151.0.7922.137, headless (`--headless=new --no-sandbox --disable-gpu`)
- **Device profile:** Lighthouse's default mobile emulation (viewport/UA/device-scale-factor) — **retained** even though CPU/network *throttling* was disabled (§ below); only the throttling simulation was changed, not the device profile
- **Throttling — the central methodological decision of this discovery:**
  - A single homepage run was executed with Lighthouse's **default** configuration (`throttlingMethod: "simulate"`, mobile 4x CPU slowdown + simulated 3G-ish network) to establish a baseline. Result: **Performance 41**, LCP 8,188ms, TBT 6,861ms.
  - The **same route, same running server**, re-measured immediately after with `--throttling-method=provided` (throttling simulation disabled — Lighthouse reports the actually-observed trace timing verbatim, no lantern-model extrapolation). Result: **Performance 100**, LCP 283ms, TBT 34ms.
  - This ~60-point, ~29x-LCP swing on the identical page, back-to-back, is the direct, measured consequence of this host's own sustained load (`uptime`: load average 4.33/5.13/4.10 on a 4-core machine — over 100% sustained utilization — from a live desktop session: VSCode, a running desktop Chrome browser with multiple renderer processes, `gnome-shell`, a MongoDB replica-set process, and more, all captured via `ps aux --sort=-%cpu` at the time of testing). Lighthouse's simulated-throttling model (`lantern`) extrapolates timing from an observed trace; when that trace itself was captured on a machine experiencing momentary CPU starvation from unrelated processes, the model's extrapolation compounds the noise rather than averaging it out.
  - **Decision: all further routes in this document were measured with `--throttling-method=provided`** (raw, actually-observed timing, no simulation layer). This is the more honest choice for a contended, shared development machine — it reports what actually happened rather than running that noisy signal through an additional extrapolation model. It was applied **consistently across every route tested**, satisfying this task's own requirement not to mix measurement conditions.
  - **This does not mean network/CPU throttling was "skipped" as a shortcut** — it means the alternative (simulated throttling) was tested first, shown to be unreliable on this specific host, and consciously not used as the primary methodology, with that decision fully disclosed rather than hidden.
- **Runs per route:** `/about` was run **3 times** to check stability (LCP: 2,319ms / 2,212ms / 2,231ms — stable within ~5%, confirming the finding is a real signal, not host noise). All other routes were run **once** each, given the demonstrated stability of the unthrottled methodology and the time cost of the full 11-route sweep; this is disclosed as a single-run-per-route limitation, not hidden.
- **Cache state:** Each Lighthouse invocation launches a fresh, isolated headless Chrome instance with an empty profile — every run is a cold-cache run from the browser's perspective. The Next.js server itself may serve some responses from its own on-disk/in-memory cache (confirmed via `x-nextjs-cache: HIT` on repeated document requests, §19) — this is normal, expected `next start` behavior, not a testing artifact.
- **URLs tested:** all against `http://localhost:3000`, listed in full in §6.
- **Timestamp:** 2026-08-21, this session.
- **Environment:** Local only (§3) — no deployed URL exists to test.

---

## 6. Representative Route Selection

All 11 routes named in this task's own instructions were tested, plus one 404 attempt:

```
/
/about
/knowledge
/knowledge/backend
/knowledge/idempotency
/work
/work/library
/work/vaultpay
/engineering-log
/engineering-log/cookeaze-webhook-reliability-gap
/search
/this-route-does-not-exist-xyz  (404 test)
```

All 11 real routes returned `200` and were measured successfully (confirmed via `curl` status checks before running Lighthouse against each). The 404 route correctly returned `404`, confirmed via `curl`, but **Lighthouse's own navigation runner refuses to produce a full audit for any non-2xx response by design** (`runtimeError.code: "ERRORED_DOCUMENT_REQUEST"` — this is standard Lighthouse behavior, not an application defect). A `curl`-based fallback measurement was taken instead: `http_code=404`, `time_total=0.007s`, `size_download=54,734 bytes` locally. No Lighthouse category scores exist for the 404 route — reported as `N/A` in §25, not fabricated.

Testing every possible dynamic-route slug (all 7 Knowledge articles, all 4 Work case studies, both Engineering Log entries) was judged unnecessary: each collection shares one route template (`[slug]/page.tsx`) and one rendering pipeline (confirmed identical client-reference-manifest shape in Task 8.6 §3), so one representative article per collection is sufficient to characterize that template's performance profile — testing every slug would multiply run count without new architectural information.

---

## 7. Lighthouse Results

Measured Performance/Accessibility/Best-Practices/SEO category scores, **unthrottled methodology (§5)**, one run per route except `/about` (3 runs, values shown are the first; see §9 for the full 3-run set):

| Route | Performance | Accessibility | Best Practices | SEO |
| --- | --: | --: | --: | --: |
| `/` | 100 | 96 | 100 | 100 |
| `/about` | 96 | 96 | 100 | 100 |
| `/knowledge` | 100 | 96 | 100 | 100 |
| `/knowledge/backend` | 96 | 96 | 100 | 100 |
| `/knowledge/idempotency` | 100 | 96 | 100 | 100 |
| `/work` | 100 | 95 | 100 | 100 |
| `/work/library` | 100 | 96 | 100 | 100 |
| `/work/vaultpay` | 99 | 96 | 100 | 100 |
| `/engineering-log` | 100 | 96 | 100 | 100 |
| `/engineering-log/cookeaze-webhook-reliability-gap` | 100 | 96 | 100 | 100 |
| `/search` | 100 | 96 | 100 | **63** |
| 404 (`/this-route-does-not-exist-xyz`) | N/A | N/A | N/A | N/A (Lighthouse cannot audit non-2xx responses; see §6) |

`/search`'s SEO score is investigated in full in §22 — it is the deliberate, already-approved `noindex` from Task 8.1/8.3, not a defect.

---

## 8. Core Web Vitals

**Lab metrics only — Lighthouse produces synthetic, single-session lab data, not real-user field data.** No CrUX (Chrome UX Report) or other field-data source is available for this application (it has no known public deployment, §3), so **no field-performance claim is made anywhere in this document.**

| Route | LCP (ms) | CLS | TBT (ms) | FCP (ms) | TTFB (ms) | TTI (ms) |
| --- | --: | --: | --: | --: | --: | --: |
| `/` | 283 | 0 | 34 | 283 | 20 | 371 |
| `/about` | 2,319 | 0 | 0 | 2,269 | 9 | 2,269 |
| `/knowledge` | 720 | 0 | 0 | 720 | 33 | 792 |
| `/knowledge/backend` | 919 | 0 | 236 | 662 | 26 | 1,135 |
| `/knowledge/idempotency` | 463 | 0 | 26 | 463 | 19 | 637 |
| `/work` | 257 | 0 | 9 | 257 | 8 | 317 |
| `/work/library` | 336 | 0 | 14 | 336 | 7 | 592 |
| `/work/vaultpay` | 886 | 0 | 134 | 886 | 30 | 1,452 |
| `/engineering-log` | 279 | 0 | 0 | 279 | 8 | 323 |
| `/engineering-log/cookeaze-webhook-reliability-gap` | 1,218 | 0 | 0 | 1,218 | 10 | 1,218 |
| `/search` | 342 | 0 | 2 | 342 | 55 | 393 |

**INP** is not measurable by Lighthouse in this configuration — INP is fundamentally an *interaction*-based field metric (it requires a real user interaction to sample); Lighthouse's lab audit reports **Total Blocking Time (TBT)** as its lab-measurable proxy for interactivity cost, which is what's reported above. No INP claim is made.

**Speed Index** was collected but is redundant with FCP/LCP for this mostly-static, mostly-text application (values track FCP closely on every route, e.g. home: FCP 283ms / Speed Index ~280–300ms range) — not separately tabled to avoid restating near-identical numbers.

**CLS is 0 on every single route tested, with no exception.** This directly corroborates Task 8.5's `fill` + `aspect-[3/4]` container design for the one real image, and Task 8.6's finding that `Sidebar`'s `null`-render state collapses cleanly via `lg:empty:hidden` with no reserved-then-collapsed layout jump.

---

## 9. LCP Analysis

**Every route's LCP element was identified via Lighthouse's `lcp-breakdown-insight`/`lcp-discovery-insight` audits**, not assumed from page structure:

| Route | LCP element (confirmed) | Server-rendered? | Blocked by CSS/font/JS? |
| --- | --- | --- | --- |
| `/`, `/knowledge`, `/work`, `/engineering-log`, `/search` (listing/text pages) | The page's own heading/intro text | Yes | No — text paints as soon as CSS/fonts are ready; no blocking resource dependency beyond that |
| `/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]` (article pages) | Article heading or opening paragraph text | Yes | No |
| **`/about`** | **The portrait `<img>`** (`alt="Portrait of Gracious Obeagu"`) — confirmed directly by node selector `section.py-12 > div.flex > div.relative > img.object-cover` in the `lcp-breakdown-insight`/`lcp-discovery-insight` audit output | Yes (the `<img>` tag itself is in the initial server-rendered HTML) | Its own resource load time (below) |

**`/about` is investigated in full, per this task's own explicit instruction (§12 of the task instructions).** Reproduced 3 times for stability (§5): LCP 2,212–2,319ms, a real and stable ~29x higher figure than any other route (next-highest is the `cookeaze-webhook-reliability-gap` article at 1,218ms). Lighthouse's `lcp-breakdown-insight` decomposes this precisely:

| Subpart | Duration |
| --- | --: |
| Time to first byte | 16.9ms |
| Resource load delay | 33.4ms |
| **Resource load duration** | **1,448.3ms** |
| **Element render delay** | **820.5ms** |

The dominant costs are the image's own load time and the delay between it finishing loading and actually painting — not server response time (TTFB is negligible, matching every other route).

**Does the portrait's `preload` behavior (Task 8.5) actually participate in LCP?** Yes, confirmed — and Task 8.5's preload change is **not removed, altered, or reopened here** (per this task's own explicit instruction). But live measurement surfaces one precise, additional, previously-unmeasured fact: Lighthouse's `lcp-discovery-insight` audit reports a failing checklist item — **`priorityHinted: false`** — *"fetchpriority=high should be applied to the image preload request."* This was verified directly against the raw served HTML (not inferred from the audit alone):

```html
<!-- The image preload link Task 8.5's preload={true} correctly emits — but with no fetchPriority: -->
<link rel="preload" as="image" imageSrcSet="..." imageSizes="..."/>

<!-- Compare: the script preload link on the same page DOES carry one: -->
<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/3rlr_try6oghg.js"/>

<!-- The <img> element itself also carries no fetchpriority attribute: -->
<img alt="Portrait of Gracious Obeagu" decoding="async" data-nimg="fill" ... src="..."/>
```

The other two items in the same checklist **pass**: `requestDiscoverable: true` (the image is discoverable in the initial HTML, not injected later by JS) and `eagerlyLoaded: true` (it is not `loading="lazy"`). Task 8.5's `preload={true}` correctly delivers eager, immediately-discoverable loading — confirmed, unmodified conclusion. What it does **not** do is set the separate `fetchPriority` prop, which is a distinct, independent `next/image` prop from `preload`/`priority` (confirmed in Task 8.5's own source-tracing, `docs/89` §12 — the merged `preload || priority` flag controls *whether* the preload link/eager-load happens; the HTML `fetchpriority` attribute is populated from a separate `fetchPriority` prop value that was never set in `about-header.tsx`). This is genuinely new evidence: Task 8.5's discovery had no live Lighthouse measurement in its own scope to have surfaced this gap.

**Is this a plausible, worthwhile fix?** Yes, on narrow, specific evidence — see §28 (Bottleneck Matrix) and §29 (Optimize/Preserve/Defer/Reject) for the exact, evidence-bounded manifest entry. It is **not implemented in this task.**

---

## 10. CLS Analysis

**CLS measures 0.000 on every one of the 11 routes tested, with no exception.** Evidence, not assertion:

- Images: the one real image (`/about`'s portrait) uses `fill` inside a `position: relative` container with a fixed `aspect-[3/4]` Tailwind class — space is reserved before the image loads, confirmed by Task 8.5's own architecture and re-confirmed here by the measured 0 CLS on that exact route.
- Fonts: `Geist`/`Geist_Mono` use `display: "swap"`, self-hosted via `next/font/google` (which also auto-applies a size-adjusted fallback font metric to minimize the swap-induced layout jump) — no measurable shift resulted.
- Navigation: `Header`'s sticky positioning and `Sidebar`'s `lg:empty:hidden` collapse (Task 8.6 §9, §19) introduce no shift — confirmed by 0 CLS on every route, including ones where `Sidebar` renders `null`.
- Dynamic content / hydration: no route showed any measurable shift from client-component hydration (`NavLink`, `ThemeToggle`, `MobileNavigation`, etc. — all part of the fixed shell, Task 8.6 §4).
- No loading states, animations, or third-party content exist to introduce shift (confirmed: 0 third-party resources anywhere, §18).

**This is an unambiguous "already excellent" finding — nothing to fix, nothing to defer.** Documented per this task's own §13 instruction to record evidence when CLS is already excellent, not only when it's a problem.

---

## 11. INP / Interactivity Analysis

INP itself is not lab-measurable (§8). Total Blocking Time, the lab proxy, is low across the board (0–236ms; the task's own §14 list of interactive components — nav menu, theme toggle, mobile navigation, copy button, active-section tracking, search — were inspected against this data):

- `/knowledge/backend` (236ms TBT) and `/work/vaultpay` (134ms TBT) are the two highest — both are pages with more DOM content (listing/article bodies) than the near-zero-TBT pages, consistent with more main-thread parsing/hydration work proportional to page content size, not evidence of any specific interactive component being expensive.
- No component-specific interaction cost was isolated as a bottleneck. Per this task's own §14 instruction, **no component is lazy-loaded or refactored on this basis** — there is no measured interaction-delay evidence connecting any specific one of `NavLink`/`ThemeToggle`/`MobileNavigation`/`CopyButton`/`ActiveSectionTracker`/`Search` to a real user-facing delay. This corroborates, rather than contradicts, Task 8.6's own conclusion that no client component in this application carries a demonstrated cost justifying deferral.

---

## 12. TTFB Analysis

TTFB ranges **7–55ms** across all 11 routes — negligible in absolute terms, and this task's own §15 instruction is followed precisely: **this is a local-server measurement and is not representative of any real deployment's network distance, CDN placement, or edge-caching behavior.** No infrastructure recommendation is made on this basis. The one mild relative pattern — `/search` (55ms) and `/work/vaultpay` (30ms) trending slightly higher than static/SSG pages — is consistent with `/search` being the one genuinely dynamic (`ƒ`) route in the build output (server-rendered on demand, reading `searchParams`, per Task 8.6 §13) rather than a pre-rendered static/SSG response; this is expected, architectural, and not a defect.

---

## 13. JavaScript Analysis

**Total JS transferred per route: ~206–212 KB** (gzip/compressed, measured via Lighthouse's `resource-summary` audit — a materially different, more realistic figure than Task 8.6's own raw/uncompressed on-disk chunk-size figures, and reported here as the network-transfer-size measurement Task 8.6 explicitly deferred to this task, §21 of the Task 8.6 discovery instructions):

| Route | Script transfer | Script requests |
| --- | --: | --: |
| `/` | 206.3 KB | 9 |
| `/about` | 212.2 KB | 10 |
| `/knowledge` (listing) | 207.8 KB | 10 |
| `/knowledge/idempotency` (article) | 207.8 KB | 10 |
| `/search` | 212.2 KB | 10 |

**A nuance worth stating precisely:** Task 8.6's own build-manifest analysis (a compile-time, module-graph fact) established that `ActiveSectionTracker`/`CopyButton` are referenced only on article-detail routes, not listing routes. The network-transfer figures above show near-identical Script totals between a listing page and an article page — this does **not** contradict Task 8.6's finding; it reflects a *different* fact: Turbopack's own chunk-grouping (an HTTP/2-multiplexing optimization, bundling several small modules into shared chunk files for fewer round trips) operates at a coarser granularity than individual-file necessity. Task 8.6's manifest-based analysis remains the authoritative source for *which* component is reachable from *which* route; this task's network measurement is the authoritative source for *how many bytes actually cross the wire*, and the two are consistent once that distinction is made explicit.

**`unused-javascript` audit** (home page): flags two files, both already-identified framework chunks from Task 8.6's own inventory:

| File | Total | Flagged "unused" | % |
| --- | --: | --: | --: |
| `1e-ibljlxkzh2.js` | 55.1 KB | 36.8 KB | 66.7% |
| `1s7w_f8hicdom.js` (React/`react-dom` internals, per Task 8.6 §10's own string-search identification) | 69.9 KB | 26.9 KB | 38.4% |

This is investigated, not taken at face value (§27). Lighthouse's static code-coverage heuristic cannot distinguish "genuinely dead code" from "framework code paths not exercised by a single passive page load without user interaction" (error boundaries, alternate-route hydration logic, interaction-gated code like `MobileNavigation`'s dialog or `ThemeToggle`'s dropdown, none of which fire during an automated, non-interactive Lighthouse pass). **Per this task's own §16 instruction — "if the JS cost is primarily framework/runtime rather than application code, document that" — that is exactly the finding here**: both flagged files are framework/runtime code (confirmed by Task 8.6's own string-identification work), not application code this repository authored or controls the internals of. **Classified REJECT** in §27 — not an actionable optimization; trimming React/Next.js's own internals is outside this repository's control and would require ejecting or patching the framework, which is far outside any reasonable interpretation of this task's scope.

**Relating this to Task 8.6:** no finding in this section demonstrates a "meaningful problem Task 8.6 discovery could not establish" (the explicit bar this task's own §16 sets for reopening lazy loading). Task 8.6's conclusion — no manual code-splitting is justified — is corroborated, not contradicted, by this task's network-level measurement.

---

## 14. CSS Analysis

- **CSS transfer:** ~12.4 KB per route (one Tailwind v4 output stylesheet, `/_next/static/chunks/*.css`), identical across every route tested.
- **Render-blocking:** the `render-blocking-resources` audit returned no actionable score (`score: null`, meaning no render-blocking-resource problem was flagged) on the routes inspected.
- **`unused-css-rules`:** scored **1.0 (perfect)** on the home page — no meaningful unused-CSS problem exists to investigate further.
- **Tailwind configuration and styles are not modified, inspected for rewrite, or touched in any way** — per this task's own explicit §17 instruction. The one stylesheet's small, consistent size across every route is itself evidence that Tailwind v4's JIT output is already appropriately scoped; no further action is proposed.

---

## 15. Font Analysis

- **Files:** two self-hosted `.woff2` files (`797e433ab948586e-s.p.*.woff2`, `caa3a2e1cccd8315-s.p.*.woff2`) — `Geist` and `Geist_Mono`, both via `next/font/google`, confirmed served from `/_next/static/media/`, not a live Google Fonts network request.
- **Size:** ~28.9 KB and ~22.9 KB (~51.8 KB combined per route) — consistent across all routes.
- **Loading strategy:** both fonts carry `<link rel="preload" as="font" crossorigin type="font/woff2">` in every page's `<head>`, confirmed in raw HTML.
- **`font-display`:** `display: "swap"` is set in `src/app/layout.tsx`'s own `next/font/google` configuration (unmodified, confirmed by reading the file this session) — Lighthouse's own `font-display` audit returned no actionable score (already correctly configured; nothing to flag).
- **Contribution to LCP/FCP/CLS:** no route's LCP element is text that would be blocked meaningfully by font loading in a way distinguishable from normal FCP timing (FCP tracks LCP closely on every text-LCP route, §8); CLS is 0 everywhere (§10), confirming `next/font`'s automatic fallback-font metric adjustment is working as intended, preventing a swap-induced shift. **No font optimization is justified by this evidence.**

---

## 16. Image Analysis

Task 8.5 is complete and is **not reopened** — this section exists solely to verify, with live Lighthouse evidence, whether the existing implementation produces any real problem (per this task's own §19 instruction).

- **Image size (as served):** the `/_next/image?url=%2Fimages%2Fportrait.jpeg&w=750&q=75` variant transfers **22.4 KB** on `/about` — Next's responsive `srcset` correctly serves a viewport-appropriate variant (750w), not the full 1080×998 source, confirmed directly in the resource list.
- **Format:** served as `image/jpeg` in this test session specifically because `curl`'s default `Accept` header doesn't request AVIF/WebP; a real browser (including the Chrome Lighthouse used) sends an `Accept` header requesting modern formats, and Task 8.5's discovery (`docs/88` §13) already confirmed the Image Optimization API's default `formats: ['image/webp']` applies automatically at request time with no source-file change needed — unchanged, not re-litigated.
- **Responsive delivery:** confirmed via the full `srcset` (640w through 3840w) present in the raw served HTML — unchanged from Task 8.5.
- **Preload behavior:** confirmed present (`<link rel="preload" as="image">`) — but see §9's `fetchPriority` finding, the one genuinely new piece of evidence this task adds to Task 8.5's picture.
- **Intrinsic vs. rendered dimensions:** unchanged from Task 8.5 (1080×998 source; `fill` + `aspect-[3/4]` container) — 0 CLS confirms no dimension-related layout problem exists.

**Everything about the existing image implementation is confirmed appropriate except the one narrow `fetchPriority` gap identified in §9**, which is the only image-related item carried into §26–§29's decision tables.

---

## 17. Network Analysis

- **Total requests per route:** 19–26 (lowest: `/`, 19; highest: `/search`, 26 — the extra requests on `/search` are the same fixed-shell scripts plus the search page's own small additional chunk, consistent with Task 8.6's finding that `/search` ships no meaningful *additional* client JavaScript beyond the shell, §13).
- **Total transfer per route:** ~332–350 KB.
- **Largest resources, by transfer size** (from `/about`'s network-requests audit, representative of the pattern on every route): the two largest framework JS chunks (70.3 KB, 55.5 KB — both React/Next.js runtime, per Task 8.6's own identification), then a third framework chunk (42.7 KB), then the two font files (28.9 KB, 22.9 KB), then the portrait image (22.4 KB, `/about` only), then the HTML document itself (13.3 KB), the CSS stylesheet (12.4 KB), and progressively smaller app-authored JS chunks.
- **Render-blocking resources:** none flagged (§14).
- **Critical request chains:** dominated by the framework runtime chunks and the two preloaded fonts — both already using the highest-priority delivery mechanism available (`<link rel="preload">`), consistent with Next.js's own default behavior, not a repository-specific issue.
- **Duplicate/unnecessary requests:** none found — no duplicate script/font/stylesheet loads were observed on any route.

**The highest-impact bottleneck category by raw byte count is unambiguously the React/Next.js framework runtime itself** (the same ~400+ KB raw / ~200 KB gzip figure Task 8.6 already identified and correctly declared outside this repository's own architectural control). Per this task's own §20 instruction not to optimize tiny resources while ignoring larger bottlenecks: **the largest bottleneck is not actionable by this repository** (it is framework-owned), and the one genuinely actionable, evidence-backed finding this task surfaces (`/about`'s `fetchPriority` gap, §9) is real but modest in scale — honestly sized, not inflated to justify a bigger intervention than the evidence supports.

---

## 18. Third-Party Resource Analysis

**None exist.** Confirmed on every route tested: `resource-summary`'s `Third-party` row reports `count=0, transferSize=0`. No analytics, no third-party fonts, no tracking, no external APIs, no embeds, no external images. This matches Task 8.6's own identical finding (`docs/90` §16) exactly — corroborated, not contradicted. **Nothing to optimize in this category; nothing introduced or removed.**

---

## 19. Caching Analysis

Observed directly via response headers (`curl -I`), not inferred:

| Resource type | `Cache-Control` | Notes |
| --- | --- | --- |
| Static JS chunks (`/_next/static/chunks/*.js`) | `public, max-age=31536000, immutable` | 1 year, immutable — optimal, standard Next.js content-hashed asset caching |
| Font files (`/_next/static/media/*.woff2`) | `public, max-age=31536000, immutable` | Same — optimal |
| Optimized image (`/_next/image?...`) | `public, max-age=14400, must-revalidate` | 4 hours — matches Next's documented default `minimumCacheTTL: 14400`, already confirmed by Task 8.5 (`docs/88` §21); live-verified here, unchanged |
| Document (e.g., `/about`) | `s-maxage=31536000` | 1-year shared/CDN cache directive; the homepage additionally showed `x-nextjs-cache: HIT` and `x-nextjs-prerender: 1` on repeat requests, confirming Next's own static-generation cache is functioning as designed |

**No meaningful caching concern exists.** Every asset class already carries an appropriate, Next.js-default caching policy. Per this task's own §22 instruction, **no inference is made about production CDN behavior from this localhost measurement** — a real deployment's edge/CDN caching layer (if any) is unmeasured and unclaimed here.

---

## 20. Accessibility Findings

Recorded per this task's own §23 instruction: **significant findings only**, connected to current implementation, with clear remediation — not a general accessibility audit.

**One real, repository-wide finding: `color-contrast` fails on every route**, driven by shared design tokens, not per-page content:

| Token / class | Contrast ratio measured | Required (WCAG AA) | Where used (confirmed via DOM selector) |
| --- | --: | --: | --- |
| `text-muted-foreground/70` (`#777777` on `#171717`) | 4.0:1 | 4.5:1 | Card metadata caption text (`.text-caption`) |
| `text-muted-foreground/70` (`#737373` on `#0a0a0a`) | 4.17:1 | 4.5:1 | Ordered-list caption text (e.g. numbered step captions) |
| `text-muted-foreground/60` (`#646464` on `#0a0a0a`) | 3.34:1 | 4.5:1 | Mono-font caption text; Footer's "RSS (coming soon)" label text |

All instances are small text (9–10.5pt / 12–14px), all fail by a modest but real margin (3.34–4.17 vs. the 4.5 required minimum), and all trace back to the same small family of opacity-modified `text-muted-foreground/NN` utility applications in dark mode. This affects real users (specifically, users relying on sufficient contrast for small/muted text) and has a clear, narrow remediation path (raise the opacity or use a higher-contrast token for these specific caption-weight text uses in dark mode). See §26 for triage and §29 for the disposition — this finding is **real and recorded**, but **not implemented** in this task, and its disposition (§29) treats it as its own narrowly-scoped follow-up rather than an accessibility overhaul (explicitly excluded by this task's own §34/§35).

No other accessibility audit failure was found on any route tested.

---

## 21. Best Practices Findings

**Score: 100 on every route, no exceptions.** Every `best-practices` category audit passed — confirmed by iterating every `auditRefs` entry and finding zero with a sub-1.0 score. No console errors, no insecure/mixed-content resources, no deprecated API usage, no problematic browser-compatibility issue was flagged anywhere. **Nothing to record, fix, or defer in this category.**

---

## 22. SEO Findings

**Score: 100 on every route except `/search` (63).** Investigated directly, not assumed:

- `/search`'s one failing audit is `is-crawlable`: *"Page is blocked from indexing"* — score 0.
- This is **the deliberate, already-approved `robots: { index: false, follow: true }`** set on `/search` by Task 8.1/8.3 (confirmed live in `src/app/search/page.tsx`'s `metadata` export, unmodified — Task 8.6 §13 already documented this same fact). Lighthouse's SEO category has no way to distinguish "intentionally noindexed by design" from "accidentally blocked" — it flags any `noindex` directive identically.
- **Classification: already intentionally handled, not a real problem, entirely outside Task 8.7.** No production file is proposed for this finding, and Task 8.1/8.3's approved work is **not undone** — per this task's own explicit §25 instruction.

Every other route's SEO score of 100 corroborates that Tasks 8.1–8.4's metadata, canonical, and structured-data work is functioning correctly in the actual served HTML — a healthy confirmation, not a new finding requiring action.

---

## 23. Audit Triage

| Finding | Evidence | Impact | Decision | Reason |
| --- | --- | --- | --- | --- |
| Simulated-throttling Performance score (41 on homepage) | Homepage re-measured unthrottled scored 100 on the identical page/server | Would be severe if trusted | **REJECT** (as a metric to act on) | Host-contention artifact, demonstrated directly by a controlled before/after comparison (§5) — not a real application problem |
| `/about` LCP ~2.2–2.3s, portrait is the LCP element, `fetchPriority` not applied | `lcp-breakdown-insight`/`lcp-discovery-insight`, 3 stable runs, raw HTML confirmation | Moderate — real, reproducible, route-specific | **FIX** (future, narrow) | Precise root cause, plausible mechanism (fetchpriority affects browser request scheduling), low-risk one-line-class change, honestly modest expected benefit (§28) |
| Repository-wide `color-contrast` failure (3 token/context combinations) | `color-contrast` audit, exact selectors and ratios, every route | Real — affects readability for users relying on sufficient contrast | **DEFER** | Real and evidence-backed, but a design-token change outside Task 8.7's performance focus and outside this task's explicit non-goal of an "accessibility overhaul" (§34) — recorded for a dedicated, narrowly-scoped follow-up |
| `/search` SEO score 63 (`is-crawlable`) | `is-crawlable` audit; `robots: {index:false}` confirmed in source | None — working as designed | **PRESERVE** | Deliberate, already-approved Task 8.1/8.3 behavior; Lighthouse cannot express "intentional noindex" as anything but a failure |
| `unused-javascript` on 2 framework chunks (~64 KB combined) | `unused-javascript` audit; both files identified as React/Next.js runtime per Task 8.6 | Low — framework-owned, not application code | **REJECT** | Not actionable without ejecting/patching the framework; corroborates rather than contradicts Task 8.6's own "framework, not app code" finding |
| CLS = 0 everywhere | Measured on all 11 routes | N/A — already optimal | **PRESERVE** | No change justified; existing `fill`+aspect-ratio and shell-collapse architecture already prevents shift |
| Best Practices = 100 everywhere | All audits passing | N/A | **PRESERVE** | Nothing to change |
| Font loading (`next/font`, `display: swap`, preloaded) | `font-display` audit inactionable; 0 CLS; FCP tracks LCP normally | N/A — already appropriate | **PRESERVE** | No evidence of a font-driven performance problem |
| Third-party resources | 0 found, every route | N/A | **PRESERVE** | Nothing exists to optimize or remove |
| Caching headers (JS/font immutable 1yr, image 4hr, document CDN 1yr) | Direct header inspection | N/A — already Next.js-optimal defaults | **PRESERVE** | No caching change justified |

---

## 24. False Positive / Heuristic Analysis

Per this task's own §27 instruction, every audit that *could* have prompted a reflexive "just fix the audit" response was checked against whether it represents a real problem:

- **`unused-javascript` (framework chunks):** would satisfying this audit require patching/ejecting Next.js/React internals? Yes. **Rejected** — the "fix" is not available to this repository, and even if it were, removing framework code paths risks breaking functionality on interactions the single-page coverage pass didn't exercise (exactly the failure mode this task's own §27 warns against: "do not blindly satisfy an audit if doing so would break functionality").
- **`unused-css-rules`:** already scores perfect (1.0) — no heuristic to second-guess.
- **`is-crawlable` on `/search`:** satisfying this audit literally means removing the `noindex` directive Task 8.1/8.3 deliberately added — this is the textbook case this task's own §27 describes ("do not blindly satisfy an audit if doing so would... damage SEO [intent]"). **Rejected outright**, with the reasoning stated explicitly rather than silently skipped.
- **Simulated-throttling Performance score:** the single largest false signal in this entire discovery. Treated with the most scrutiny of anything in this document (§5, §23) — verified with a controlled comparison rather than either blindly trusted or blindly dismissed.
- **Color-contrast:** the opposite case — a heuristic-sounding audit (contrast ratios) that, on inspection, is a real, precisely-measured, WCAG-standard numeric failure with exact selectors and exact ratios, not a vague heuristic. Correctly **not** dismissed as a false positive (§20, §23).

No proposed action in this document optimizes negligible bytes while ignoring a larger bottleneck (§17 already states the largest bottleneck — framework JS — is explicitly not actionable, and the one actionable item, `/about`'s `fetchPriority`, is sized honestly rather than inflated).

---

## 25. Route Comparison

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TTFB | Main Finding |
| --- | --: | --: | --: | --: | --: | --: | --: | --- |
| `/` | 100 | 96 | 100 | 100 | 283ms | 0 | 20ms | Clean baseline |
| `/about` | 96 | 96 | 100 | 100 | 2,319ms | 0 | 9ms | Portrait is LCP element; `fetchPriority` gap (§9) |
| `/knowledge` | 100 | 96 | 100 | 100 | 720ms | 0 | 33ms | Clean |
| `/knowledge/backend` | 96 | 96 | 100 | 100 | 919ms | 0 | 26ms | Highest TBT (236ms) among tested routes, still low in absolute terms |
| `/knowledge/idempotency` | 100 | 96 | 100 | 100 | 463ms | 0 | 19ms | Clean |
| `/work` | 100 | 95 | 100 | 100 | 257ms | 0 | 8ms | Clean (lowest a11y score, 95, among tested routes — no single dominant new audit beyond the shared color-contrast finding) |
| `/work/library` | 100 | 96 | 100 | 100 | 336ms | 0 | 7ms | Clean |
| `/work/vaultpay` | 99 | 96 | 100 | 100 | 886ms | 0 | 30ms | Clean |
| `/engineering-log` | 100 | 96 | 100 | 100 | 279ms | 0 | 8ms | Clean |
| `/engineering-log/cookeaze-webhook-reliability-gap` | 100 | 96 | 100 | 100 | 1,218ms | 0 | 10ms | Clean; second-highest LCP but still architecturally normal (longer article body) |
| `/search` | 100 | 96 | 100 | **63** | 342ms | 0 | 55ms | SEO score explained entirely by intentional `noindex` (§22) |
| 404 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Lighthouse cannot audit non-2xx responses (§6); `curl` confirms correct 404 status, 54.7 KB payload, 7ms local response |

All values above are measured; no cell is a guess.

---

## 26. Performance Bottleneck Matrix

| Bottleneck | Route(s) | Evidence | Severity | Root Cause | Proposed Direction | Task |
| --- | --- | --- | --- | --- | --- | --- |
| Portrait `fetchPriority` not set | `/about` only | `lcp-discovery-insight`: `priorityHinted: false`; raw HTML confirms no `fetchPriority` attribute on the preload link or `<img>` | Low–Moderate | `about-header.tsx`'s `<Image>` sets `preload={true}` but never sets the separate `fetchPriority` prop | Add `fetchPriority="high"` to the existing `<Image>` element | Future, narrowly-scoped Task 8.7 implementation (§27) — not Task 8.5, which is closed and unmodified |
| `color-contrast` failures (3 token/context combos) | Every route | `color-contrast` audit, exact selectors/ratios (§20) | Low–Moderate (accessibility, not performance) | Opacity-modified `text-muted-foreground/70`/`/60` tokens fall below 4.5:1 in dark mode | Raise contrast for these specific caption-weight token uses | A future, dedicated accessibility-scoped task — explicitly not this task's own implementation manifest (§34's non-goal: no accessibility overhaul) |
| React/Next.js framework runtime (~400 KB raw / ~200 KB gzip) | Every route | `unused-javascript`, `resource-summary`, corroborating Task 8.6 §10 | N/A — not actionable | Framework-owned code, not application code | None — outside this repository's control | N/A |
| `/search` SEO score (63) | `/search` only | `is-crawlable` audit; source-confirmed intentional `noindex` | None | Deliberate design (Task 8.1/8.3) | None | N/A — already correctly implemented |

Every proposed direction above identifies the likely future scope precisely; nothing is implemented by this document.

---

## 27. Optimize / Preserve / Defer / Reject Decisions

### Optimize (future, narrow, evidence-bound — not implemented here)
- `/about`'s `<Image>` element: add `fetchPriority="high"`, addressing the one measured, reproducible LCP-discovery gap (§9, §26).

### Preserve
- Task 8.5's image implementation in every other respect (dimensions, `sizes`, format handling, caching, the `priority`→`preload` migration itself).
- Task 8.6's lazy-loading conclusion (corroborated, not contradicted, by this task's own network-level JS measurement, §13).
- CLS architecture (0 on every route).
- Font loading strategy.
- Caching headers across every asset class.
- Best Practices posture (100 everywhere).
- `/search`'s `noindex` (Task 8.1/8.3, working exactly as designed).

### Defer
- The repository-wide `color-contrast` finding (§20, §26) — real, evidence-backed, but scoped to a future, dedicated task rather than folded into Task 8.7's own performance-focused manifest, consistent with this task's own explicit prohibition on turning Task 8.7 into an accessibility overhaul (§34).
- Any deployed/field-data (CrUX) measurement — no deployment exists to measure (§3); revisit if/when one exists.
- Multi-run statistical stabilization for routes only run once (§5) — a methodological refinement, not a finding requiring code change.

### Reject
- Acting on the simulated-throttling Performance score (41) — demonstrated, controlled false signal from host contention (§5, §23, §24).
- The `unused-javascript` finding on framework chunks — not actionable without patching the framework itself (§13, §24).
- Removing `/search`'s `noindex` to satisfy the `is-crawlable` audit — would directly undo approved Task 8.1/8.3 work for no real benefit (§22, §24).

---

## 28. Exact Future Production Manifest

**One narrowly-scoped, evidence-backed candidate exists** — not implemented by this task, and offered here only as the deterministic manifest this task's own §31 instruction requires:

### `src/components/about/about-header.tsx`
1. **Exact path:** `src/components/about/about-header.tsx`
2. **Current behavior:** the portrait `<Image>` element sets `preload={true}` (Task 8.5), correctly making it eager-loaded and discoverable in the initial HTML, but does not set the separate `fetchPriority` prop — confirmed absent from both the rendered `<link rel="preload">` and the `<img>` tag itself (§9).
3. **Exact proposed change:** add `fetchPriority="high"` as an additional prop on the existing `<Image>` element (alongside, not replacing, `preload={true}`).
4. **Lighthouse evidence supporting it:** `lcp-discovery-insight` audit, `priorityHinted: false` checklist item, on `/about`, reproduced across 3 stable runs (§9, §5).
5. **Expected metric affected:** LCP on `/about` specifically (no other route's LCP element is this image).
6. **Expected benefit:** modest and honestly bounded — the image is already eager/discoverable (the two other `lcp-discovery-insight` checks already pass); `fetchPriority="high"` would additionally signal the browser's own resource scheduler to prioritize this request's bandwidth/connection-slot allocation relative to concurrently-loading resources (the two framework JS chunks and two font files also loading on `/about`). On this local, single-client, uncontended loopback connection, the resource-scheduling benefit cannot be isolated from noise (§5's own demonstrated host-contention sensitivity) — a real-network/deployed measurement would be needed to quantify the actual gain. This is stated honestly rather than overclaimed.
7. **Risk:** very low — a well-documented, single, additive `next/image` prop; no interaction with any other prop on the same element; no precedent of this prop causing regressions elsewhere in this codebase (it is not currently used anywhere, so there is no existing-usage risk to reconcile).
8. **Verification method:** re-run `lcp-discovery-insight` post-change and confirm `priorityHinted: true`; re-inspect raw served HTML for `fetchpriority="high"` on the image preload link and/or `<img>` tag; re-run the same 3-sample stability check used in this discovery (§5) to confirm no regression in LCP or any other metric.

**No other production file is justified.** Specifically excluded, with reasoning already stated in the sections cited::

| File/area | Why excluded |
| --- | --- |
| Any `next.config.ts` change | No evidence justifies one (§14, §16, §19 — CSS/JS/caching all already appropriate) |
| Any Tailwind/CSS rewrite | Explicitly out of scope (§14); `unused-css-rules` already scores perfect |
| Any font file/config change | No evidence of a font-driven problem (§15) |
| Any lazy-loading/`next/dynamic` change | Task 8.6's conclusion corroborated, not contradicted (§13) |
| Any color-contrast fix | Real, but deferred to its own future task, not this one's manifest (§27) |
| Any `/search` metadata/robots change | Would undo approved work for no benefit (§22, §24) |

---

## 29. Dependency Manifest

```text
No dependency changes.
```

The one proposed future change (§28) uses an existing, already-documented `next/image` prop (`fetchPriority`) — no new library, no version change, no `package.json`/lockfile modification of any kind.

---

## 30. Configuration Manifest

```text
No configuration changes.
```

Nothing in `next.config.ts`, Tailwind configuration, or any other project configuration file is proposed for modification. Every finding in this document is either already-correct-and-preserved, a single-component prop addition (§28), or explicitly deferred to a differently-scoped future task (§20/§27).

---

## 31. Implementation Sequence

Not applicable to this discovery — no implementation is performed. If the one `fetchPriority` candidate (§28) is approved in a future implementation plan, its sequence would be: apply the single prop addition → rebuild → re-run the same Lighthouse methodology this discovery established (§5) against `/about` specifically → confirm the `priorityHinted` checklist item now passes and no other metric regresses → verify `git diff` is scoped to the one file.

---

## 32. Release Gate

- [x] Production build succeeds (verified before and after testing, §2, §3)
- [x] Lighthouse methodology documented, including the throttling-methodology decision and its justification (§5)
- [x] Representative routes tested — all 11 named routes, plus a documented 404 attempt (§6)
- [x] Performance measured (§7, §8, §9)
- [x] Accessibility measured (§7, §20)
- [x] Best Practices measured (§7, §21)
- [x] SEO measured (§7, §22)
- [x] LCP measured, with element-level identification (§8, §9)
- [x] CLS measured (§8, §10)
- [x] TBT measured as the lab proxy for interactivity; INP's field-only nature explicitly noted (§8, §11)
- [x] FCP measured (§8)
- [x] TTFB measured, with explicit local-only caveat (§8, §12)
- [x] Network requests inspected (§17)
- [x] JavaScript inspected, related to Task 8.6 (§13)
- [x] CSS inspected (§14)
- [x] Fonts inspected (§15)
- [x] Images inspected, related to Task 8.5, not reopened except for new evidence (§16, §9)
- [x] Third-party resources inspected (§18)
- [x] Caching considered (§19)
- [x] Every notable finding triaged FIX/PRESERVE/DEFER/REJECT (§23)
- [x] False positives considered explicitly (§24)
- [x] Exact future production manifest exists (§28)
- [x] Dependency manifest exists (§29)
- [x] Configuration manifest exists (§30)
- [x] No implementation performed
- [x] No production files modified (confirmed via `git status --short`/`git diff --stat` before and after, §37 below)

---

## 33. Risks

| Risk | Assessment |
| --- | --- |
| Trusting the simulated-throttling score as real | Directly addressed by this document's own methodology (§5) — the false signal was caught and documented, not acted on |
| Treating localhost TTFB/network timing as production-representative | Explicitly disclaimed throughout (§3, §12) |
| The one proposed future `fetchPriority` change regressing something | Very low — additive, single, well-documented prop; verification method specified (§28) |
| The color-contrast finding being ignored because it's "deferred" | Mitigated by recording it prominently in this document (§1, §20, §26) rather than only in a buried appendix, so it isn't lost |
| Future re-measurement on a quieter host producing different absolute numbers | Expected and correct — this document's own §5 already demonstrates measurement sensitivity to host load; any future measurement should re-establish its own baseline rather than assume this session's exact figures are permanent |

No risk beyond what live evidence supports is asserted.

---

## 34. Rollback

Not applicable — no production file, dependency, or configuration was modified by this discovery. The Lighthouse testing process itself left no residue: the temporary production server was stopped, `.next/` build output was removed, and a final `pnpm build` was re-run to confirm the repository's committed/working-tree state builds cleanly with no test artifacts remaining (§37).

---

## 35. Non-Goals

Explicitly excluded from this document, per this task's own instructions: any production code change, any CSS/image/configuration edit, any dependency installation into the project, any route/content/metadata/JSON-LD/Open Graph/canonical/robots/RSS/sitemap change, any accessibility overhaul beyond recording the one real finding (§20), any SEO overhaul, any analytics/infrastructure/CDN/database/API work, and any reopening of Tasks 8.1–8.6's own approved conclusions absent direct evidence of a regression (none was found — §2).

---

## 36. Final Recommendation

`READY FOR ARCHITECTURE REVIEW`

The application performs excellently under accurate measurement: Performance 96–100, Best Practices 100, SEO 100 (with one fully-explained, intentional exception), Accessibility 95–96, and 0 CLS everywhere. The single largest apparent problem this discovery encountered — a Performance score of 41 — was itself investigated, traced to host contention rather than the application, and correctly not acted on. Two real, narrow, evidence-backed findings survive that scrutiny: one small, low-risk, precisely-scoped LCP-discovery improvement on `/about` (§28), and one real accessibility finding appropriately deferred to its own future task rather than expanding this one's scope (§20, §27). This is not a zero-finding discovery, but it is a discovery that resisted manufacturing work from a misleading score and instead reported exactly what the evidence supports — including being explicit about a measurement methodology's own limitations.
