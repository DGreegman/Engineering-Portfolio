# Engineering Desk warm refinement

## Design and shared components

The portfolio uses the approved warm ivory, rust, and charcoal palette in both
themes. Shared layout and button styles preserve centered content, responsive
gutters, clear focus states, and consistent action sizing. Compact icon and
pagination controls remain compact. Project cards and detail pages use the
same optimized VaultPay, GoHunt, and Haya illustrations; the imagery is
descriptive conceptual artwork, not captured product screens or project data.
The GO favicon is defined in the static app icon assets. The 1200 × 630 social
sharing image is `public/og/engineering-desk.png` and identifies Gracious as a
Software Engineer and Technical Lead, consistent with its metadata alt text.

## Static export and SEO behavior

Next.js is configured with `output: "export"`, and static images use
`unoptimized: true` for static-host compatibility. MDX is prepared before the
build and lint/typecheck commands. A successful build writes the site to
`out/`; the postbuild script adds `out/_headers` only when
`SITE_DEPLOYMENT_ENV=preview`, with `X-Robots-Tag: noindex, nofollow`, and
removes that file for other build environments.

The canonical origin is resolved centrally in `src/lib/constants/site.ts`.
The intended production origin is `https://gracious.diftrak.com`. Cloudflare
Pages preview builds use the supplied `CF_PAGES_URL`, so each preview's
canonical metadata, RSS links, and sitemap entries use its own Pages origin.
Indexing remains explicitly opt-in: `SITE_INDEXING_ENABLED=true` is required
along with the production environment and approved origin/branch checks.
Preview builds remain noindex. Their `robots.txt` allows crawling so crawlers
can see page-level noindex metadata, and does not advertise a sitemap. The
static `sitemap.xml` is still generated with that preview's origin; the robots
file only advertises it when the indexing gate passes. The `/search` route
remains noindex independently.

The GitHub Actions CI workflow installs from the frozen pnpm lockfile, runs
typecheck, lint, formatting, and builds with Next.js Webpack mode. CI supplies
the confirmed production origin but sets indexing off; CI is validation only
and does not deploy.

## Cloudflare Pages preview

The approved preview is a separate direct-upload Cloudflare Pages project
named `engineering-desk-preview`, served at
`https://engineering-desk-preview.pages.dev`. It uses the exported `out/`
directory and a preview-only noindex header. It is not connected to GitHub and
has no custom domain. No DNS, the Diftrak company Pages project, or the
existing Vercel deployment is changed by this preview workflow.

## Contact and separate company identity

Portfolio contact links and visible professional email addresses use
`gracious@diftrak.com`. The company website is separate and retains
`hello@diftrak.com`; this portfolio repository does not change the company
website. The company link remains `https://diftrak.com/`.

## Validation record

The current validated local checks for this refinement are:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run format:check`
- Static export with explicit preview variables and `pnpm run build --webpack`
- Generated HTML/SEO and internal-link checks against `out/`
- `git diff --check`

The preview export is expected to contain noindex metadata, preview-origin
canonical URLs, preview-origin RSS and sitemap URLs, no sitemap directive in
`robots.txt`, and the preview-only `_headers` rule. The automated internal
link scan checks links among exported HTML routes. Browser rendering and
interactive visual checks are separate from these command-line checks and
should be recorded only when run in a browser.
