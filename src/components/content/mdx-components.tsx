/**
 * MDX Components
 *
 * The component-override map Task 4.3.4 wires into `MDXContent`
 * (`lib/content/mdx.tsx`) — one small component per standard Markdown
 * element `next-mdx-remote` renders, styled to this task's own scope
 * (Headings, Paragraphs, Lists, Inline Formatting, Blockquotes, Tables,
 * Images, Links, Horizontal Rules, Code Fences) and nothing beyond it.
 * `mdx.tsx`'s own docstring already anticipated this file: "components
 * stays caller-supplied and empty by default... the Markdown/Knowledge
 * component library is Milestone 4" — this is that library's first
 * increment, for standard Markdown only. Custom MDX components (Callout,
 * Steps, Diagram, ...) are explicitly out of scope here and get their own
 * entries added to this same map in later tasks, without this file's
 * existing entries changing — "remain extensible for future MDX
 * components," this task's own engineering constraint.
 *
 * Heading `id`s (Task 4.3.5): `getMdxComponents(headings)` is a factory,
 * not a static map, because H2/H3/H4 need per-document data — the exact
 * `Heading[]` `extractHeadings()` (`lib/content/toc.ts`) already computed
 * from this same article's raw MDX source, once, in the route. That list is
 * the *only* place slugs get computed anywhere in this codebase; these
 * heading components never call `slugify()` themselves. Instead each one
 * claims the next entry off a small counter closed over by the factory —
 * safe because `getMdxComponents` is called fresh per request (a Server
 * Component's render, not a module-level singleton), and correct because
 * MDX renders headings in the same top-to-bottom document order
 * `extractHeadings()` walked to build the list, regardless of h2/h3/h4 mix
 * (one shared counter, not one per depth). This is what "the Table of
 * Contents is not a second source of truth" (`docs/20-ARTICLE_EXPERIENCE.md`)
 * means literally here: rendering a heading and rendering its TOC entry
 * both read the same array, so there is no way for an `id` and its
 * corresponding TOC `href` to drift apart. The alternative — re-deriving
 * each slug from the heading's *rendered* children at render time — was
 * rejected: `extractHeadings()` slugifies the raw Markdown text of a
 * heading, which for something like `## See [the guide](/x)` is not the
 * same string as that heading's rendered visible text ("See the guide"),
 * so a second, independent slugify pass could silently produce a different
 * id than the TOC links to. Reusing the one already-computed list sidesteps
 * that instead of trying to make two computations agree.
 *
 * Every other component in this file (`p`, `ul`, `code`, ...) has no need
 * for per-document data, so it stays a plain, module-level function/export
 * exactly as Task 4.3.4 built it — only the three heading overrides moved
 * into the factory.
 *
 * Only h2–h4 are styled, matching this task's own explicit Headings list
 * ("Maintain a clear hierarchy beneath the document title") — `<h1>` is
 * `DocumentHeader`'s title (Task 4.3.3), never authored in MDX body
 * content, and h5/h6 aren't part of the approved hierarchy so they're
 * deliberately left unstyled rather than guessed at (`docs/18-ARTICLE_TEMPLATE.md`'s
 * own template doesn't nest that deep either).
 *
 * Vertical rhythm lives on each element's own margin classes, not a single
 * blanket `space-y-*` wrapper — a heading needs more space before it than
 * a paragraph needs before another paragraph, and a shared wrapper can't
 * express that difference. Every value is an existing Tailwind spacing
 * step already used elsewhere in this codebase (matching `STACK_GAP`'s own
 * scale — `docs/20-ARTICLE_EXPERIENCE.md`'s "Spacing philosophy": MDX
 * heading rhythm should sit closer to `STACK_GAP`'s "lg"/"xl" steps than
 * `SECTION_SPACING`'s page-level scale), not an arbitrary one-off value.
 * `ArticleBody` resets the very first rendered element's top margin so the
 * body doesn't double up with `DocumentContainer`'s own top padding.
 *
 * Code fences (Task 4.3.6): `pre` no longer renders a `<pre>` itself — it
 * extracts the fenced block's raw code text and language from its own
 * `children` (the still-unrendered `<code className="language-x">` MDX
 * produced, read straight off `.props` before React ever renders it, since
 * a JSX element passed as a prop is just a plain `{type, props}` object
 * until something renders it) and delegates entirely to `CodeBlock`
 * (`components/content/code-block.tsx`) — highlighting, the header row,
 * overflow, and the copy action all live there, not here. `code` (this
 * file's inline override) is left with only the inline case: with `pre`
 * intercepting every fenced block's `children` before React would ever
 * invoke `code` for it, the fenced branch Task 4.3.4 gave `code` had
 * become unreachable, so it was removed rather than left as dead code with
 * a stale comment describing behavior that no longer executes. `code` is
 * still the tag MDX renders for genuinely inline code (never wrapped in a
 * `pre`), so this file still needs an override for it — just a narrower
 * one now.
 *
 * `hr` is a plain semantic `<hr>` styled to the same subtle `border-border`
 * token used everywhere else, not the `ui/separator.tsx` component — that
 * component is a Base UI primitive marked `"use client"`, needed for its
 * ARIA orientation handling in interactive contexts; a static horizontal
 * rule in server-rendered prose has no such need, and pulling in a client
 * boundary for it would conflict with this task's own "avoid client-side
 * JavaScript unless required" constraint for zero visual benefit.
 *
 * Links distinguish internal (relative — `Link`, prefetched, same as
 * every other internal link in this codebase) from external (absolute
 * `http(s)://` — plain `<a target="_blank" rel="noopener noreferrer">`,
 * with a small `ExternalLink` icon so sighted readers get the same signal
 * a screen reader gets from the visually-hidden "(opens in a new tab)"
 * text) — Task 4.3.4's own explicit ask: "Maintain accessibility and
 * consistent visual treatment." `mailto:`/`tel:` links get neither
 * treatment — opening a new tab for either doesn't make sense.
 *
 * Every component defined *in this file* is a plain, synchronous function
 * returning JSX — no hooks, no event handlers, no client boundary
 * anywhere here. `pre` delegates to `CodeBlock`, which is async (it awaits
 * Shiki), but that doesn't make `pre` itself async or this file a client
 * boundary — a Server Component can render an async component as a child
 * without the parent needing to be one too.
 */
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/content/code-block";
import type { Heading } from "@/types/content";

