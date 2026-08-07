/**
 * Formats a `Date` as "Mon YYYY" — the short-date convention already used
 * throughout this codebase's placeholder data (`placeholder-topic-articles.ts`,
 * `placeholder-knowledge-landing.ts`: "Jul 2026", "Aug 2026", ...). Task
 * 4.3.3 is the first place a real `Date` (from validated frontmatter, not a
 * hand-typed placeholder string) needs the same formatting, so this exists
 * to compute it rather than repeat the pattern ad hoc.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}
