# TASK 8.5 — IMAGE OPTIMIZATION: DISCOVERY & ARCHITECTURE REVIEW

**Status:** Discovery and architecture review only. No implementation performed.

---

## 1. Executive Summary

The production application's entire image surface is one real, rendered asset: `public/images/portrait.jpeg` (1080×998, ~52 KB, JPEG), rendered exactly once, on `/about`, via `next/image` in `src/components/about/about-header.tsx`. Every other route in the application (`/`, `/knowledge`, `/knowledge/[slug]`, `/work`, `/work/library`, `/work/[slug]`, `/engineering-log`, `/engineering-log/[slug]`, `/search`, `/not-found`) renders **zero** raster images. There are no CSS background images, no remote images, no `next.config.ts` image configuration, and no populated `coverImage`/`logo` frontmatter fields anywhere in the 13 real content documents.

Re-verifying Task 8.4's finding: **confirmed, unchanged.** Zero content documents populate `coverImage`. The `Img` MDX component (`mdx-components.tsx`) that would render body-authored markdown images is wired up but **currently dead code** — no `.mdx` file in the repository contains markdown image syntax (`![...]()`), so it renders nothing in production today.

This task's own first principle — "do not optimize images merely because an image optimization task exists on the roadmap" — is directly on point here. There is exactly **one** evidence-backed optimization opportunity, and it is not a rendering, format, dimension, or responsiveness problem: it is that `about-header.tsx`'s `<Image>` uses the `priority` prop, which `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`'s own version history states was **deprecated in Next.js 16.0.0 in favor of `preload`** — a breaking-change class issue AGENTS.md explicitly instructs this repository to heed. Everything else about the one real image (dimensions, `sizes`, `fill`, format handling, caching, deployment compatibility) is already correctly implemented and should be preserved untouched.

**No production images require format conversion, dimension changes, responsive-source changes, or asset replacement.** The only justified future change is a one-line prop migration (`priority` → `preload`) on a single existing `<Image>` call — image-specific, evidence-backed, and compatible with the existing architecture.

---

## 2. Live Repository Re-Verification

Searched comprehensively per §3's required pattern list (`<img`, `Image`, `next/image`, `image:`, `coverImage`, `imageUrl`/`image_url`, `src=`, `background-image`, `url(`, `.svg`, `.png`, `.jpg`/`.jpeg`, `.webp`, `.avif`, `.gif`) across `src/`, `content/`, `public/`, and `next.config.ts`. Results:

| Search | Result |
| --- | --- |
| `from "next/image"` | 1 match: `src/components/about/about-header.tsx` |
| `<Image` (JSX) | 1 match: same file |
| `<img` (JSX/HTML) | 1 real usage: `src/components/content/mdx-components.tsx`'s `Img()` override (plus 2 comment mentions in `about-header.tsx`/`code-block.tsx` referencing it) |
| `src=` (image-like attribute) | 1 match: the portrait's `src="/images/portrait.jpeg"` |
| `background-image` / `url(...)` | 0 real matches (the only `url(` hit is `z.string().url()` in a Zod schema — unrelated) |
| `coverImage` | Schema (`schema.ts` ×2) + type/plumbing (`articles.ts` ×2) — 0 population in content |
| `imageUrl` / `image_url` | 0 matches |
| `.svg` files | 0 files in `src/` or `public/` — all icons are React components (`lucide-react` + 2 hand-written inline `<svg>` brand marks) |
| `.png`/`.jpg`/`.jpeg`/`.webp`/`.avif`/`.gif` | 1 file: `public/images/portrait.jpeg` (plus `src/app/favicon.ico`, not a `next/image` asset) |
| Markdown image syntax `![...]()` in `content/` | 0 matches across all 13 real documents |
| `bg- [url(...)]` / `bg- [image:...]` (Tailwind arbitrary; space inserted after the prefix so this table cell itself doesn't read as a live utility to Tailwind's own content scanner) | 0 matches |

No prior document's claims were taken on trust; every row above was independently re-derived this session by direct grep and file inspection, including opening `public/images/portrait.jpeg` itself to confirm its real dimensions (1080×998) and size (52,962 bytes) rather than reusing Task 8.4's stated figures.

---

## 3. Existing Image Architecture