const PROSE_LINK =
  "underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground text-foreground rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("mb-6 text-body text-foreground", className)} {...props} />
  );
}

function Ul({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "mb-6 list-disc space-y-2 pl-6 text-body text-foreground marker:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Ol({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "mb-6 list-decimal space-y-2 pl-6 text-body text-foreground marker:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Li({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("pl-1", className)} {...props} />;
}

function Strong({ className, ...props }: React.ComponentProps<"strong">) {
  return <strong className={cn("font-semibold", className)} {...props} />;
}

function Em({ className, ...props }: React.ComponentProps<"em">) {
  return <em className={cn("italic", className)} {...props} />;
}

function Code({ className, ...props }: React.ComponentProps<"code">) {
  // Only ever reached for genuinely inline code now — see this file's own
  // docstring for why the fenced branch this used to have is gone, not
  // just unused. Sized to relate to `CodeBlock`'s fenced treatment
  // (`font-mono`, the same `bg-muted` family) while staying visibly
  // lighter — a pill inline with prose, not a block of its own.
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Pre({ children }: React.ComponentProps<"pre">) {
  // MDX compiles a fenced block to `<pre><code className="language-x">
  // {text}</code></pre>` — `children` here is that `<code>` element,
  // unevaluated (JSX doesn't invoke a component until React renders it),
  // so its own `props` can be read directly instead of letting it render
  // and trying to recover the source text from the result.
  const codeElement = children as React.ReactElement<{
    className?: string;
    children?: React.ReactNode;
  }>;

  const rawChildren = codeElement?.props?.children;
  const code =
    typeof rawChildren === "string" ? rawChildren : String(rawChildren ?? "");

  // Fenced blocks get a `language-x` class from remark; a bare ``` ``` ```
  // fence (no info string) has no className at all — `language` stays
  // `undefined` in that case, which is exactly what `CodeBlock` needs to
  // know not to show a label ("do not infer programming languages").
  const language = /language-(\S+)/.exec(
    codeElement?.props?.className ?? "",
  )?.[1];

  return <CodeBlock code={code} language={language} />;
}

function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "mb-6 border-l-2 border-border pl-4 text-body text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="mb-6 overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-small", className)}
        {...props}
      />
    </div>
  );
}

function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-border px-3 py-2 text-left font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-b border-border/50 px-3 py-2 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Img({ alt, className, ...props }: React.ComponentProps<"img">) {
  // Markdown image syntax carries no width/height, which `next/image`
  // requires (short of `fill`, which needs a positioned parent this
  // component doesn't control). A plain, lazy-loaded `<img>` is the
  // correct trade-off for this task's literal ask ("responsive images
  // with consistent spacing") — full `next/image` optimization is a
  // future enhancement, not a regression introduced here.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      loading="lazy"
      className={cn("mb-6 w-full rounded-lg", className)}
      {...props}
    />
  );
}

