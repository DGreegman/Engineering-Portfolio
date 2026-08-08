/**
 * Callout
 *
 * Task 4.3.7's single reusable component for all seven approved variants —
 * `<Callout type="security">...</Callout>` in MDX, wired into
 * `mdx-components.tsx`'s existing component map (Task 4.3.4's pipeline,
 * unmodified) as `Callout: Callout`. Children are ordinary MDX content
 * between the tags (the task's own example separates the opening/closing
 * tags from their content with blank lines — MDX's "flow" JSX form, which
 * runs its children through the *same* Markdown pipeline and the *same*
 * `mdxComponents` map as the rest of the document), so a callout's body
 * gets `P`/`Strong`/`Code`/etc. for free — nothing about paragraph,
 * inline-code, or link rendering is reimplemented here.
 *
 * Color strategy: this design system defines exactly two real (non-
 * grayscale) semantic hues — `--destructive` and `--success` — everything
 * else, including the `chart-*` tokens, is grayscale. Seven variants, two
 * existing hues, and "avoid excessive color / reuse the design system"
 * ruled out inventing five new ones. Variants group into three *tones*
 * instead of seven colors: `danger` (`--destructive`) for the three
 * variants that are fundamentally "this can hurt you" in different
 * flavors — Security, Common Mistake, Warning; `success` (`--success`) for
 * Best Practice, the one variant that's straightforwardly affirming; and
 * `neutral` (grayscale, `border-border`/`text-foreground`) for Key
 * Insight, Trade-off, and Performance — advisory/informational rather than
 * cautionary or affirming. Color communicates *severity class*, not exact
 * identity — identity comes from the icon and the always-visible label,
 * which is exactly what "must not rely on color alone" requires
 * architecturally, not just as a fallback.
 *
 * `role="note"`, not `role="alert"`: `alert` is an assertive live region
 * for content that changes *after* the page has loaded and needs
 * immediate interruption (form validation, a toast) — applying it to
 * static content already in the DOM at render time is a well-known
 * misuse that causes screen readers to announce it unexpectedly on
 * mount/scroll. `note` is the correct ARIA role for parenthetic,
 * supplementary content, which is what every variant here is relative to
 * the surrounding prose, warnings included. `aria-label={"<Label>
 * callout"}` on the region means a screen reader user browsing by
 * landmark/region (rather than reading linearly) can tell callouts apart
 * before entering one, rather than hearing "note" seven undifferentiated
 * times on one article; the label is still the first thing read linearly
 * too, so the two paths reinforce rather than duplicate meaningfully.
 *
 * No heading element for the visible label ("Security", "Warning", ...):
 * `mdx-components.tsx`'s own heading hierarchy stops at h4, and a phantom
 * h5 here would be picked up by nothing (`extractHeadings()` only reads
 * h2-h4) while still polluting the page's semantic outline for assistive
 * tech that does read heading levels — same reasoning `TableOfContents`
 * already used for its own "On This Page" label.
 *
 * `type` is a plain string from MDX content next-mdx-remote compiles at
 * request time, not a statically-imported `.mdx` file — so an author's
 * typo (`type="scurity"`) isn't caught by `tsc`, only at render time. That
 * case falls back to the `neutral` tone and shows the raw string as the
 * label rather than crashing the article: the same "degrade, don't break
 * the page over one bad value" instinct `lib/content/highlight.ts` already
 * applied to an unrecognized language tag.
 *
 * No client boundary: every variant's presentation is static, computed
 * once at render time from `type` — nothing here needs the browser.
 */
import type { LucideIcon } from "lucide-react";
import {
  Lightbulb,
  CheckCircle2,
  Scale,
  ShieldAlert,
  Gauge,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type CalloutType =
  | "key-insight"
  | "best-practice"
  | "trade-off"
  | "security"
  | "performance"
  | "common-mistake"
  | "warning";

type CalloutTone = "neutral" | "success" | "danger";

const CALLOUT_VARIANTS: Record<
  CalloutType,
  { label: string; icon: LucideIcon; tone: CalloutTone }
> = {
  "key-insight": { label: "Key Insight", icon: Lightbulb, tone: "neutral" },
  "best-practice": {
    label: "Best Practice",
    icon: CheckCircle2,
    tone: "success",
  },
  "trade-off": { label: "Trade-off", icon: Scale, tone: "neutral" },
  security: { label: "Security", icon: ShieldAlert, tone: "danger" },
  performance: { label: "Performance", icon: Gauge, tone: "neutral" },
  "common-mistake": { label: "Common Mistake", icon: XCircle, tone: "danger" },
  warning: { label: "Warning", icon: AlertTriangle, tone: "danger" },
};

// Tailwind classes per tone — the only place a new tone (or a future
// variant reusing an existing one) needs to be added to extend this
// system, per this task's own "remain extensible for future variants."
const TONE_STYLES: Record<CalloutTone, { border: string; icon: string }> = {
  neutral: { border: "border-border", icon: "text-muted-foreground" },
  success: { border: "border-success/50", icon: "text-success" },
  danger: { border: "border-destructive/50", icon: "text-destructive" },
};

export function Callout({
  type,
  children,
}: {
  type: string;
  children?: React.ReactNode;
}) {
  const variant = CALLOUT_VARIANTS[type as CalloutType] as
    (typeof CALLOUT_VARIANTS)[CalloutType] | undefined;

  // Unrecognized `type` (an author's typo, or a future variant this
  // component hasn't been extended for yet): still render the content
  // rather than silently dropping it or crashing the article, with the
  // raw string shown honestly instead of a made-up label.
  const label = variant?.label ?? type;
  const Icon = variant?.icon ?? Lightbulb;
  const tone = TONE_STYLES[variant?.tone ?? "neutral"];

  return (
    <div
      role="note"
      aria-label={`${label} callout`}
      className={cn(
        "mb-6 rounded-lg border-l-4 border bg-muted/30 p-4",
        tone.border,
      )}
    >
      <p className="mb-2 flex items-center gap-2 text-caption font-semibold tracking-wide text-foreground">
        <Icon aria-hidden="true" className={cn("size-4", tone.icon)} />
        {label}
      </p>
      <div className="text-body text-muted-foreground [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