- **Next.js version: 16.3.0.** This is the version whose `next/image` breaking changes are documented in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` (per AGENTS.md, that vendored doc — not training-data knowledge of "classic" Next.js — is the authority here). Relevant v16.0.0 changes: `priority` prop deprecated in favor of `preload`; `qualities` config now has an explicit default (`[75]`); `dangerouslyAllowLocalIP` and `maximumRedirects` added.
- **`next.config.ts`** is functionally empty: `{ /* config options here */ }`. No `images.domains`, `images.remotePatterns`, `images.formats`, `images.loader`, `images.deviceSizes`, `images.imageSizes`, or `images.qualities` overrides exist. This means every Next/Image default applies: `formats: ['image/webp']`, `qualities: [75]`, `deviceSizes: [640,750,828,1080,1200,1920,2048,3840]`, `imageSizes: [32,48,64,96,128,256,384]`.
- **Deployment model:** `next.config.ts` sets no `output: "export"`; `package.json` scripts are `next dev` / `next build` / `next start` — a standard Node.js runtime deployment, not a static export. No `vercel.json`/`netlify.toml` present. This means the built-in Next.js Image Optimization API (`/_next/image`) is available and compatible; nothing in the deployment model blocks `next/image`'s runtime optimization.
- **Icons are not raster images.** `lucide-react` (tree-shaken SVG-as-React-component icon library) supplies all standard icons; `src/components/shared/icons.tsx` hand-writes two inline `<svg>` brand marks (GitHub, LinkedIn) because Lucide dropped brand glyphs. Neither is a page-weight or optimization concern — no `.svg` files exist as static assets or `<img>`-referenced files anywhere in the repo.

---

## 4. Complete Image Inventory

Exactly one production image surface exists.

| # | Source | Path | Route(s) | Component | Format | Intrinsic dims | File size | Static/Dynamic | Above fold | Content-bearing | Alt text | Next/Image |
| - | - | - | - | - | - | - | - | - | - | - | - | - |
| 1 | Local static file | `public/images/portrait.jpeg` | `/about` | `src/components/about/about-header.tsx` | JPEG | 1080×998 | 52,962 bytes | Static | Yes | Yes (content: author portrait) | Yes — `"Portrait of Gracious Obeagu"` | Yes — `fill` mode |

No other image exists in the rendered output of any route. Sections 5–22 below evaluate this one surface exhaustively, plus the two adjacent non-rendering surfaces (the dead-code MDX `Img` path, and `favicon.ico`) for completeness.

---

## 5. Static Asset Inventory

```
public/fonts/.gitkeep      — empty placeholder directory
public/icons/.gitkeep      — empty placeholder directory
public/images/.gitkeep     — placeholder marker (portrait.jpeg lives alongside it)
public/images/portrait.jpeg — REAL, IN USE (see §4)
public/logos/.gitkeep      — empty placeholder directory
public/og/.gitkeep         — empty placeholder directory (pre-scaffolded for a future Open Graph image task; Task 8.2 explicitly did not populate it, and this task does not either — §34)
src/app/favicon.ico        — REAL, in use via Next.js's `app/favicon.ico` file convention (not `next/image`, not `public/`)
```

**Used by production:** `public/images/portrait.jpeg`, `src/app/favicon.ico`.
**Present but unused:** none — every non-`.gitkeep` file in these directories is either in active use or the directory is empty. There are no orphaned/unused raster or vector assets to catalogue. (Per §5/§28's own instruction, this would not be a deletion target even if one existed — it does not.)

`favicon.ico` is a Next.js App Router file-convention icon (25,931 bytes, ICO container with 16×16 and 32×32 32-bit frames), not a `next/image`-optimized asset and not part of the `next/image` pipeline — favicons are served as-is by design and are outside the "image optimization" surface this task's non-goals (§40) implicitly exclude (no metadata/manifest/icon convention changes are in scope). Documented for completeness; no action proposed.

---

## 6. Content Image Analysis

Re-verifying Task 8.4's finding directly against the live repository (not reusing its stated numbers uncritically):

- `articleFrontmatterSchema` (`src/lib/content/schema.ts:27`) — shared by Knowledge, Work, and Engineering Log — declares `coverImage: z.string().optional()`.
- `seriesFrontmatterSchema` (`src/lib/content/schema.ts:132`) declares its own, separate `coverImage: z.string().optional()`.
- `technologyFrontmatterSchema` declares `logo: z.string().optional()`.
- Across all 13 real content documents (7 Knowledge, 4 Work, 2 Engineering Log — independently recounted this session by listing `content/knowledge/`, `content/work/`, `content/engineering-log/` and excluding `.gitkeep` files), **zero** populate `coverImage`.
- Across `content/technologies/`, **zero** populate `logo`.
- Across `content/series/`, **zero** populate `coverImage`.
- `content/work/haya.mdx` was the one grep hit for the literal word "image" in `content/` — inspected directly: it is prose body text ("Image uploads and AI vision calls have different real-world…") describing a product feature, not a frontmatter field or an embedded image reference.

**Confirmed unchanged from Task 8.4.** `coverImage` is parsed into the in-memory `ArticleFrontmatter` type (`src/lib/content/articles.ts:91,193`) but that value is never read by any rendering component — `grep -rn "\.coverImage"` across `src/` returns only the schema/type-plumbing lines themselves, no consumer. The field exists, is optional, is prepared for future use, and is entirely unused today. This is architecture context, not an implementation task (per §6's own instruction) — documented here, not changed.

---

## 7. Image Rendering Analysis

**The one real image** (`portrait.jpeg`, `about-header.tsx:93-101`):

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

- **Intrinsic dimensions:** 1080×998 (real file).
- **Rendered dimensions:** container-driven via `fill` — `aspect-[3/4] w-full … md:w-72 lg:w-96` (parent `div`), i.e. up to 24rem (384px) wide × 4/3 tall (512px) at `lg:`, 18rem at `md:`, full container width below `md:`.
- **Width/height attributes:** intentionally absent — `fill` is used instead, with the aspect ratio owned by the parent container's `aspect-[3/4]` Tailwind class rather than fixed `width`/`height` props. This is a documented, deliberate choice (component docstring, `about-header.tsx:56-59`): the container, not the image, owns the responsive size.
- **`sizes`:** present and correctly tiered to the three breakpoints the layout actually uses (`24rem` / `18rem` / `100vw`), matching the CSS (`md:w-72 lg:w-96`) almost exactly (`18rem` = `w-72`, `24rem` = `w-96`). No mismatch found.
- **`loading`:** not set explicitly — moot, because `priority`/`preload` supersedes `loading="lazy"` regardless (Next.js throws if both are set together; only one is present here).
- **`decoding`:** not set — defaults to `async` (Next.js's own default, appropriate).
- **`quality`:** not set — defaults to `75`, which matches the config-default `qualities: [75]` allowlist exactly, so no `next.config.ts` change is forced by this prop.
- **`placeholder`:** not set — defaults to `empty`. See §19 for whether this is a gap.
- **`fetchPriority`:** not set explicitly, but `priority`/`preload` internally sets `fetchpriority="high"` on the underlying `<img>` (confirmed in `node_modules/next/dist/client/image-component.js`).
- **Object fit/position:** `object-cover` + `objectPosition: "30% 50%"` — a deliberate crop documented in the component's own docstring to exclude a QR/watermark element in the source photo's corner, confirmed against the real file's dimensions rather than estimated.

**The dead-code MDX path** (`mdx-components.tsx`'s `Img()`, lines 262-278): renders a raw `<img loading="lazy" className="mb-6 w-full rounded-lg" {...props} />` for any markdown-authored image. It exists to handle images with unknown dimensions from author-controlled markdown, and its own inline comment already states the trade-off explicitly: *"full `next/image` optimization is a future enhancement, not a regression introduced here."* Since no content document currently contains markdown image syntax, this path renders nothing in production today — there is no live image to evaluate dimensions, format, or responsiveness for. Confirmed dead code by exhaustive grep of `content/` for `![`.

---

## 8. Next/Image Analysis

Only one call site: `about-header.tsx` (above). Evaluated against §8's checklist:

| Question | Finding |
| --- | --- |
| Where used | `about-header.tsx` only |
| `sizes` specified | Yes, and correctly tiered to the actual responsive container widths |
| `fill` used | Yes, deliberately (container owns aspect ratio) |
| Dimensions correct | N/A under `fill` — aspect ratio is CSS-owned (`aspect-[3/4]`), matches the source photo's real proportions reasonably (1080:998 ≈ 1.08:1 source, cropped to 3:4 portrait presentation) |
| `priority` used | Yes — **and this is the one finding**: `priority` was deprecated in Next.js 16.0.0 in favor of `preload` (§3). Still functions today (traced into `get-img-props.js`: `preload: preload || priority` — no runtime warning currently emitted), but is documented as deprecated in the vendored Next.js docs this exact repo ships with. |
| `fetchPriority` used | Not set explicitly; implied `high` via `priority`/`preload` |
| Quality customized | No — default `75`, matches config default |
| Placeholders used | No (`placeholder="empty"`, the default) — see §19 |
| Format optimization | Automatic — `next/image`'s runtime optimization already re-encodes to WebP (the config default `formats: ['image/webp']`) for supporting browsers, regardless of the JPEG source. No source-format conversion is needed to get this benefit; it is already active. |
| Responsive sizes correct | Yes — `sizes` matches the real breakpoints used |
| Loader customized | No — uses Next.js's default built-in loader (appropriate; no CDN/custom pipeline exists or is needed at this scale) |
| Remote patterns configured | N/A — no remote images exist (§12) |

**Conclusion:** the one real `next/image` usage is materially well-implemented. The single deprecated-prop issue is the only justified change; everything else in this section is a "Preserve."

---

## 9. Raw `<img>` Analysis

One raw `<img>` exists in the codebase, `mdx-components.tsx`'s `Img()` (§7). Evaluated:

- **Why raw `<img>` is used:** markdown-authored images carry no known width/height at author time, which `next/image` requires unless `fill` is used — and `fill` needs a positioned parent this generic MDX-body component doesn't control per-instance. This is a deliberate, already-documented trade-off (component's own comment), not an oversight.
- **Local or remote:** unknown/either — markdown authors could reference either, and none has done so yet.
- **Could Next/Image replace it:** architecturally, yes, with more work (e.g. wrapping in a sized/positioned container, or requiring authors to supply dimensions) — but there is no live image to validate that change against, and no evidence any content author is about to add one.
- **Would replacement materially improve performance today:** no — 0 real images render through this path in production. Any "optimization" here would be speculative work against a hypothetical future image, which §2 ("First Principle") explicitly instructs against.
- **Decision:** Defer (§41). This belongs to a future task triggered by actual content gaining inline images, not Task 8.5 today.

No other raw `<img>` usage exists anywhere in `src/`.

---

## 10. SVG Analysis

- No `.svg` files exist as static assets anywhere in `public/` or `src/`.
- No SVG is referenced via `<img src="*.svg">`, CSS `url(*.svg)`, or `next/image`.
- All icons are either `lucide-react` React components (tree-shaken at build time, not runtime-fetched image files) or two hand-written inline `<svg>` elements in `src/components/shared/icons.tsx` (GitHub and LinkedIn brand marks — each a small, static `<path>` embedded directly in JS/TSX, a few hundred bytes of path data).
- **No SVG represents a meaningful page-weight problem.** There is nothing to optimize in this category — confirmed absence, not an oversight.

---

## 11. CSS Background Image Analysis

Searched for `background-image` and `url(...)` across all source files. Zero real matches — the only `url(` hits in the entire codebase are unrelated Zod validator calls (`z.string().url()` in `schema.ts`, validating that `officialWebsite` frontmatter values are well-formed URL strings, not image references). **No CSS background image exists anywhere in this application.** Nothing to inventory, evaluate, or optimize in this category.

---

## 12. Remote Image Analysis

- `next.config.ts` has no `images.domains`, no `images.remotePatterns`, no `images.loader`, no `images.path`.
- No `<Image src="https://...">` or `<img src="https://...">` exists anywhere in `src/` or `content/`.
- No frontmatter field in any real content document references an external image URL.
- **Zero remote images exist in production.** This is a genuinely empty category, not an unexamined one — confirmed by the same exhaustive `src=` grep used for §4's inventory, which returned exactly one hit (the local portrait).

---

## 13. Image Format Analysis

The one real raster asset is JPEG (`portrait.jpeg`), which is the correct source format for a photographic portrait (lossy compression suits continuous-tone photography; PNG would be inappropriately large for this content type, and the source has no transparency requirement). Next.js's default `images.formats: ['image/webp']` configuration means the runtime Image Optimization API **already** transcodes this JPEG to WebP on the fly for supporting browsers, with no source-file or configuration change required to get that benefit — it is active today, out of the box. Converting the *source* file to WebP manually would not add anything Next/Image doesn't already provide at request time, and would remove the one advantage of keeping a JPEG source (universal fallback for any client that skips the optimizer, e.g. if `unoptimized` were ever set, or for direct disk access). **No format conversion is justified.**

No other raster image exists to evaluate (favicon.ico is an OS-level icon container format, not part of the `next/image`/WebP/AVIF evaluation — outside this task's scope per §40's implicit "no format-conversion work beyond the actual image surface").

---

## 14. Image Dimension Analysis

- **Source dimensions:** 1080×998 — not oversized relative to its largest rendered size (384×512 CSS pixels at `lg:`, i.e. up to roughly 768×1024 physical pixels at 2x DPR). The source comfortably covers up to ~2x DPR at the largest breakpoint without upscaling artifacts, and Next/Image's `deviceSizes`/`imageSizes` machinery downsamples it for smaller viewports automatically — it is not undersized either.
- **Aspect ratio:** source is 1080:998 (≈1.08:1, very slightly wider than tall); presentation crops to `aspect-[3/4]` (0.75:1, portrait). This is a deliberate CSS-level crop (`object-cover` + `objectPosition: "30% 50%"`), not a mismatch or bug — documented in the component's own comment as intentionally excluding a watermark in the source photo's corner, verified against the real file's pixel dimensions rather than estimated.
- **Layout-shift risk:** none. `fill` mode inside a container with a fixed `aspect-[3/4]` class reserves the correct box before the image loads, exactly the mechanism Next/Image's own docs recommend for this case (§7/§8 of the vendored `image.md`: *"If the height and width are unknown, we recommend using the `fill` property"* combined with a sized parent). No CLS risk exists for this image.
- No other image exists to evaluate for dimension correctness.

---

## 15. Responsive Image Analysis

The one real image already has a correctly tiered `sizes` attribute (§7/§8) that matches its actual responsive container widths at each breakpoint. Because `sizes` is present, Next.js generates a full `srcset` (not just the limited 1x/2x set) using the configured `imageSizes`/`deviceSizes` arrays — meaning a phone viewport genuinely downloads a smaller variant than a desktop viewport does, out of the box, with zero custom configuration. There is no evidence of a single oversized source being downloaded across all viewports — the opposite is already true. **This is a "Preserve," not an "Optimize."**

No art-direction requirement exists (no evidence of a need for a different crop/image on mobile vs. desktop beyond the responsive `sizes` already in place).

---

## 16. Loading / Priority Analysis (image-specific only — see §24 for the 8.5/8.6 boundary)

The portrait is above the fold on `/about` (it is inside `AboutHeader`, the page's opening section, rendered alongside the page's only `<h1>`). `priority`/`preload` eager-loads it and marks it `fetchpriority="high"` — the correct behavior for a genuinely above-the-fold, plausible-LCP image (§17). This is already correct; the only change is the deprecated prop name used to express it (§3/§8).

The MDX `Img()` component's `loading="lazy"` is appropriate *if and when* a below-fold body image ever exists (markdown body content is definitionally below the page's own header), but again — no live image exercises this today (§7/§9).

This section evaluates image-specific loading attributes only, per the explicit 8.5/8.6 boundary in §24 — no general lazy-loading strategy is proposed or implied here.

---

## 17. Priority / LCP Analysis

- **Is any image plausibly the LCP element?** Yes — the portrait, on `/about` only, is a large, above-the-fold visual element rendered as part of the page's opening section. It is a reasonable LCP candidate on that one route.
- **Is `priority`/`preload` justified there?** Yes, and it is already applied. No change to *whether* eager loading happens — only to *which prop name* expresses it (§3).
- **Is lazy loading harmful anywhere currently?** No evidence of it being used where it shouldn't be — the only `loading="lazy"` usage is on the currently-inert MDX body-image path, which is correct for content that (when it exists) sits below the page header.
- **Do image dimensions affect LCP here?** The `fill` + `aspect-[3/4]` container reserves layout space immediately, so the image itself doesn't contribute CLS-driven LCP delay; actual paint timing is dependent on network/transcode latency for the optimized variant, which is unmeasured (no Lighthouse baseline exists — §22/§23) and out of scope to benchmark under Task 8.5 (that's Task 8.7's job, §24/§26).
- **No other route has an LCP-candidate image** — every other route renders zero images, so LCP on those routes is necessarily driven by text/layout, not an image.

---

## 18. Alt Text Analysis

The one real image has meaningful, non-redundant alt text: `"Portrait of Gracious Obeagu"` — describes the image content accurately, is not decorative (so a non-empty `alt` is correct per the vendored Next.js docs' own guidance), and is not duplicated elsewhere on the page in a way that would make it redundant. **No alt-text change is justified or proposed.** Per §18's own instruction, this task does not expand into a general accessibility audit — this is the only image in the application, and its alt text is already correct.

---

## 19. Image Metadata / SEO Analysis

The portrait already participates in structured data: `src/app/page.tsx`'s `personNode` (Task 8.4's implemented output, confirmed live in the repository) includes:

```ts
image: {
  "@type": "ImageObject",
  url: `${SITE_URL}/images/portrait.jpeg`,
  width: 1080,
  height: 998,
},
```

This is Task 8.4's own documented "one narrow, well-evidenced exception" (`docs/86` §26) and is **out of scope to modify here** (§33/§40 — no structured-data changes). Documented for completeness only, confirming the discrepancy-free state between what `docs/86` proposed and what is actually live in `src/app/page.tsx` today (§Discrepancies below finds none).

The portrait does **not** participate in Open Graph or Twitter Card metadata — Task 8.2 explicitly did not implement `og:image`/`twitter:image` (`docs/82`), and this task does not introduce them either (§34/§40). `public/og/` remains an empty, pre-scaffolded directory.

The portrait does not participate in the favicon or a web manifest — no `manifest.json` exists in this repository, and `favicon.ico` is unrelated to `public/images/portrait.jpeg`.

---

## 20. Placeholder / Blur Strategy

The one real image uses `placeholder="empty"` (the default) — no blur-up placeholder. Evaluated against §20's evidence requirement:

- The image is served via a local static file (not a static *import*, i.e. not `import portrait from "../../public/images/portrait.jpeg"`), so Next.js does **not** automatically generate a `blurDataURL` for it the way it would for a statically imported image (per the vendored docs' "Automatic" `blurDataURL` behavior, which requires a static `import`).
- Adding a blur placeholder would require either switching to a static import (a real, low-risk, image-specific change compatible with the existing architecture) or manually authoring a `blurDataURL`, which §20 explicitly forbids fabricating.
- **Evidence of need:** the image is a small file (52 KB) already served with `priority`/`preload` (i.e., it starts loading immediately, in the `<head>`, before the rest of the page's content is discovered) on a route with no other above-the-fold competing image. There is no measured evidence (no Lighthouse baseline exists — §22) that this image's load time causes a perceptible blank-box period severe enough to warrant a placeholder.
- **Decision: Reject for now, note as a low-cost future option.** Switching the `src` to a static `import` would be the natural mechanism if this were ever pursued (it would also auto-provide `width`/`height`, though `fill` already sidesteps needing those) — but §20 requires evidence, not merely an available option, and no evidence of a real loading-experience problem exists today.

---

## 21. Image Caching Analysis

- Next.js's built-in Image Optimization API is runtime-based by default (`/_next/image`), with on-disk caching (`minimumCacheTTL` default 4 hours, `maximumDiskCacheSize` default 50% of available disk checked at startup) — both unconfigured, both left at Next.js defaults, both fine at this repository's scale (one image, no traffic-driven cache-churn evidence).
- No CDN-layer cache-header evidence exists to inspect (no deployment/CDN configuration files found — §22).
- **No meaningful image-caching concern exists.** Default behavior is appropriate for a single-image, low-traffic-evidence portfolio site; nothing here justifies a `minimumCacheTTL`/`maximumDiskCacheSize` override.

---

## 22. Deployment Compatibility

- `next.config.ts` sets no `output: "export"` — the app is not statically exported, so the Next.js Image Optimization runtime API is available (a static export would disable server-side image optimization and require `unoptimized: true` or a custom loader; neither applies here).
- `package.json` scripts (`next dev` / `next build` / `next start`) indicate a standard Node.js server runtime.
- No `vercel.json`, `netlify.toml`, or other hosting-specific config file exists in the repository root to inspect for CDN/edge-specific image behavior — none is assumed; this document does not guess at Vercel-specific behavior per §22's own instruction.
- **Conclusion:** the existing, unmodified `next/image` configuration is fully compatible with the actual deployment model as evidenced by the repository. No infrastructure change is required or proposed.

---

## 23. Existing Performance Evidence

Searched `docs/` for `Lighthouse`, `Core Web Vitals`, `LCP`, `CLS`, `PageSpeed`, `performance`, `image(s)` (§23's exact instruction). Findings:

- No prior Lighthouse report, PageSpeed result, or Core Web Vitals measurement exists anywhere in this repository.
- `docs/79-MILESTONE_8_ROADMAP_REVIEW.md` (§123-129 of that doc) already independently identified the same facts this document re-confirms: `next/image` used exactly once (the portrait), MDX images use a deliberate raw `<img loading="lazy">`, and `next.config.ts` carries no image configuration. No discrepancy between that document and this one's live re-verification.
- **No performance baseline exists.** Per §23's own instruction, this is documented as a fact, not treated as a blocker to discovery, and no baseline is fabricated. Establishing one (image count/payload per route, largest image, CLS/LCP measurement) is §37's job below, using only what is directly countable from the inventory already built — not a Lighthouse run, which would properly belong to Task 8.7 (§24).

---

## Image Optimization Opportunity Matrix

| Image Surface | Current State | Problem | Evidence | Proposed Optimization | Benefit | Risk | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `about-header.tsx` `<Image>` (`portrait.jpeg`) | `next/image`, `fill`, correct `sizes`, `priority` prop | `priority` is a deprecated prop name (Next.js 16.0.0+) | `node_modules/next/dist/docs/.../image.md` version history, line "`priority` prop deprecated" in favor of `preload`; confirmed still functional (no breakage) via `get-img-props.js` trace | Replace `priority` with `preload` (identical boolean semantics: `preload={true}`) | Forward-compatibility with the vendored Next.js version's own documented API surface; removes reliance on a prop the framework's own docs flag for eventual removal; zero behavioral change today | Extremely low — same underlying effect (`preload || priority` internally), one prop rename, one file, no visual/behavioral difference expected | Task 8.5 (image-specific `next/image` prop correctness) |
| `about-header.tsx` `<Image>` — dimensions, `sizes`, `fill`, `object-fit`/`object-position` | Already correct (§7/§8/§14/§15) | None found | Direct inspection: `sizes` matches real breakpoints; `aspect-[3/4]` prevents CLS; crop excludes watermark deliberately | None — preserve as-is | N/A | N/A | Preserve |
| `about-header.tsx` `<Image>` — format | JPEG source, WebP served automatically at request time via Next/Image default `formats` | None — already optimized by the existing pipeline | `next.config.ts` has no override, so the Next.js default `formats: ['image/webp']` applies | None | N/A | Converting the source file would remove the universal-fallback benefit of a JPEG original for no measurable gain | Preserve |
| `about-header.tsx` `<Image>` — placeholder/blur | `placeholder="empty"` (default); no `blurDataURL` | Possible (unproven) perceived-loading gap | No measured evidence (no Lighthouse baseline exists) of a real problem; static-import switch would be the natural enabling mechanism if pursued later | None proposed now | Would be small, and unproven | Fabricating a `blurDataURL` is explicitly forbidden (§20); a static-import switch is a real option but unjustified without evidence | Reject-for-now / Defer |
| `mdx-components.tsx` `Img()` (MDX body images) | Raw `<img loading="lazy">`, deliberately not `next/image` | None currently rendered — 0 live images exist | Exhaustive `content/` grep for `![` returns zero matches | None — no live image exists to optimize | N/A | Building `next/image` support for a hypothetical future image would be speculative work | Defer (contingent on future content gaining inline images) |
| `coverImage` (schema field, Knowledge/Work/Series) | Optional, unused, not rendered by any component | None — no live image exists | 0/13 real documents populate it; zero rendering consumers found (`grep -rn "\.coverImage"`) | None | N/A | N/A | Defer (contingent on future content authoring; would also require new rendering code, itself image-specific work for a later task) |
| `logo` (technology frontmatter field) | Optional, unused | None — no live image exists | 0 technology entries populate it | None | N/A | N/A | Defer |
| `favicon.ico` | Standard Next.js file-convention icon, already served | None found | Real, in-use, correctly sized ICO container (16×16/32×32) | None | N/A | N/A | Preserve (out of `next/image` scope entirely — a file-convention icon, not an "image optimization" surface) |
| Remote images | None exist | N/A | Exhaustive `src=`/`next.config.ts` search: zero remote image references anywhere | None | N/A | N/A | N/A — nonexistent category |
| CSS background images | None exist | N/A | Exhaustive `background-image`/`url(` search: zero real matches | None | N/A | N/A | N/A — nonexistent category |
| SVGs | None as static assets; all icons are JS/inline | N/A | Zero `.svg` files in repo; icons confirmed as `lucide-react` components + 2 tiny inline `<svg>` | None | N/A | N/A | N/A — nonexistent category |

---

## Task 8.5 vs Task 8.6 Boundary

- **In Task 8.5's scope, addressed above:** the `priority`→`preload` prop migration is image-specific `next/image` configuration correctness, not a lazy-loading *strategy* decision — it changes which prop name expresses an already-correct eager-load/high-fetch-priority behavior, it does not change *when* anything loads.
- **Explicitly deferred to Task 8.6, not touched here:** any general lazy-loading strategy for non-image content (below-fold component lazy loading, `next/dynamic` for deferred rendering, general loading boundaries). No such work exists in this repository yet beyond the MDX `Img()`'s already-present `loading="lazy"` (itself image-specific and inert today, per §9), so there is nothing to hand off from this document beyond noting the boundary explicitly, as required.
- No finding in this document was absorbed into 8.6-shaped work, and no 8.6-shaped work was pulled into this document's proposed manifest.

---

## Optimize / Preserve / Defer / Reject Decisions

### Optimize
- `src/components/about/about-header.tsx` — replace the deprecated `priority` prop with `preload={true}` on the one `<Image>` call. (§8, §29, Opportunity Matrix row 1.)

### Preserve
- `about-header.tsx`'s `<Image>` `fill`, `sizes`, `object-fit`/`object-position`, dimensions, and implicit format handling — all already correctly implemented (§7, §8, §13, §14, §15).
- `favicon.ico` — correctly served via Next.js's own file convention; not part of the `next/image` pipeline.
- `next.config.ts`'s absence of image configuration — appropriate at this repository's actual image surface (one local image, zero remote images); adding `remotePatterns`/`domains`/custom `loader`/`formats` overrides would be unjustified speculative configuration.
- Existing image caching behavior (default `minimumCacheTTL`/`maximumDiskCacheSize`) — no evidence of a caching problem (§21).

### Defer
- `mdx-components.tsx`'s `Img()` gaining `next/image` support — contingent on a future content document actually containing a markdown image; no such document exists today (§9, §41).
- `coverImage`/`logo` frontmatter fields gaining a rendering path (e.g., Card thumbnails) — contingent on future content authoring populating these fields; would itself be new, not-yet-designed rendering work, and is explicitly the kind of "manufactured work" §2's First Principle instructs against absent that content (§6, §41).
- A `blurDataURL`/placeholder strategy for the portrait — technically available via a static-import switch, but unjustified without a measured loading-experience problem (§20, §41).
- Any Lighthouse-measured LCP/CLS baseline for `/about`'s portrait — belongs to Task 8.7 (§24, §26, §37).
- General lazy-loading strategy for non-image content — belongs to Task 8.6 (§24 boundary above).

### Reject
- Source-format conversion of `portrait.jpeg` to WebP/AVIF — the runtime pipeline already provides this benefit without a source change; converting the source would only remove the JPEG fallback with no measurable gain (§13).
- Replacing the MDX `Img()`'s raw `<img>` with `next/image` today — no live image exercises this path; would be speculative, not evidence-backed (§9, §2).
- Any change to `next.config.ts`'s `images` block — no real image surface (remote images, custom qualities, alternate formats) justifies one (§12, §29).
- Deleting any `.gitkeep`-only static asset directory as "unused" — explicitly out of scope per §5's own instruction, and none of these directories contains anything to delete regardless.

---

## Exact Future Production Implementation Manifest

Exactly **one** production file is justified for a future Task 8.5 implementation:

### `src/components/about/about-header.tsx`
- **Why it changes:** the `<Image>` call's `priority` prop is deprecated as of Next.js 16.0.0 (this repository's actual installed version, per `package.json`) in favor of `preload`, per the vendored Next.js docs this repository ships with (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`).
- **Image responsibility:** this component renders the application's one and only real content image (the About-page portrait).
- **Exact optimization:** replace the `priority` boolean prop with `preload={true}` on the single `<Image>` element (lines 93-101 as of this review). No other prop, no other line, changes.
- **Expected effect:** none observable to end users — `preload` and `priority` produce identical underlying behavior today (`preload: preload || priority` in Next.js's own `get-img-props.js`). The effect is purely forward-compatibility with the framework's documented, current API surface.
- **Runtime or build-time:** neither — this is a source-level JSX prop rename with no runtime behavioral delta and no build-configuration implication.

### Files inspected but explicitly excluded from the manifest

| File | Why excluded |
| --- | --- |
| `src/components/content/mdx-components.tsx` | Its `Img()` raw `<img>` renders no live image (0 content documents contain markdown images) — no change is evidence-backed today (§9, Defer). |
| `next.config.ts` | No real image surface (remote images, non-default formats, custom qualities) justifies any `images` configuration key (§12, §29, Reject). |
| `src/app/page.tsx` | Contains the Person `image` structured-data node from Task 8.4 — explicitly out of scope; no structured-data changes permitted (§33/§40). |
| `src/lib/content/schema.ts`, `src/lib/content/articles.ts` | `coverImage`/`logo` fields are unused-but-prepared; no content or schema changes permitted (§6/§32). |
| `src/components/ui/card.tsx` | Its `has-[>img:first-child]` CSS is pre-existing, dormant scaffolding for a hypothetical future Card-with-image; no Card instance renders an image anywhere today — no change justified (§6, Defer). |
| `src/app/favicon.ico` | Out of the `next/image` optimization surface entirely (file-convention icon, not `next/image`-managed) — no change proposed (§5). |
| All other route files (`app/page.tsx`, `app/knowledge/**`, `app/work/**`, `app/engineering-log/**`, `app/search/page.tsx`, `app/not-found.tsx`) | Render zero images — confirmed by the same exhaustive grep used for §4's inventory. Nothing to optimize. |

**If no production changes were justified at all, this document would say so explicitly (§27's own instruction) — that is not the case here: exactly one, narrowly-scoped, low-risk change is justified, and it is stated above deterministically.**

---

## Exact Asset Manifest

**No image asset requires replacement, resizing, re-encoding, or any other modification.**

| Asset | Current format | Current dimensions | Current size | Proposed format | Proposed dimensions | Source replacement needed? | References need changing? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public/images/portrait.jpeg` | JPEG | 1080×998 | 52,962 bytes | JPEG (unchanged) | 1080×998 (unchanged) | No | No |
| `src/app/favicon.ico` | ICO (16×16 + 32×32) | as shipped | 25,931 bytes | Unchanged | Unchanged | No | No |

No asset is modified by this discovery, and none is proposed for modification by the future implementation manifest above (§31/§32 compliance).

---

## Implementation Sequence

1. Edit `src/components/about/about-header.tsx`: change `priority` to `preload={true}` on the single `<Image>` element.
2. Visually verify `/about` renders the portrait identically (no layout, crop, or loading-order regression) in both light and dark themes, desktop and mobile viewport widths.
3. Confirm no TypeScript/build error results from the prop rename (both props exist on the current `next/image` type surface, per `get-img-props.js`, so none is expected).
4. No other step exists — this is a one-file, one-line change with no dependent files, no config changes, and no asset changes.

---

## Release Gate

- [x] Every actual production image surface was identified (§2, §4)
- [x] Static assets were inspected (§5)
- [x] Content image fields were re-verified (§6)
- [x] Next/Image usage was inspected (§8)
- [x] Raw `<img>` usage was inspected (§9)
- [x] SVG usage was inspected (§10)
- [x] CSS background images were inspected (§11)
- [x] Remote images were inspected (§12)
- [x] Image formats were identified (§13)
- [x] Image dimensions were verified (§14, direct file inspection)
- [x] Responsive behavior was evaluated (§15)
- [x] Loading/priority behavior was evaluated (§16, §17)
- [x] Image-related performance evidence was inspected (§23 — none exists, documented as such)
- [x] Task 8.5 vs Task 8.6 boundary is explicit (Task 8.5 vs Task 8.6 Boundary section)
- [x] Every proposed optimization has evidence (Opportunity Matrix)
- [x] Exact future production manifest exists (Exact Future Production Implementation Manifest)
- [x] Exact asset manifest exists (none required changes — stated explicitly)
- [x] Deployment compatibility is understood (§22)
- [x] Risks are documented (Risks section)
- [x] Rollback is documented (Rollback section)
- [x] Non-goals are explicit (Non-Goals section)
- [x] No implementation was performed
- [x] No production files were modified
- [x] No assets were modified

---

## Risks

| Risk | Applies here? | Reasoning |
| --- | --- | --- |
| Visual regression | Low | The `preload`/`priority` change is behaviorally identical; no visual prop changes |
| Incorrect image dimensions | None | No dimension change proposed |
| Cropping changes | None | No crop/`objectPosition` change proposed |
| Broken remote images | N/A | No remote images exist |
| Unsupported formats | None | No format change proposed |
| Next/Image runtime overhead | None | No new `next/image` usage introduced; the existing one is unchanged in behavior |
| CDN/cache behavior | None | No caching configuration changed |
| Increased build size | None | Zero-byte-delta prop rename |
| LCP regression | Very low | `preload` produces identical eager-loading/`fetchpriority=high` behavior to `priority` (traced in Next.js source) |
| CLS regression | None | No layout/`fill`/aspect-ratio change proposed |
| Accessibility regression | None | Alt text unchanged |
| Incorrect `sizes` | None | `sizes` unchanged |
| Unnecessary optimization complexity | Actively avoided | This document's own Reject/Defer sections exist specifically to prevent introducing unjustified complexity (blur placeholders, format conversion, remote-image config, Card-image rendering) that no live evidence supports |

---

## Rollback

If the future `priority`→`preload` change is implemented and needs reverting: revert only the single line change in `src/components/about/about-header.tsx` (restore `priority` in place of `preload={true}`). No asset changes exist to restore, since none are proposed. This rollback is fully isolated from and does not touch:
- Task 8.1 (Metadata)
- Task 8.2 (Open Graph)
- Task 8.3 (Canonical URLs)
- Task 8.4 (Structured Data, including the Person `image` node in `src/app/page.tsx`)
- Any other Milestone 8 or prior-milestone work

---

## Non-Goals

Explicitly excluded from this document and from the future implementation it describes: structured data / JSON-LD changes, metadata title/description changes, canonical URL changes, Open Graph / Twitter changes, RSS changes, sitemap changes, robots changes, Search implementation changes, content/frontmatter changes, content schema changes, general lazy-loading architecture (Task 8.6), dynamic component lazy loading (Task 8.6), Lighthouse-wide optimization (Task 8.7), JavaScript bundle optimization, CSS optimization, font optimization, server optimization, caching-architecture redesign, CDN migration, new image generation, and new visual assets. None of these was touched during this discovery, and none is proposed by its output.

---

## Final Recommendation

`READY FOR ARCHITECTURE REVIEW`

The image surface is small, fully mapped, and almost entirely already well-implemented. The one justified change — a deprecated-prop migration on a single existing `<Image>` call — is narrow, low-risk, evidence-backed by this repository's own vendored Next.js documentation, and does not require inventing work to satisfy the roadmap. No content images, remote images, CSS backgrounds, or SVG assets exist to optimize. `coverImage`/`logo` frontmatter fields and the MDX `Img()` component are real architecture, correctly left untouched pending future content that would actually exercise them.
