/**
 * Renders code with syntax markup generated during `mdx:prepare`. Shiki
 * runs on the build host; Worker requests only render the trusted markup,
 * code text, label, and the existing copy control.
 *
 * Header row always renders, even with neither `filename` nor a resolved
 * `language` label — it's what gives `CopyButton` a fixed, predictable
 * home. The alternative (float the button over the code, only when there's
 * no header content to anchor it to) would mean two different layouts for
 * "block with metadata" vs. "block without," and an absolutely-positioned
 * button sitting on top of a horizontally-scrolling `<pre>` is exactly the
 * kind of interaction this task's "remain usable on mobile" and "overflow
 * never breaks page layout" constraints argue against. `overflow-hidden`
 * + `rounded-lg` on the outer container lets the header row's own square
 * corners get clipped for free, rather than rounding it separately.
 *
 * Only the `<pre>` itself scrolls (`overflow-x-auto`) — the header row
 * (filename, language label, copy button) sits outside that scroll
 * container, so the copy action is always reachable without first
 * scrolling a long line into view. This is the same "code has its own
 * horizontal scroll, the page never does" idiom `mdx-components.tsx`
 * already established for the pre-Shiki version of this component
 * (Task 4.3.4) — carried forward, not reinvented.
 *
 * `filename` remains available for future MDX metadata support.
 *
 * No `collapsible`/`maxLines` props: explicitly out of scope for this task
 * ("do not implement... collapsible examples"), and unlike `filename` this
 * task doesn't ask for that one to be pre-stubbed either. Extensibility
 * here comes from `CodeBlock` having a small, focused prop surface and
 * clear internal seams (highlighting, header, scroll container are each
 * their own piece) — not from declaring props nothing uses yet.
 *
 * Architecture Experience note (Task 5.4, docs/32-ARCHITECTURE_EXPERIENCE.md):
 * this component is also, today, how a Case Study's architecture diagrams
 * (system-context, sequence, and similar) render — a fenced code block
 * with no language or `text`, degrading to plain unhighlighted text via
 * `highlight.ts`'s own fallback. This is the *current* representation
 * because it already satisfies everything docs/32 §3/§4/§13 require of a
 * diagram without any further work: accessible (it's literally text, read
 * linearly by any assistive technology, no separate alt-text mechanism
 * needed), copyable, and non-interactive by construction. It is not a
 * commitment that every future diagram must stay a `CodeBlock` — dedicated
 * diagram rendering, richer visual representations, diagram-specific
 * infrastructure, and interactive diagrams are all documented future
 * evolution (docs/32 §15), not something this component forecloses.
 * Whichever future implementation eventually renders a diagram, docs/32's
 * own rule holds regardless: a diagram may summarize, compress, or clarify
 * architectural information, but must never be the sole authoritative
 * representation of an architectural fact — adjacent prose must always
 * carry the same claim independently, whether the diagram beside it is
 * this component or something built later.
 */
import { CopyButton } from "@/components/content/copy-button";

export interface CodeBlockProps {
  code: string;
  language?: string;
  languageLabel?: string;
  highlightedHtml: string;
  filename?: string;
}

export function CodeBlock({
  code,
  languageLabel,
  highlightedHtml,
  filename,
}: CodeBlockProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border bg-surface-elevated/60">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2">
        <span className="truncate font-mono text-caption text-muted-foreground">
          {filename}
        </span>
        <div className="flex shrink-0 items-center gap-3">
          {languageLabel && (
            <span className="text-caption text-muted-foreground">
              {languageLabel}
            </span>
          )}
          <CopyButton code={code} />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-small leading-relaxed text-foreground">
        <code
          className="shiki-tokens"
          // Shiki's own output (`lib/content/highlight.ts`) — trusted,
          // build-time-generated HTML from this repo's own MDX content,
          // not user input, the same trust boundary `Img`'s `<img>` and
          // this file's own MDX pipeline already operate inside.
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
