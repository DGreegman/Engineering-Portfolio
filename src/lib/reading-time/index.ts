import readingTime from "reading-time";
import type { ReadingTimeResult } from "@/types/content";

/**
 * Wraps the `reading-time` package so the rest of the content engine
 * depends on this local module rather than a specific third-party API
 * shape. Runs against raw MDX body text (frontmatter already stripped by
 * the loader) — a standard, good-enough approximation; excluding JSX/import
 * noise from future custom components is a refinement for later, not a
 * redesign.
 */
export function calculateReadingTime(content: string): ReadingTimeResult {
  const result = readingTime(content);
  return {
    text: result.text,
    minutes: Math.max(1, Math.ceil(result.minutes)),
    words: result.words,
  };
}
