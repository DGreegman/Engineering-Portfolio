/**
 * SidebarContainer
 *
 * The Table of Contents rail's own layout — Task 4.3.2's "Sidebar Layout."
 * Deliberately not the site's global `Sidebar`
 * (`components/navigation/sidebar.tsx`): `docs/20-ARTICLE_EXPERIENCE.md`
 * draws that distinction explicitly ("a Table of Contents is not a
 * Sidebar") — that component is *browsing* navigation, mounted once in the
 * root layout's own `<aside>` landmark (via `WorkspaceLayout`'s `sidebar`
 * slot); this one is *reading* navigation, scoped to a single document, and
 * lives inline inside `DocumentContainer` rather than claiming a site-wide
 * layout slot.
 *
 * Structural only, per this task's explicit scope: reserves the space and
 * establishes sticky positioning and the responsive collapse, but generates
 * nothing — no TOC extraction, no active-heading detection, no scroll sync
 * (Task 4.3.5 "Reading Navigation" owns all of that). `children` is
 * whatever `DocumentContainer`'s caller passes as its `sidebar` slot —
 * today, a placeholder from `DocumentLayout`'s own defaults.
 *
 * `hidden lg:block` — collapses entirely below `lg`, the same mechanism
 * (and the same breakpoint) `WorkspaceLayout`'s own `<aside>` already uses
 * for the global Sidebar, not a new responsive pattern. `lg:w-64
 * lg:shrink-0` is the exact column width that `<aside>` already uses too —
 * reused, not reinvented (docs/07-DESIGN_SYSTEM.md: consistent spacing).
 *
 * `lg:sticky lg:top-16` holds the rail's position as the reading column
 * scrolls past it. `top-16` (4rem) clears `Header`'s own sticky height
 * (`h-14` = 3.5rem, plus its 1px border) with a small, deliberate gap —
 * not `top-14`, which would leave the rail flush against the header with
 * no breathing room. `lg:self-start` keeps the rail pinned to the top of
 * the flex row instead of stretching to `DocumentContainer`'s full height
 * (the default `stretch` align-items behavior), which sticky positioning
 * needs to have any effect at all.
 *
 * `aria-label="Table of Contents"` names the landmark — every other region
 * `DocumentLayout` composes gets one via `Section`'s own `aria-label` prop;
 * this `<aside>` is the one region that doesn't go through `Section`, so it
 * needs its own to stay consistent (structural semantics, this task's own
 * explicit carve-out from "no accessibility work").
 *
 * A Server Component: pure structure, no client interactivity.
 */
export function SidebarContainer({ children }: { children: React.ReactNode }) {
  return (
    <aside
      aria-label="Table of Contents"
      className="hidden lg:sticky lg:top-16 lg:block lg:w-64 lg:shrink-0 lg:self-start"
    >
      {children}
    </aside>
  );
}
