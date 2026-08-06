/**
 * Sidebar Configuration
 *
 * Resolves which contextual navigation groups the Sidebar shows for the
 * current route. Keyed by the real, documented top-level sections from
 * docs/03-SITEMAP.md ("/work" and "/knowledge" are the only sections with
 * sub-structure — Home/Engineering Log/About intentionally have none, so
 * they resolve to `null`, meaning no sidebar at all).
 *
 * Every group's `items` stays empty today: category/case-study names are
 * content data (see src/lib/content/schema.ts — `tags` is a free-form
 * string array, not a fixed enum anywhere in the codebase), not static
 * site structure. Hardcoding them here would duplicate a source of truth
 * the Content Engine (Milestone 3) is meant to own, and drift the moment
 * content is added — the same reasoning lib/navigation/config.ts already
 * applied to Secondary/Knowledge navigation.
 *
 * `getSidebarSections` filters out empty groups and returns `null` when
 * nothing real is left — a "Coming soon" sidebar isn't navigation, it's
 * noise (Task 4.1 design refinement #1: no placeholders in permanent
 * navigation). This keeps the Sidebar dormant, not deleted: the moment a
 * group in `SIDEBAR_SECTIONS` gets real `items`, it starts appearing
 * automatically, with no further code change here.
 */
import type { NavigationItem } from "@/lib/navigation/types";

export interface SidebarSection {
  /** Group heading — not itself a link. */
  title: string;
  /** Reuses the shared navigation item shape; empty until content exists. */
  items: NavigationItem[];
}

type SidebarSectionKey = "work" | "knowledge";

const SIDEBAR_SECTIONS: Record<SidebarSectionKey, SidebarSection[]> = {
  work: [{ title: "Case Studies", items: [] }],
  knowledge: [
    { title: "Categories", items: [] },
    { title: "Series", items: [] },
  ],
};

function isSidebarSectionKey(segment: string): segment is SidebarSectionKey {
  return segment in SIDEBAR_SECTIONS;
}

/**
 * The sidebar groups for `pathname`'s top-level section with real content,
 * or `null` when there's nothing to show — either because the section has
 * no sub-structure at all, or because every group for it is still empty.
 */
export function getSidebarSections(pathname: string): SidebarSection[] | null {
  const segment = pathname.split("/")[1] ?? "";
  if (!isSidebarSectionKey(segment)) return null;

  const sections = SIDEBAR_SECTIONS[segment].filter(
    (section) => section.items.length > 0,
  );
  return sections.length > 0 ? sections : null;
}
