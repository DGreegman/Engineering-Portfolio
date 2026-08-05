/**
 * Active-Navigation Hooks
 *
 * Thin client wrappers around lib/navigation/active-path.ts for
 * components that render from `usePathname()` (Header, Sidebar, Mobile
 * Navigation). Each hook reads the pathname once and delegates the actual
 * comparison to the pure functions — so a future component maps its nav
 * items to a small per-item component that calls one of these, and never
 * touches `usePathname` or string-compares a route itself.
 */
"use client";

import { usePathname } from "next/navigation";

import { isActiveItem, isActivePath } from "@/lib/navigation/active-path";
import type { NavigationItem } from "@/lib/navigation/types";

/** Whether the current route matches `href`. See `isActivePath` for the rules. */
export function useIsActivePath(href: string): boolean {
  const pathname = usePathname();
  return isActivePath(pathname, href);
}

/** Whether the current route matches `item` or any of its `children`. */
export function useIsActiveItem(item: NavigationItem): boolean {
  const pathname = usePathname();
  return isActiveItem(pathname, item);
}
