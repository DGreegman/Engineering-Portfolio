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
 * Routing section). Not live until Milestone 6 — rendered as a disabled
 * placeholder until then, never linked to directly.
 */
export const RSS_PATH = "/rss.xml";

/**
 * The footer's closing message (docs/03-SITEMAP.md's Footer section),
 * kept as data rather than hardcoded JSX so the copy is configurable in
 * one place. Each entry renders as its own line.
 */
export const FOOTER_CLOSING_MESSAGE = [
  "Built with curiosity.",
  "See you in the next commit.",
] as const;
