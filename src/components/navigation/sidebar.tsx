/**
 * Sidebar
 *
 * Contextual navigation for the Engineering Workspace — shows different
 * groups depending on the current top-level section, and nothing at all
 * on sections without sub-structure (Home, About, Now, Contact) *or* on
 * sections whose groups don't have real content yet (`/knowledge`, `/work`
 * today — `getSidebarSections` returns `null` until at least one group has
 * real items, rather than this rendering placeholder "Coming soon" text;
 * see lib/navigation/sidebar-config.ts). Reads `usePathname()` itself (the
 * same approach `NavLink` already uses for active-state) rather than
 * requiring per-route layout files, since /work and /journal don't have
 * pages yet to host those layouts.
 *
 * Mounted once in the root layout via `WorkspaceLayout`'s `sidebar` slot;
 * `workspace-layout.tsx`'s `<aside>` collapses to nothing when this
 * renders `null` (see its `lg:empty:hidden` class).
 *
 * No horizontal padding of its own — `WorkspaceLayout` now wraps the whole
 * sidebar/main row in one shared `PageContainer`, which already supplies
 * the left gutter (aligning this nav's content with `Header`'s brand) and
 * the `lg:gap-8` between this and `<main>`. Only vertical padding remains
 * here, since that rhythm is this component's own concern.
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
    <nav aria-label="Secondary" className="py-8">
      <Stack gap="lg">
        {sections.map((section) => (
          <SidebarGroup key={section.title} section={section} />
        ))}
      </Stack>
    </nav>
  );
}
