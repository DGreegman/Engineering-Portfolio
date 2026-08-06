/**
 * WorkspaceLayout
 *
 * The root structural layout for the Engineering Workspace. Establishes the
 * header / main(+sidebar) / footer regions every future page inherits.
 *
 * `header`, `footer`, and `sidebar` are opt-in slots: the landmark element
 * is only rendered when content is passed, so this component never emits
 * empty, nameless landmarks before the real Header/Footer/Sidebar
 * components exist (Milestone 2 continues by passing them in here — the
 * shape of this component does not need to change).
 *
 * The sidebar/main row is wrapped in the same `PageContainer` (max-w-7xl,
 * centered, same px-4/6/8 gutter) `Header`/`Footer` each wrap themselves in
 * independently — not a second, differently-sized container. Before this,
 * `<aside>`+`<main>` sized themselves against the *full* viewport while
 * `Header`/`Footer` also centered independently against that same full
 * viewport width: two same-max-width containers centered over different
 * available widths (viewport vs. viewport-minus-sidebar) land at different
 * left edges on basically every real viewport size, not just an edge case
 * — see Task 4.1's alignment fix. Sharing one container makes `<aside>`'s
 * left edge and `Header`'s brand's left edge the same box's left edge by
 * construction.
 *
 * Because of this, **every** page's top-level `Section`s should pass
 * `width="full"` (opting out of `Section`'s own inner `Container`) rather
 * than `width="wide"` — this outer container now supplies the width
 * constraint and gutter once for the whole row, on every route, whether or
 * not that route's `<aside>` ends up populated. (`sidebar` is always a
 * truthy `<Sidebar />` element here — root layout.tsx mounts it
 * unconditionally — so this component can't branch on "does this route
 * have a sidebar" itself; `Sidebar` resolves that client-side per
 * `usePathname()` and, when empty, `lg:empty:hidden` collapses `<aside>`
 * to zero width, at which point this shared container spans the full
 * viewport exactly as each page's own "wide" Container used to on
 * sidebar-less routes. All existing `home/*.tsx` sections were updated to
 * `width="full"` alongside this change — an inner `Container` anywhere
 * under `<main>` would double the gutter and reintroduce the same kind of
 * mismatch this fixes.)
 *
 * `header` is rendered bare — unlike `footer`/`sidebar`, this component does
 * not wrap it in its own `<header>` tag. `Header` (navigation/header.tsx)
 * owns that landmark itself, with its sticky/border/background styling
 * applied directly to it. Wrapping a sticky element in another element
 * that's exactly its own height leaves no room for it to actually stick —
 * the wrapper's box scrolls past at the same instant the sticky element
 * would, so it never gets to hold its position. `Header`'s containing
 * block needs to be this component's own (page-spanning) wrapper, not a
 * second box sized to fit only the header.
 *
 * This is a Server Component: pure structure, no client interactivity.
 * See docs/10-Technical Architecture.md ("Rendering Strategy") and
 * docs/12-Implementation Roadmap.md (Milestone 2 — Application Shell).
 */
import * as React from "react";

import { PageContainer } from "@/components/layout/container";

type WorkspaceLayoutProps = {
  /** Site header (src/components/navigation/header.tsx). */
  header?: React.ReactNode;
  /** Site footer (src/components/navigation/footer.tsx). */
  footer?: React.ReactNode;
  /** Contextual sidebar (src/components/navigation/sidebar.tsx). Renders
   * `null` on sections without sub-structure — see its `lg:empty:hidden`
   * handling below. */
  sidebar?: React.ReactNode;
  /** Which side the sidebar renders on when present. Defaults to "start". */
  sidebarPosition?: "start" | "end";
  children: React.ReactNode;
};

function WorkspaceLayout({
  header,
  footer,
  sidebar,
  sidebarPosition = "start",
  children,
}: WorkspaceLayoutProps) {
  const aside = sidebar ? (
    <aside
      data-slot="workspace-sidebar"
      className="hidden lg:block lg:w-64 lg:shrink-0 lg:empty:hidden"
    >
      {sidebar}
    </aside>
  ) : null;

  return (
    <div data-slot="workspace" className="flex flex-1 flex-col">
      {/* Accessible even before Header exists — jumps past it once it does. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        Skip to content
      </a>

      {header}

      <PageContainer
        data-slot="workspace-body"
        className="flex flex-1 flex-col lg:flex-row lg:gap-8"
      >
        {sidebarPosition === "start" && aside}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
        >
          {children}
        </main>
        {sidebarPosition === "end" && aside}
      </PageContainer>

      {footer && <footer data-slot="workspace-footer">{footer}</footer>}
    </div>
  );
}

export { WorkspaceLayout };
