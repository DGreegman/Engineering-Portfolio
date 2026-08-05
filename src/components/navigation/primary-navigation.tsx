/**
 * PrimaryNavigation
 *
 * Renders docs/03-SITEMAP.md's top-level navigation from the shared
 * framework (lib/navigation/config.ts) — no items are redefined here.
 * A Server Component: only the per-item active-state check (`NavLink`) is
 * a client island.
 */
import { PRIMARY_NAVIGATION } from "@/lib/navigation/config";
import { NavLink } from "@/components/navigation/nav-link";

type PrimaryNavigationProps = {
  className?: string;
};

export function PrimaryNavigation({ className }: PrimaryNavigationProps) {
  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-6">
        {PRIMARY_NAVIGATION.map((item) => (
          <li key={item.href}>
            <NavLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
