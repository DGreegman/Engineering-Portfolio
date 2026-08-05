/**
 * Sidebar
 *
 * Contextual navigation for the Engineering Workspace — shows different
 * groups depending on the current top-level section, and nothing at all
 * on sections without sub-structure (Home, About, Now, Contact). Reads
 * `usePathname()` itself (the same approach `NavLink` already uses for
 * active-state) rather than requiring per-route layout files, since
 * /work and /journal don't have pages yet to host those layouts.
 *
 * Mounted once in the root layout via `WorkspaceLayout`'s `sidebar` slot;
 * `workspace-layout.tsx`'s `<aside>` collapses to nothing when this
 * renders `null` (see its `lg:empty:hidden` class).
 */
"use client";

import { usePathname } from "next/navigation";

import { Stack } from "@/components/layout/stack";
import { SidebarGroup } from "@/components/navigation/sidebar-group";
import { getSidebarSections } from "@/lib/navigation/sidebar-config";

export function Sidebar() {
  const pathname = usePathname();
  const sections = getSidebarSections(pathname);

  if (!sections) return null;

  return (
    // Horizontal gutter matches Container's scale (px-4 sm:px-6 lg:px-8) so
    // the sidebar aligns with Header/Footer's gutter at the lg: breakpoint
    // it's actually visible at, instead of a one-off value.
    <nav aria-label="Secondary" className="px-4 py-8 sm:px-6 lg:px-8">
      <Stack gap="lg">
        {sections.map((section) => (
          <SidebarGroup key={section.title} section={section} />
        ))}
      </Stack>
    </nav>
  );
}
