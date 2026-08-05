/**
 * Navigation Types
 *
 * A single shape (`NavigationItem`) describes every navigation type this
 * platform needs — primary, secondary, footer, and (eventually)
 * knowledge navigation — so Header, Sidebar, Footer, and Mobile Navigation
 * can all consume the same model instead of each inventing their own.
 * See docs/09-Component Specification.md (Header, Sidebar, Breadcrumb) and
 * docs/10-Technical Architecture.md.
 *
 * `label` is always a plain string, never JSX — it doubles as the
 * accessible name wherever an item is rendered, with no extra work by the
 * consuming component.
 */
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  /** Rendered by the consuming UI component — this framework never renders. */
  icon?: LucideIcon;
  /** Longer-form context, e.g. for a dropdown or command-menu entry. */
  description?: string;
  /** Nested items, e.g. a documentation section's sub-pages (Sidebar). */
  children?: NavigationItem[];
}

export type NavigationTree = NavigationItem[];

/**
 * Type-only today — see docs/09 ("Breadcrumb — Displays current
 * location") and Task 2.2's constraint against implementing breadcrumbs.
 * Reserves the shape a future pathname/content-derived builder will
 * produce, without building that builder yet.
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}
