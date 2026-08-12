"use client";

/**
 * MobileNavigation
 *
 * Task 6.1's one new client component (docs/36-HOMEPAGE_IMPLEMENTATION_PLAN.md
 * WI-6, docs/35-HOMEPAGE_INTEGRATION.md §8/§14/D3) — the one genuine gap the
 * approved architecture found: below `lg`, `PrimaryNavigation` is `hidden`
 * and nothing replaces it, so none of the four primary destinations were
 * reachable without scrolling to the footer. This component closes that
 * gap and nothing else.
 *
 * Scope, exactly as approved — the panel contains **only** the four
 * `PRIMARY_NAVIGATION` destinations (Knowledge, Work, Engineering Log,
 * About). It does not duplicate Search, RSS, GitHub, LinkedIn, email, or
 * the theme toggle — those already work correctly at every breakpoint via
 * `Header`'s own always-visible icon cluster and need no mobile-specific
 * treatment.
 *
 * Reads `PRIMARY_NAVIGATION` (`lib/navigation/config.ts`) directly and
 * renders each item through `NavLink` — the same data and the same
 * active-state component `PrimaryNavigation` uses on desktop, so
 * `aria-current="page"` behaves identically here. `PrimaryNavigation`
 * itself isn't reused as a whole component: its own `<ul>` is a hardcoded
 * horizontal row (`flex items-center gap-6`), correct for a header bar but
 * not for a narrow panel — this component composes its own vertical list
 * from the same underlying pieces instead of stretching a desktop-shaped
 * layout into a mobile one. The landmark label stays "Primary" either way
 * (docs/35 §17's explicit requirement) — never a second, differently-named
 * navigation landmark for the identical list.
 *
 * Built on `@base-ui/react/dialog` — already a project dependency, already
 * used elsewhere in this codebase (`components/ui/dropdown-menu.tsx` wraps
 * the sibling `Menu` primitive from the same package) — rather than
 * hand-rolled focus-trap/scroll-lock/Escape-to-close logic. A modal
 * `Dialog.Root` already provides all three by default: focus moves into
 * the popup on open and back to the trigger on close (`initialFocus`/
 * `finalFocus`, on by default), the document is scroll-locked and outside
 * pointer interaction disabled while open, and Escape closes it
 * (`escapeKey` is one of Base UI's own built-in dialog close reasons) —
 * this component asks for none of that explicitly because it's already
 * the primitive's default behavior, the same "reuse existing architecture"
 * discipline this whole task is built around, applied to an accessibility
 * primitive instead of a content resolver.
 *
 * No open/close transition is applied — `docs/13-HOMEPAGE_EXPERIENCE.md`'s
 * "Calm by default... avoid unnecessary visual effects" governs equally
 * here; an instant, correct disclosure is preferred over guessing at
 * animation-hook data-attributes this component doesn't need to depend on.
 *
 * `lg:hidden` on the trigger mirrors `PrimaryNavigation`'s own
 * `hidden lg:block` (inverted) — desktop rendering is untouched.
 */
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/navigation/nav-link";
import { PRIMARY_NAVIGATION } from "@/lib/navigation/config";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            className="lg:hidden"
          />
        }
      >
        <Menu aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/80" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-6",
            "border-l border-border bg-background p-6",
          )}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-small font-medium text-foreground">
              Navigation
            </Dialog.Title>
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close navigation"
                />
              }
            >
              <X aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* Same landmark label as desktop's PrimaryNavigation — one
              "Primary" nav, two renderings for two viewport ranges, never
              two differently-labeled landmarks (docs/35 §17). */}
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAVIGATION.map((item) => (
                <li
                  key={item.href}
                  // Closes the panel on navigation — clicking the NavLink
                  // (rendered inside this <li>) bubbles up to this handler
                  // before the route transition completes. No change to
                  // NavLink itself is needed for this.
                  onClick={() => setOpen(false)}
                >
                  <NavLink
                    item={item}
                    className="block rounded-md px-3 py-2.5 text-body"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
