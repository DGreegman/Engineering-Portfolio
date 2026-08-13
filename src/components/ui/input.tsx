import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input
 *
 * The one new shared primitive Task 6.4's Search page needs
 * (`docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` WI-1) — a plain,
 * styled `<input>`, not a search-specific control. Matches `Button`'s own
 * border/ring/focus-visible token conventions (`button.tsx`) so the two
 * primitives read as one design system, not two.
 *
 * Deliberately not wrapped in a `@base-ui/react` primitive the way
 * `Dialog`/`Menu` are — a single-line text input has no focus trap, portal,
 * or open/close state for a headless library to manage; a styled native
 * `<input>` is the complete, correct implementation. Reaching for a headless
 * wrapper here would be exactly the "abstraction added without a concrete
 * need" `docs/24-ENGINEERING_PRINCIPLES.md` Principle 2 warns against.
 *
 * Generic, not `/search`-specific — usable by any future form in this
 * codebase.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-all",
        "placeholder:text-muted-foreground",
        "dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
