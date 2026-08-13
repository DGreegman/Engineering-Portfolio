/**
 * LogEntryHeader
 *
 * Title, date, and tags for an Engineering Log entry — Task 6.2's own
 * counterpart to `ProjectHeader` (Work) and `DocumentHeader` (Knowledge),
 * deliberately **not** built by reusing either
 * (`docs/37-ENGINEERING_LOG_EXPERIENCE.md` §8/§17, Decision D4).
 *
 * `ProjectHeader` is built around Domain/Status/Timeline/Difficulty —
 * facets a log entry doesn't have and shouldn't be made to have; a case
 * study's difficulty rating answers "how hard was the engineering
 * challenge," a question a raw, in-progress log entry hasn't earned an
 * answer to yet. `DocumentHeader` requires a `topic` — a controlled
 * vocabulary this collection's frontmatter was never given (docs/37 §11:
 * `articleFrontmatterSchema`, unmodified, no `topic` field). Reusing
 * either would mean fabricating metadata this collection doesn't carry,
 * exactly the failure mode `docs/37` §17 names directly: an Engineering
 * Log entry dressed up to look like a smaller Case Study.
 *
 * `tags` render as a quiet, low-weight line — free-form and multi-valued
 * (`articleFrontmatterSchema.tags`), never a controlled facet the way
 * Work's `domain` or Knowledge's `topic` are, so they're presented as
 * plain text, not a filterable badge row (docs/37 §17's "no badge walls,
 * regardless of entry length" restraint, applied to the one place a
 * facet-shaped temptation exists on this page).
 *
 * A Server Component: static content, no interactivity.
 */
import { Stack } from "@/components/layout/stack";

export interface LogEntryHeaderProps {
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
}

export function LogEntryHeader({
  title,
  description,
  publishedAt,
  tags,
}: LogEntryHeaderProps) {
  return (
    <Stack gap="lg" className="max-w-reading">
      <h1 className="text-h1 text-foreground">{title}</h1>

      <p className="text-body text-muted-foreground">{description}</p>

      <Stack gap="xs">
        <p className="text-caption text-muted-foreground">{publishedAt}</p>

        {tags.length > 0 && (
          <p className="text-caption text-muted-foreground/70">
            {tags.join(" · ")}
          </p>
        )}
      </Stack>
    </Stack>
  );
}
