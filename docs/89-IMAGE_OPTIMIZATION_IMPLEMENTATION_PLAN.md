# TASK 8.5 — IMAGE OPTIMIZATION: IMPLEMENTATION PLAN

**Status:** Planning only. No implementation performed.

**Builds on:** `docs/88-IMAGE_OPTIMIZATION_DISCOVERY_AND_ARCHITECTURE_REVIEW.md` (approved).

---

## 1. Executive Summary

Task 8.5's discovery found exactly one production image surface (`public/images/portrait.jpeg`, rendered once on `/about` via `next/image` in `src/components/about/about-header.tsx`) and exactly one evidence-backed optimization on it: the `<Image>` element's `priority` prop is deprecated as of Next.js 16.0.0 in favor of `preload`. This document plans that single change, and only that change.

Live repository re-verification this session (§2) not only confirms the discovery's finding but strengthens it: the installed Next.js package's own TypeScript definitions (`node_modules/next/dist/shared/lib/get-img-props.d.ts:25-26`) carry an explicit `@deprecated` JSDoc tag on `priority`, pointing at `preload` — and tracing the runtime source (`get-img-props.js:587`, `image-component.js:224-312`) confirms both props feed the exact same internal flag (`preload: preload || priority`) and therefore produce byte-for-byte identical HTML/head output. No contradiction with the discovery document was found. The plan below proceeds exactly as approved in §2–§4 of the task instructions: one file, one prop rename, no other change.

---

## 2. Discovery Findings Being Implemented

Re-verified live, this session, before writing this plan (not reused uncritically from `docs/88`):

| Finding | Live re-verification |
| --- | --- |
| `src/components/about/about-header.tsx` is the only file using `next/image` | Confirmed — file read in full this session, content identical to what `docs/88` describes (lines 92-102 unchanged) |
| The `<Image>` element uses `priority` | Confirmed at line 100 |
| Next.js installed version is 16.3.0 | Confirmed via `package.json` (`"next": "16.3.0"`) and `node_modules/next/package.json` (`"version": "16.3.0"`) |
| `priority` is deprecated in favor of `preload` | Confirmed two ways: (1) `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` version-history table, `v16.0.0` row; (2) stronger evidence found this session — the installed package's own type declaration, `node_modules/next/dist/shared/lib/get-img-props.d.ts:25-26`, carries a literal `@deprecated Use \`preload\` prop instead.` JSDoc comment on the `priority` field |
| `preload` and `priority` are behaviorally identical | Confirmed this session by tracing `get-img-props.js:587` (`preload: preload || priority`) through to `image-component.js:224-312` (`ImagePreload` component, gated only on the resulting merged `imgMeta.preload` boolean) — the emitted `<link rel="preload">` / `ReactDOM.preload()` call is identical regardless of which source prop set it |
| No other `<Image>`/`<img>`/background-image/remote-image surface exists | Re-confirmed via the same grep patterns `docs/88` used (`<Image`, `<img`, `background-image`, `url(`, `src=`) — no new surface has appeared since discovery |
| No production files other than `about-header.tsx` are currently modified relative to `HEAD` | Confirmed via `git status --short` — the file does not appear in the current working-tree diff, giving a clean baseline for §15/§18's diff-scope checks |

**No contradiction between the discovery document and the live repository was found.** The plan proceeds as approved, without expansion.

---

## 3. Exact Production Change

**File:** `src/components/about/about-header.tsx`

**Before (current, line 100):**

```tsx
          <Image
            src="/images/portrait.jpeg"
            alt="Portrait of Gracious Obeagu"
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 768px) 18rem, 100vw"
            className="object-cover"
            style={{ objectPosition: "30% 50%" }}
            priority
          />
```

**After:**

```tsx
          <Image
            src="/images/portrait.jpeg"
            alt="Portrait of Gracious Obeagu"
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 768px) 18rem, 100vw"
            className="object-cover"
            style={{ objectPosition: "30% 50%" }}
            preload={true}
          />
```

Exactly one token changes: the bare `priority` boolean shorthand is replaced with the explicit `preload={true}` boolean prop. `src`, `alt`, `fill`, `sizes`, `className`, and `style` are byte-for-byte unchanged. No import statement changes (`Image` is already imported from `next/image`; no new import is introduced). No JSX structure, wrapper `<div>`, or surrounding component logic changes.

---

## 4. Semantic Intent

