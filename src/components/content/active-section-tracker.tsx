"use client";

/**
 * ActiveSectionTracker
 *
 * The one client boundary Task 4.3.5 ("Reading Navigation") introduces.
 * Everything else the task asks for — the Table of Contents markup itself
 * (`table-of-contents.tsx`), clicking a link to jump to a section, the URL
 * fragment updating, back-button history — is native `<a href="#slug">`
 * behavior and needs no JavaScript at all. Smooth scrolling is a global CSS
 * rule (`motion-safe:scroll-smooth` on `<html>`, `app/layout.tsx`), not a
 * scroll handler. What genuinely cannot be done without a client boundary
 * is *knowing which section is currently in view* — that requires reading
 * live scroll position, which only exists in the browser.
 *
 * Kept to the smallest role that fact requires: this component renders
 * nothing (`return null`) and holds no visible UI of its own. It reads
 * `headingIds`, finds each heading element and its matching TOC link
 * (`table-of-contents.tsx`'s `data-toc-link` attribute) in the already
 * server-rendered DOM, and — as the reader scrolls — sets `aria-current`
 * on whichever link corresponds to the section currently at the top of the
 * viewport. The TOC's own styling already reacts to that attribute
 * (`aria-current:*` Tailwind variants in `table-of-contents.tsx`), so this
 * component's only job is deciding *which* link gets it, never *how* an
 * active link looks — the static markup and the interactive behavior stay
 * separated, rather than folding the whole TOC into one client component
 * for the sake of one dynamic attribute.
 *
 * Plain DOM mutation (`setAttribute`/`removeAttribute`), not React state:
 * this updates on every scroll-driven intersection change, which is
 * exactly the kind of high-frequency, purely-visual update that doesn't
 * belong in a re-render cycle — imperative here isn't a shortcut, it's the
 * correct tool for updating an attribute nothing else in the tree reads.
 * Never calls `.focus()` anywhere, so it never steals keyboard focus during
 * scrolling — the one explicit acceptance criterion this file has to hold.
 *
 * IntersectionObserver, not a scroll event listener: it only fires when a
 * heading actually crosses the activation line, not on every scroll frame,
 * which is what keeps this from janking or flickering during a fast
 * scroll — a raw `scroll` listener would need its own throttling to get
 * the same property.
 */
import { useEffect } from "react";

// Distance (px) from the top of the viewport that counts as "reached."
// Clears the sticky header's own height (`Header`'s `h-14` = 56px) with a
// little room to spare — the same reasoning `SidebarContainer`'s
// `lg:top-16` already used for the same header.
const ACTIVATION_OFFSET = 96;

export function ActiveSectionTracker({ headingIds }: { headingIds: string[] }) {
  useEffect(() => {
    if (headingIds.length === 0) return;

    const headingElements = headingIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    function setActive(activeId: string | null) {
      for (const id of headingIds) {
        const link = document.querySelector(`[data-toc-link][href="#${id}"]`);
        if (!link) continue;
        if (id === activeId) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    }

    // The active section is the *last* heading (in document order) whose
    // top edge has scrolled up to or past the activation line — i.e. the
    // section the reader has most recently reached. Recomputed from live
    // `getBoundingClientRect()` values on every observer callback, rather
    // than trusted from the callback's own `entries`, so the result is a
    // deterministic function of current scroll position alone — this is
    // what keeps the indicator from ever showing two active sections at
    // once, or none while between two headings.
    function updateActive() {
      let activeId: string | null = null;
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          activeId = el.id;
        }
      }
      // Above the first heading (top of the article): treat the first
      // section as current rather than highlighting nothing, so the TOC
      // always reflects "where you'd land reading from here."
      setActive(activeId ?? headingElements[0].id);
    }

    updateActive();

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: `-${ACTIVATION_OFFSET}px 0px 0px 0px`,
      threshold: 0,
    });
    for (const el of headingElements) observer.observe(el);

    return () => observer.disconnect();
  }, [headingIds]);

  return null;
}
