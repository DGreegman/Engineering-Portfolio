import { slugify } from "@/lib/utils/slugify";
import type { Heading } from "@/types/content";

const HEADING_PATTERN = /^(#{2,4})\s+(.+?)\s*#*$/;
const FENCE_PATTERN = /^(```|~~~)/;

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
    const text = match[2].trim();
    const baseSlug = slugify(text);
    const count = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    headings.push({ depth, text, slug });
  }

  return headings;
}