```text
Existing behavior:
  the portrait is intentionally eager-loaded and marked high fetch-priority,
  because it is the plausible LCP element on /about, above the fold,
  in the page's opening section.

Task 8.5 change:
  replace the deprecated Next.js 16 `priority` API
  with the current, documented `preload` API.

Result:
  identical intended loading priority and identical emitted HTML —
  traced through Next.js's own source (§2) —
  expressed through the framework's current, non-deprecated API surface.
```

This is precisely an API migration, not a performance optimization. No loading behavior, timing, fetch priority, or emitted markup changes as a result of this plan. It is scoped exactly to framework-alignment, consistent with AGENTS.md's instruction to heed this repository's vendored Next.js deprecation notices rather than carry forward APIs the installed framework version has already superseded.

---

## 5. Why No Asset Changes

`public/images/portrait.jpeg` requires no source modification:

- **Dimensions (1080×998) are appropriate.** The image's largest rendered footprint is `lg:w-96` (24rem / 384px) wide × `aspect-[3/4]` tall (≈512px), i.e. up to roughly 768×1024 physical pixels at 2x device pixel ratio. The 1080×998 source comfortably covers this without upscaling, and Next/Image's `deviceSizes`/`imageSizes` machinery already serves smaller variants to smaller viewports — there is no oversized-source problem to fix.
- **Format (JPEG, ~52 KB) is appropriate and already optimized at delivery time.** `next.config.ts` carries no `images.formats` override, so Next's default (`formats: ['image/webp']`) applies: the Image Optimization API already transcodes this JPEG to WebP at request time for supporting browsers, with zero source-file change required to get that benefit. Converting the *source* file to WebP or AVIF would not add anything the runtime pipeline doesn't already provide, and would discard the one advantage of keeping a universally-decodable JPEG source (e.g., as a fallback if `unoptimized` were ever set, or for any consumer that bypasses the optimizer).
- **No resizing, compression, replacement, or new variant is justified.** No measured evidence (no Lighthouse baseline exists in this repository — `docs/88` §22) points to this 52 KB image as a payload or load-time problem, and the task's own approved scope (§6 of the task instructions) explicitly forbids recommending source conversion without measured benefit.

**Asset conclusion: `public/images/portrait.jpeg` is not modified by this plan.**

---

## 6. Why No `next.config.ts` Changes

`next.config.ts` is currently `{ /* config options here */ }` — functionally empty. No change is justified because:

- No remote images exist anywhere in the application (re-confirmed live, §2) — `images.remotePatterns`/`images.domains` would configure a category of image that does not exist in this codebase.
- No custom image loader or custom `images.path` is needed — the one real image is served from `public/` through the default built-in loader, which is already compatible with the deployment model (`docs/88` §22: standard Node.js runtime, no static export, no CDN-specific config file present).
- No custom `images.formats` is needed — the default (`['image/webp']`) already applies and already benefits the one real image (§5 above).
- No custom `images.deviceSizes`/`images.imageSizes` is needed — the defaults already produce an appropriately tiered `srcset` for the one image's actual responsive `sizes` attribute (`docs/88` §15).
- No custom `images.qualities` is needed — the `<Image>` element does not set a custom `quality` prop, so the default (`quality: 75`, matching the default `qualities: [75]` allowlist) already applies without requiring an explicit allowlist entry.

**Configuration conclusion: `next.config.ts` is not modified by this plan.**

---

## 7. Why No Other Image Changes

Re-confirmed live this session (§2), consistent with `docs/88`:

- **Exactly one production `next/image` surface exists** (`about-header.tsx`) — no second call site to bring into alignment.
- **No meaningful raw `<img>` production surface exists.** `mdx-components.tsx`'s `Img()` component is real code, but renders zero live images — no content document contains markdown image syntax (re-confirmed by grepping `content/` for `![` this session's discovery, unchanged since). There is no live instance to migrate, and building speculative `next/image` support for a hypothetical future markdown image is exactly the "manufactured work" the discovery document's First Principle rules out.
- **No CSS background image exists** requiring optimization — none exists at all (`docs/88` §11).
- **No remote image exists** — none exists at all (`docs/88` §12).
- **No content image is currently rendered** — `coverImage`/`logo` frontmatter fields exist in the schema but are populated by zero of 13 real content documents and are read by zero rendering components (`docs/88` §6).

**Conclusion: this plan does not expand into a broader image-component refactor.** The task's own approved scope (§3 of the task instructions: "No other production source file is approved… No new component is approved… No image-processing pipeline is approved… No additional dependency is approved") is satisfied by the single-file, single-prop change in §3 above.

---

