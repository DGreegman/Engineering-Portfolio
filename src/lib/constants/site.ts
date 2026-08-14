/**
 * Site Constants
 *
 * Identity and external-link values referenced from more than one place
 * (Header, Footer, Contact, and SEO metadata) — kept here once so none of
 * them re-type the same string.
 */

/** docs/01-PERSONAL_BRAND.md's documented identity. */
export const SITE_NAME = "Gracious Obeagu";

export const GITHUB_URL = "https://github.com/DGreegman";

export const LINKEDIN_URL = "https://linkedin.com/in/gracious-obeagu";

export const CONTACT_EMAIL = "graciousobeagu@gmail.com";

/**
 * The documented future RSS route (docs/10-Technical Architecture.md's
 * Routing section). Live as of Task 6.6 (`src/app/rss.xml/route.ts`).
 */
export const RSS_PATH = "/rss.xml";

/**
 * The site's own absolute origin — Task 6.6's central finding
 * (docs/46-RSS_EXPERIENCE.md §7, docs/47-RSS_IMPLEMENTATION_PLAN.md WI-1):
 * the first value in this repository that anything needs an absolute URL
 * for. RSS's `<link>`/`<guid>` elements require one; Sitemap
 * (docs/48-SITEMAP_EXPERIENCE.md) will need the identical value and is
 * expected to import this constant directly rather than declare its own.
 *
 * Deliberately unprefixed — not `NEXT_PUBLIC_SITE_URL`. Every current
 * consumer (`app/rss.xml/route.ts`, and Sitemap's own future `sitemap.ts`)
 * is 100% server-only code; the `NEXT_PUBLIC_` prefix exists specifically
 * to inline a value into client-side bundles, which nothing here does.
 *
 * Falls back to `http://localhost:3000` when unset so `pnpm dev`/`pnpm
 * build` work with zero required local configuration — the same restraint
 * docs/12-Implementation Roadmap.md's own Milestone 1 section already
 * asked for ("no environment validation layer... until first needed").
 * Production deployment must set a real `SITE_URL` environment variable;
 * this repository does not know, and does not invent, that value.
 */
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/**
 * The footer's closing message (docs/03-SITEMAP.md's Footer section),
 * kept as data rather than hardcoded JSX so the copy is configurable in
 * one place. Each entry renders as its own line.
 */
export const FOOTER_CLOSING_MESSAGE = [
  "Built with curiosity.",
  "See you in the next commit.",
] as const;
