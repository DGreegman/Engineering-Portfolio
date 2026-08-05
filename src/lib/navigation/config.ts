/**
 * Navigation Configuration
 *
 * The single source of truth for the site's static navigation. Labels and
 * hrefs are taken verbatim from docs/03-SITEMAP.md ("Navigation
 * Structure" and "URL Structure") — Header, Sidebar, Footer, and Mobile
 * Navigation all read from here rather than declaring their own items.
 * Home is intentionally absent — the header wordmark already links to
 * "/", so a duplicate "Home" link isn't needed.
 *
 * Secondary navigation (Work → case studies, Knowledge → categories) is
 * deliberately not encoded here: that data belongs to the content
 * collections under content/work/ and content/knowledge/, which the
 * Content Engine (Milestone 3) indexes. Hardcoding it in this file would
 * duplicate a source of truth that's about to exist and drift the moment
 * a case study or article is added.
 */
import type { NavigationTree } from "@/lib/navigation/types";

export const PRIMARY_NAVIGATION: NavigationTree = [
  { label: "Knowledge", href: "/knowledge" },
  { label: "Work", href: "/work" },
  { label: "Engineering Log", href: "/engineering-log" },
  { label: "About", href: "/about" },
];

/**
 * docs/03's Footer section calls for "Navigation" without specifying a
 * different set of links, so this aliases `PRIMARY_NAVIGATION` rather than
 * re-declaring the same four items. It stays an independent export so the
 * footer can point at a different tree later with a one-line change.
 */
export const FOOTER_NAVIGATION: NavigationTree = PRIMARY_NAVIGATION;