## 8. Task 8.5 / 8.6 Boundary

**In this plan (Task 8.5):** the `priority` → `preload` prop migration is a `next/image`-specific API-currency change. It does not alter *when* the image loads (both props resolve to the identical `preload: true` internal flag, §2) — only which prop name expresses that already-correct eager-load intent.

**Not in this plan, reserved for Task 8.6:** any general lazy-loading strategy for non-image content — below-fold component lazy loading, dynamic imports, Suspense-based deferral, or route-level loading changes. This plan introduces none of these. The MDX `Img()` component's pre-existing `loading="lazy"` is untouched (and, per §7, currently exercises no live image regardless).

---

## 9. Task 8.5 / 8.7 Boundary

**In this plan:** verification that the one-prop change does not regress image loading, layout, rendering, HTML output, or build behavior (§10–§13 below).

**Not in this plan, reserved for Task 8.7:** any Lighthouse run, Core Web Vitals measurement, LCP/CLS benchmarking, or broader performance tuning. No performance baseline is established or claimed by this plan — `docs/88` §22 already documents that none exists in this repository, and this plan does not attempt to create one. Verification here is functional/structural (does the right thing render, does the right markup appear), not a performance-metrics exercise.

---

## 10. Validation Plan

### Static checks

The task instructions specify:

```bash
pnpm exec eslint
pnpm exec tsc --noEmit
```

Live-verified this session: `package.json` already defines equivalent first-class scripts wired to these exact commands —

```json
"lint": "eslint",
"typecheck": "tsc --noEmit"
```

