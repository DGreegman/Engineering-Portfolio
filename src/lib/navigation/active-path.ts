/**
 * Active-Path Logic
 *
 * The one place that decides whether a route is "active" for navigation
 * highlighting. Pure and framework-agnostic — no dependency on
 * `next/navigation` — so it's usable anywhere a pathname string is
 * available, and testable without rendering React. Header, Sidebar, and
 * Mobile Navigation should all call this instead of comparing pathnames
 * themselves (see hooks/use-active-navigation.ts for the client-side
 * wrapper).
 */
import type { NavigationItem } from "@/lib/navigation/types";

/**
 * Whether `pathname` should be considered "on" `href`.
 *
 * - The root ("/") only matches exactly, so every route doesn't light up
 *   Home.
 * - Every other href matches itself and any descendant route
 *   (`/work` matches `/work/vaultpay`) but never a partial-word sibling
 *   (`/work` does not match `/workshop`).
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Whether `item` — or any of its descendants — is active for `pathname`.
 * Lets a parent nav item (e.g. a Sidebar section) read as active when a
 * nested route is current, without the consumer walking `children` itself.
 *
 * Future UI should drive `aria-current="page"` directly off this result
 * (or `isActivePath`) rather than re-deriving it.
 */
export function isActiveItem(pathname: string, item: NavigationItem): boolean {
  if (isActivePath(pathname, item.href)) return true;
  return item.children?.some((child) => isActiveItem(pathname, child)) ?? false;
}
