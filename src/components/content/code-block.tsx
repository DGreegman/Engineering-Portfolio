/**
 * CodeBlock
 *
 * Task 4.3.6's reusable code presentation component — takes plain code
 * text and renders a fully self-contained, syntax-highlighted block: any
 * future caller (a Command Block, a hardcoded example elsewhere on the
 * site) passes `code`/`language` and gets highlighting, overflow handling,
 * and a copy action for free, without separately calling
 * `lib/content/highlight.ts` itself first — that call lives *inside* this
 * component precisely so highlighting stays a one-line dependency of using
 * `CodeBlock`, not a step every caller has to remember and duplicate.
 *
 * An async Server Component: `highlightCode()` is async (Shiki's own API),
 * and doing the highlighting here — not in `mdx-components.tsx`'s `Pre`,
 * which only extracts `code`/`language` from the MDX-produced element and
 * delegates — keeps the one call site for "compile code text into
 * highlighted markup" inside the component that owns code presentation,
 * matching this task's "reuse the existing MDX rendering... do not
 * duplicate rendering logic."
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
 * `filename` is accepted and rendered today with nothing in the MDX
 * pipeline yet able to supply it (fenced code meta-string parsing isn't
 * built — this task's own "if filename support is not yet available
 * through the MDX pipeline, ensure the component architecture can support
 * it without redesign"). A future task wiring up meta-string parsing only
 * has to pass this prop; `CodeBlock` itself needs no changes.
 *
 * No `collapsible`/`maxLines` props: explicitly out of scope for this task
 * ("do not implement... collapsible examples"), and unlike `filename` this
 * task doesn't ask for that one to be pre-stubbed either. Extensibility
 * here comes from `CodeBlock` having a small, focused prop surface and
 * clear internal seams (highlighting, header, scroll container are each
 * their own piece) — not from declaring props nothing uses yet.
 */
import { highlightCode, resolveLanguageLabel } from "@/lib/content/highlight";
import { CopyButton } from "@/components/content/copy-button";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const html = await highlightCode(code, language);
  const label = resolveLanguageLabel(language);

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2">
        <span className="truncate font-mono text-caption text-muted-foreground">
          {filename}
        </span>
        <div className="flex shrink-0 items-center gap-3">
          {label && (
            <span className="text-caption text-muted-foreground">{label}</span>
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
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}
