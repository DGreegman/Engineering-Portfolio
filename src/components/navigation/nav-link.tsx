/**
 * NavLink
 *
 * The one place active-nav-link styling exists. Wraps `next/link` +
 * `useIsActiveItem` (src/hooks/use-active-navigation.ts) so Header,
 * Sidebar, and Mobile Navigation all render active state the same way
 * instead of each re-deriving it. See docs/09-Component Specification.md
 * (Header/Sidebar) and Task 2.2's navigation framework.
 */
"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useIsActiveItem } from "@/hooks/use-active-navigation";
import type { NavigationItem } from "@/lib/navigation/types";

type NavLinkProps = {
  item: NavigationItem;
  className?: string;
};

export function NavLink({ item, className }: NavLinkProps) {
  const isActive = useIsActiveItem(item);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        isActive && "text-foreground",
        className,
      )}
    >
      {item.label}
    </Link>
  );
}
