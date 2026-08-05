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
 * This is a Server Component: pure structure, no client interactivity.
 * See docs/10-Technical Architecture.md ("Rendering Strategy") and
 * docs/12-Implementation Roadmap.md (Milestone 2 — Application Shell).
 */
import * as React from "react";

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

      {header && <header data-slot="workspace-header">{header}</header>}

      <div
        data-slot="workspace-body"
        className="flex flex-1 flex-col lg:flex-row"
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
      </div>

      {footer && <footer data-slot="workspace-footer">{footer}</footer>}
    </div>
  );
}

export { WorkspaceLayout };