Either invocation is equivalent; the implementer may run `pnpm lint` / `pnpm typecheck` (the project's own documented entry points) or the literal `pnpm exec eslint` / `pnpm exec tsc --noEmit` forms — both resolve to the same underlying command. Noted here as a benign discrepancy between the task instructions' literal invocation and this repository's own `package.json` scripts, not a contradiction requiring a stop (§4 of the task instructions: only a *contradiction with the discovery* triggers a stop; this is a same-command alternate-invocation, not a contradiction).

Expected result: both pass with zero errors and zero new warnings attributable to this change. A rename from `priority` to `preload={true}` is a same-type (`boolean`) prop substitution on an already-typed `ImageProps` interface (both fields confirmed present in `node_modules/next/dist/shared/lib/get-img-props.d.ts`, §2) — no type error is expected. ESLint's `@next/next` ruleset has no rule flagging `preload` usage; none is expected to fire.

### Production build

```bash
pnpm build
```

Expected: build succeeds with no new errors or warnings. `/about`'s route classification (static vs. dynamic rendering) is expected to remain unchanged — the change is a prop value on an existing Server Component's JSX, not a change to data fetching, `dynamic` exports, or any other route-segment configuration in `about-header.tsx` or `app/about/page.tsx`.

---

## 11. Production HTML Verification

After the change, inspect `/about`'s actual rendered output (dev server and/or `pnpm build && pnpm start`, viewed in a browser, plus rendered HTML/DOM inspection):

- Portrait still renders, at `src="/images/portrait.jpeg"` (or its `/_next/image?...` optimized equivalent in the `srcset`/`src` output — both are expected, matching current behavior).
- Correct source remains — no path or filename change.
- Dimensions remain correct — the `fill` + `aspect-[3/4]` container still reserves the same box; the underlying `<img>`'s generated `srcset` widths are unchanged (governed by `sizes` and the config's `deviceSizes`/`imageSizes`, neither of which changed).
- Aspect ratio remains correct — `aspect-[3/4]` on the parent `div` is untouched.
- Crop remains unchanged — `object-cover` class and `objectPosition: "30% 50%"` inline style are untouched.
- No broken image — the `src` attribute is untouched.
- No layout shift is introduced by the change — the reserved box (`aspect-[3/4]` on a `position: relative` parent) is unaffected by which loading-priority prop was used to populate it.
- Expected image delivery remains present — WebP transcoding via the default Image Optimization API is unaffected (governed by `next.config.ts`'s `images.formats`, untouched).

This must be a live, rendered-output check — not source-code inspection alone (per the task instructions' explicit "Do not rely only on source inspection").

---

## 12. Preload Verification

The task instructions require confirming that `preload={true}` actually emits the intended preload behavior in the production build — not merely that TypeScript accepts the prop.

**Mechanism, traced live this session (§2) directly from the installed package's source** (`node_modules/next/dist/shared/lib/get-img-props.js:587` and `node_modules/next/dist/client/image-component.js:224-312`):

1. `getImgProps()` merges both source props into one internal flag: `preload: preload || priority`.
2. The `<Image>` component's rendered output includes an `ImagePreload` element whenever that merged flag is true — gated purely on the merged boolean, with no branch distinguishing which of the two source props set it.
3. `ImagePreload` either calls `ReactDOM.preload(imgAttributes.src, opts)` (the App Router code path — this repository uses the App Router, confirmed by `src/app/` structure) or renders a `<link rel="preload" as="image" .../>` tag directly, depending on router context.

Because the merged flag is identical whether `priority` or `preload={true}` set it, **the emitted preload signal (the `<link rel="preload">` in document head, or the equivalent `ReactDOM.preload()` resource hint) is expected to be byte-for-byte identical before and after this change.**

**Concrete verification steps for the implementer:**

1. Before the change: capture `/about`'s rendered `<head>` (via browser DevTools "View Page Source" on a production build/`pnpm start`, or the Network panel's request-priority column for the portrait's request) as a baseline. Note the presence of a `<link rel="preload" as="image" href="...">` (or equivalent App Router resource-hint behavior) and the portrait request's priority/timing.
2. Apply the change (§3).
3. Rebuild (`pnpm build`) and re-render `/about` under the same conditions.
4. Compare: the preload `<link>`/resource hint should still be present, referencing the same resolved `/_next/image?...` URL, with the same effective fetch priority. No new `<link>`, no missing `<link>`, no change in the image request's Network-panel priority is expected.

This directly satisfies the task instructions' "verify the API migration, not merely its source syntax" and "compare the resulting behavior with the previous implementation if a clean baseline is available" — the before/after capture in steps 1–4 *is* that comparison.

---

## 13. Regression Verification

Confirm the following are **unchanged** after the implementation, by direct inspection of `/about`'s rendered output and its `generateMetadata()` output:

| Surface | Expected | Why unaffected |
| --- | --- | --- |
| Page title | Unchanged | `about-header.tsx` does not touch metadata; `app/about/page.tsx`'s `generateMetadata()` is untouched |
| Metadata description | Unchanged | Same reasoning |
| Canonical URL | Unchanged | Task 8.3's canonical implementation is untouched by this file |
| Open Graph | Unchanged | Task 8.2 scope, untouched |
| Twitter metadata | Unchanged | Task 8.2 scope, untouched |
| Structured data | Unchanged | The Person `image` JSON-LD node lives in `src/app/page.tsx` (Task 8.4), a different file, not touched by this plan; it references `public/images/portrait.jpeg` by URL/dimensions, neither of which changes |
| RSS | Unchanged | Unrelated route/file |
| Sitemap | Unchanged | Unrelated route/file |
| Robots | Unchanged | Unrelated route/file |
| Search | Unchanged | Unrelated route/file |
| Content | Unchanged | No `content/` file is touched |
| Layout | Unchanged | No CSS/className/style/DOM-structure change in `about-header.tsx` beyond the one prop |

Only image loading API behavior (the `priority`/`preload` prop) is expected to change, and — per §12 — its *emitted behavior* is expected not to change either, only its source expression.

---

## 14. Exact Implementation Manifest

| File | Change | Type |
| --- | --- | --- |
| `src/components/about/about-header.tsx` | Replace `priority` with `preload={true}` on the one `<Image>` element (line 100) | Source-level JSX prop rename; no runtime behavioral delta (§2, §12) |

No other file. No asset. No configuration file. No new dependency. No new component. No new utility.

---

## 15. Implementation Sequence

1. Confirm working tree is clean for `src/components/about/about-header.tsx` (it is, per the git-status baseline captured in §2/§18).
2. Edit `src/components/about/about-header.tsx`: replace `priority` with `preload={true}` on the `<Image>` element.
3. Run `pnpm lint` (equivalently `pnpm exec eslint`) — expect zero errors.
4. Run `pnpm typecheck` (equivalently `pnpm exec tsc --noEmit`) — expect zero errors.
5. Run `pnpm build` — expect success, with `/about`'s route classification unchanged.
6. Serve the production build (`pnpm start`) and perform the live checks in §11 (rendered portrait, dimensions, crop, no broken image, no layout shift) and §12 (preload `<link>`/resource-hint before/after comparison).
7. Perform the regression checks in §13 against `/about`'s rendered `<head>` and body.
8. Run `git status --short`, `git diff --stat`, and `git diff` and confirm the diff is scoped exactly as described in §18.
9. Stop. No further file is touched, and Task 8.6 is not started as part of this sequence.

---

## 16. Release Gate

- [ ] `priority` is replaced by `preload={true}` in `src/components/about/about-header.tsx`
- [ ] No other `<Image>` prop changes (`src`, `alt`, `fill`, `sizes`, `className`, `style` all byte-for-byte unchanged)
- [ ] Portrait still renders correctly on `/about` (live-rendered check, not source-only)
- [ ] Preload behavior is verified in production HTML/head output (before/after comparison, §12)
- [ ] Image dimensions and aspect ratio remain correct
- [ ] Crop (`object-cover` + `objectPosition: "30% 50%"`) remains unchanged
- [ ] Layout remains unchanged; no new CLS introduced
- [ ] `pnpm lint` (ESLint) passes
- [ ] `pnpm typecheck` (`tsc --noEmit`) passes
- [ ] `pnpm build` (production build) passes
- [ ] `/about`'s route classification remains unchanged
- [ ] Metadata (title/description) remains unchanged
- [ ] Canonical URL remains unchanged
- [ ] Open Graph remains unchanged
- [ ] Structured data remains unchanged (including the Person `image` node in `src/app/page.tsx`, untouched)
- [ ] RSS remains unchanged
- [ ] Sitemap remains unchanged
- [ ] Robots remains unchanged
- [ ] Search remains unchanged
- [ ] `git diff` contains only `src/components/about/about-header.tsx`
- [ ] No asset changes occurred (`public/images/portrait.jpeg` byte-identical)

---

## 17. Risks

| Risk | Assessment |
| --- | --- |
| Changed browser preload behavior | Very low — traced through Next.js's own source (§2, §12): both props resolve to the identical internal flag and identical emitted resource hint. The only residual risk is an undiscovered edge case in Next.js's own implementation, not in this change itself; §12's before/after comparison is the mitigation. |
| Accidental over-prioritization if the image is not actually important above the fold | Not applicable to this change — this plan does not alter *whether* the image is prioritized (it already was, and remains so); it only renames the prop expressing that pre-existing, already-justified decision (`docs/88` §17 confirms the portrait is a legitimate above-the-fold LCP candidate on `/about`). |
| Visual regression if Image props are accidentally altered | Low, and directly mitigated — §3 specifies the exact before/after diff; §11 is a live-rendered verification step specifically to catch this. |
| Framework-version incompatibility if the installed Next.js version differs from discovery | Not applicable — re-verified live this session (§2): installed version is 16.3.0, matching `docs/88`'s stated version exactly; no drift occurred between discovery and planning. |

No additional risks are asserted beyond what live evidence supports, per the task instructions' explicit "do not invent additional image risks."

---

## 18. Rollback

If the implemented change needs reverting: restore `priority` in place of `preload={true}` on the single `<Image>` element in `src/components/about/about-header.tsx`. This is a one-line, one-file revert.

No asset restoration is needed (no asset changes occur). No other rollback step is necessary.

This rollback is fully isolated from and does not touch:
- Task 8.1 (Metadata)
- Task 8.2 (Open Graph)
- Task 8.3 (Canonical URLs)
- Task 8.4 (Structured Data)
- Any other Milestone 8 or prior-milestone work, including the currently-uncommitted, pre-existing changes to other files already present in the working tree (`app/about/page.tsx`, `app/page.tsx`, `app/work/[slug]/page.tsx`, etc. — none of which this task touches, per the clean git-status baseline in §2)

---

## 19. Non-Goals

Explicitly excluded from this plan and from the implementation it describes: any change to `src`, `alt`, `fill`, `sizes`, `object-fit`/`object-position`, dimensions, styling, wrapper structure, or layout of the existing `<Image>`; any source asset change or new image variant; any `next.config.ts` change; any new image component, image utility, or image-processing pipeline; any new dependency; any change to `mdx-components.tsx`'s `Img()`; any change to `coverImage`/`logo` frontmatter handling; any general lazy-loading strategy (Task 8.6); any Lighthouse run or performance-metrics tuning (Task 8.7); any metadata, canonical URL, Open Graph, Twitter, structured-data, RSS, sitemap, robots, Search, or content/frontmatter change.

---

## 20. Final Recommendation

`READY FOR IMPLEMENTATION`

The plan is a single, narrowly-scoped, fully-traced prop rename on one existing `<Image>` element, re-verified live against both the vendored Next.js documentation and the installed package's own type declarations and runtime source. No contradiction between the discovery document and the live repository was found. No asset, configuration, or additional-file changes are justified or proposed.
