"use client";

/**
 * CopyButton
 *
 * Task 4.3.6's one client boundary: everything else about `CodeBlock` —
 * highlighting, the filename/language header, layout, overflow — is static
 * once rendered, computed entirely server-side. Only the copy action
 * itself (`navigator.clipboard`, an ephemeral "copied" state) needs the
 * browser, so only this button is `"use client"` — `code-block.tsx` stays
 * an async Server Component and renders this as one small island inside
 * it, rather than the whole block becoming a client boundary for one
 * button's sake (`docs/20-ARTICLE_EXPERIENCE.md`'s own recommendation for
 * this exact case).
 *
 * Takes `code` as a plain string prop — the only thing that needs to cross
 * the server/client boundary, already-decoded plain text (not the
 * Shiki-highlighted HTML `CodeBlock` renders), so a reader always copies
 * exactly the source text, never markup.
 *
 * Feedback is both visual and accessible, deliberately doubled:
 * - Icon swaps `Copy` -> `Check` (with `text-success`, the existing token
 *   every other success/positive state in this codebase already uses) —
 *   sighted, at-a-glance confirmation.
 * - `aria-label` updates to "Copied to clipboard" — screen readers
 *   generally re-announce a focused element's changed accessible name
 *   after an interaction that triggered it.
 * - A persistently-mounted `role="status"` (implicitly `aria-live="polite"`
 *   per the ARIA spec — no separate `aria-live` attribute needed) visually
 *   hidden span whose text changes from empty to "Copied to clipboard" —
 *   the reliable path when the label-change alone isn't picked up.
 *
 * Keyboard: a plain `<button>`, already focusable and activatable with
 * Enter/Space with no extra wiring — the same `focus-visible` ring idiom
 * used everywhere else in this codebase, not a new focus treatment.
 *
 * Clipboard failures (permissions, insecure context, an unsupported
 * browser) are swallowed rather than surfaced as an error: copying is a
 * convenience on top of code a reader can already select and copy by hand,
 * not something failing should block or alarm over.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

const CONFIRMATION_DURATION_MS = 2000;

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setCopied(false),
      CONFIRMATION_DURATION_MS,
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4 text-success" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