function A({
  href = "",
  className,
  children,
  ...props
}: React.ComponentProps<"a">) {
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(PROSE_LINK, className)}
        {...props}
      >
        {children}
        <ExternalLink
          aria-hidden="true"
          className="ml-0.5 inline size-3 align-baseline"
        />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={cn(PROSE_LINK, className)} {...props}>
      {children}
    </Link>
  );
}

function Hr({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("my-12 border-border", className)} {...props} />;
}

const HEADING_STYLES = {
  2: "mt-12 mb-4 text-h2 text-foreground",
  3: "mt-8 mb-3 text-h3 text-foreground",
  4: "mt-6 mb-2 text-h4 text-foreground",
} as const;

/**
 * Builds the full MDX component map for one document render, binding
 * `h2`/`h3`/`h4` to `headings` (see this file's own docstring for why a
 * factory, not a static export). The rest of the map is the same static
 * functions Task 4.3.4 built, unchanged.
 */
export function getMdxComponents(headings: Heading[]) {
  let cursor = 0;

  function makeHeading(depth: 2 | 3 | 4) {
    const Tag = `h${depth}` as "h2" | "h3" | "h4";
    // Props are identical across h2/h3/h4 (plain HTMLHeadingElement
    // attributes) — typed against "h2" for all three rather than a union,
    // which `ComponentProps` doesn't resolve cleanly for a runtime-chosen
    // tag name.
    return function HeadingComponent({
      className,
      ...props
    }: React.ComponentProps<"h2">) {
      // Claims the next entry off the already-computed list, trusting
      // document order — see the file-level docstring's "Heading `id`s"
      // section for why this is safe and why it's the one heading in the
      // list, not a fresh slugify() of this component's own children.
      const id = headings[cursor]?.slug;
      cursor += 1;
      return (
        <Tag
          id={id}
          className={cn(HEADING_STYLES[depth], className)}
          {...props}
        />
      );
    };
  }

  return {
    h2: makeHeading(2),
    h3: makeHeading(3),
    h4: makeHeading(4),
    p: P,
    ul: Ul,
    ol: Ol,
    li: Li,
    strong: Strong,
    em: Em,
    code: Code,
    pre: Pre,
    blockquote: Blockquote,
    table: Table,
    th: Th,
    td: Td,
    img: Img,
    a: A,
    hr: Hr,
  };
}
