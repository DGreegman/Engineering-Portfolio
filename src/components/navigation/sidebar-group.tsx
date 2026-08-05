/**
 * SidebarGroup
 *
 * One collapsible section of the Sidebar. Uses a native `<details>` /
 * `<summary>` disclosure rather than a hand-rolled expand/collapse widget —
 * keyboard support, focus handling, and expanded state all come from the
 * browser for free, satisfying "collapsible groups" and "accessibility"
 * with no custom JS or ARIA plumbing. Items render through the existing
 * `NavLink` (src/components/navigation/nav-link.tsx), reusing Task 2.3's
 * active-state logic rather than re-deriving it.
 */
import { Stack } from "@/components/layout/stack";
import { NavLink } from "@/components/navigation/nav-link";
import type { SidebarSection } from "@/lib/navigation/sidebar-config";

type SidebarGroupProps = {
  section: SidebarSection;
};

export function SidebarGroup({ section }: SidebarGroupProps) {
  return (
    <details open className="group">
      {/* Default marker suppressed (inconsistent across browsers, and
          requirement #7 asks to avoid unnecessary icons) — the label
          itself is the affordance. */}
      <summary className="list-none rounded-sm text-caption text-muted-foreground [&::-webkit-details-marker]:hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
        {section.title}
      </summary>

      <div className="mt-3">
        {section.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Coming soon</p>
        ) : (
          <Stack gap="xs" as="ul">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} />
              </li>
            ))}
          </Stack>
        )}
      </div>
    </details>
  );
}
