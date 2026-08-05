/**
 * Layout Constants
 *
 * Single source of truth for the workspace layout system's spatial
 * abstractions: content widths, stack gaps, and section vertical rhythm.
 *
 * Every value maps to Tailwind's default, mathematically-consistent spacing
 * scale — nothing here introduces arbitrary values. Layout primitives in
 * `components/layout/` consume these maps so pages only ever choose a
 * semantic name (e.g. "standard", "md") and never hand-write a class.
 *
 * See docs/07-DESIGN_SYSTEM.md ("Layout Philosophy", "Engineering
 * Precision") and docs/08-UX Guidelines.md ("Content Width").
 */

/**
 * Reusable content widths.
 *
 * - narrow   — long-form reading (knowledge articles, journal entries).
 *              Reuses the 72ch `--container-reading` token defined in
 *              styles/typography.css via the `max-w-reading` utility.
 * - standard — documentation-style pages (work, journal index, about).
 * - wide     — landing/marketing sections and page-level chrome.
 * - full     — no width constraint, reserved for future diagrams and
 *              visualizations.
 */
export const CONTENT_WIDTH = {
  narrow: "max-w-reading",
  standard: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
} as const;

export type ContentWidth = keyof typeof CONTENT_WIDTH;

/** Vertical gap between stacked children, e.g. within `Stack`. */
export const STACK_GAP = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
} as const;

export type StackGap = keyof typeof STACK_GAP;

/**
 * Vertical rhythm between page sections. Each step grows across
 * breakpoints so spacing scales with available space rather than staying
 * fixed.
 */
export const SECTION_SPACING = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16 lg:py-20",
  lg: "py-16 md:py-24 lg:py-32",
} as const;

export type SectionSpacing = keyof typeof SECTION_SPACING;
