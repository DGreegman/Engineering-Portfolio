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
 * No `id`s on headings. `extractHeadings()` (`lib/content/toc.ts`,
 * already built) computes TOC slugs directly from the raw MDX source, not
 * from rendered heading `id`s — and `docs/21-ARTICLE_IMPLEMENTATION_PLAN.md`
 * explicitly assigns "Heading IDs" to Task 4.3.5 ("Reading Navigation"),
 * not this one. Adding them here would mean guessing at a slug algorithm
 * this task doesn't own.
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
 * Code fences (`pre`/fenced `code`) get only what this task asks for:
 * monospace, a readable background, horizontal scroll for long lines — no
 * syntax highlighting, filenames, line numbers, or copy button (Task
 * 4.3.6 owns all of that, explicitly). Reuses the exact `font-mono` +
 * muted-background idiom `ReadmeHero`'s terminal snippet already
 * established, not a new visual language invented for this task.
 *
 * Inline `code` and fenced `code` share one override function, since MDX
 * renders both through the same tag — distinguished by whether remark gave
 * the element a `language-*` className (fenced blocks get one; inline
 * code never does), not by two separate component names.
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
 * Every component here is a plain function returning JSX — no hooks, no
 * event handlers, no client boundary anywhere in this file.
 */
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

const PROSE_LINK =
  "underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground text-foreground rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("mt-12 mb-4 text-h2 text-foreground", className)}
      {...props}
    />
  );
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("mt-8 mb-3 text-h3 text-foreground", className)}
      {...props}
    />
  );
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn("mt-6 mb-2 text-h4 text-foreground", className)}
      {...props}
    />
  );
}

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
  // Fenced code blocks: remark gives the inner `<code>` a `language-*`
  // class; inline code never gets one. `Pre` already styles the
  // surrounding box for the fenced case, so this only adds the
  // pill/background treatment for genuinely inline code.
  const isFenced = Boolean(className);
  if (isFenced) {
    return (
      <code className={cn("font-mono text-small", className)} {...props} />
    );
  }
  return (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
      {...props}
    />
  );
}

function Pre({ className, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "mb-6 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
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

export const mdxComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
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
