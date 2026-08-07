import { slugify } from "@/lib/utils/slugify";
import type { Heading } from "@/types/content";

const HEADING_PATTERN = /^(#{2,4})\s+(.+?)\s*#*$/;
const FENCE_PATTERN = /^(```|~~~)/;

/**
 * Strips inline Markdown syntax (links/images, bold, italic, inline code)
 * from a heading's raw source text, leaving what a reader would actually
 * see. Added when Task 4.3.5 ("Reading Navigation") became this function's
 * first real runtime caller and its own verification caught the gap: a
 * heading like `## See [the guide](/x)` rendered by MDX as "See the guide"
 * (plain visible text), but was being surfaced here — both as the Table of
 * Contents' display label and as slug input — as the raw, unprocessed
 * `See [the guide](/x)`. Bold/italic/inline-code markers happened to be
 * silently absorbed by `slugify()`'s own character-stripping (so slugs
 * were never wrong for *those*), but the *displayed* TOC text would have
 * carried literal `**`/`` ` `` characters too — this fixes text capture at
 * the source rather than papering over it per-consumer, keeping
 * `extractHeadings()` the one place heading text is derived from.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // [label](url) or ![alt](url) -> label/alt
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // **bold** / __bold__
    .replace(/(\*|_)(.*?)\1/g, "$2") // *italic* / _italic_
    .replace(/`([^`]*)`/g, "$1"); // `code`
}

/**
 * Extracts h2-h4 headings from raw MDX/Markdown for a future table of
 * contents (Task 1.6 requirement 6 — structured data only, no UI here).
 * h1 is skipped: it's the article title, rendered separately from the body.
 *
 * Regex-based rather than a full remark/unified AST: headings are a
 * bounded, well-specified pattern, and a parser pipeline isn't
 * proportionate for one function. Lines inside fenced code blocks (``` or
 * ~~~) are skipped so a `#` comment in a code sample is never mistaken for
 * a heading.
 */
export function extractHeadings(source: string): Heading[] {
  const headings: Heading[] = [];
  const seenSlugs = new Map<string, number>();
  let insideFence = false;

  for (const line of source.split("\n")) {
    if (FENCE_PATTERN.test(line.trim())) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = HEADING_PATTERN.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3 | 4;
    const text = stripInlineMarkdown(match[2].trim());
    const baseSlug = slugify(text);
    const count = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    headings.push({ depth, text, slug });
  }

  return headings;
}
