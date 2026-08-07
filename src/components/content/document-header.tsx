/**
 * DocumentHeader
 *
 * Title, description, and metadata row for an Engineering Article — Task
 * 4.3.3's Document Header region. Establishes the reader's context before
 * the article begins: what this document is, what it covers, and how it
 * fits the Knowledge Library, per this task's own Objective.
 *
 * Structure mirrors every other hero-shaped component already in this
 * codebase (`KnowledgeHero`, `TopicHero`): heading, then intro prose, then
 * a quiet stats/metadata line — not a new pattern invented for articles.
 *
 * `title` renders as the page's one and only `<h1>`
 * (`docs/20-ARTICLE_EXPERIENCE.md`'s explicit rule: exactly one `<h1>` per
 * article, rendered by the template from frontmatter, never authored
 * inside the MDX body — this is that `<h1>`, and MDX rendering (Task
 * 4.3.4) starts its own headings at `<h2>`).
 *
 * The metadata row is one quiet citation-style line — Difficulty ·
 * Reading Time · Last Updated · Topic · Tags, in the order this task's own
 * Scope lists them — reusing the exact idiom `StartHere`/
 * `TopicArticleList` already established for "secondary, glanceable
 * facts" (`text-caption`, muted, `·`-joined) rather than inventing badge
 * chrome for five fields that don't need a heavier treatment ("Metadata
 * should remain visually secondary to the title and description," this
 * task's own words). Each field renders only when present — `difficulty`
 * is optional in the schema, `tags` can be empty — never a fabricated
 * placeholder for a field that isn't there. Built as an explicit list of
 * typed entries rather than a flat string array joined by position: which
 * fields are present varies per article, so nothing here may assume a
 * fixed index belongs to a fixed field.
 *
 * "Last Updated" shows `updatedAt` when the article has been revised,
 * falling back to `publishedAt` (labeled "Published") when it hasn't —
 * this task's Scope names "Last Updated" as the one date field for this
 * row, not "Published" as a separate one, so there is always exactly one
 * date shown here, honestly labeled for which it actually is.
 *
 * `topic` arrives pre-resolved ({ title, href }) rather than this
 * component looking `PLACEHOLDER_TOPICS` up itself — the route already
 * resolves the topic once for the breadcrumb, and passing that same
 * result down keeps the lookup in one place ("avoid duplicating metadata
 * logic," this task's own engineering constraint) instead of two
 * components independently searching the same list.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { formatDate } from "@/lib/utils/format-date";
import type { Difficulty, ReadingTimeResult } from "@/types/content";

export interface DocumentHeaderProps {
  title: string;
  description: string;
  topic: { title: string; href: string };
  difficulty?: Difficulty;
  readingTime: ReadingTimeResult;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
}

export function DocumentHeader({
  title,
  description,
  topic,
  difficulty,
  readingTime,
  publishedAt,
  updatedAt,
  tags,
}: DocumentHeaderProps) {
  const dateLabel = updatedAt ? "Updated" : "Published";
  const dateValue = formatDate(updatedAt ?? publishedAt);

  const entries: { key: string; content: React.ReactNode }[] = [];
  if (difficulty) {
    entries.push({ key: "difficulty", content: difficulty });
  }
  entries.push({ key: "reading-time", content: readingTime.text });
  entries.push({ key: "date", content: `${dateLabel} ${dateValue}` });
  entries.push({
    key: "topic",
    // The one metadata field with somewhere to link to — not run through
    // the row's `capitalize` styling like its siblings (a proper noun
    // shouldn't be forced through a transform meant for lowercase values
    // like `difficulty`).
    content: (
      <Link
        href={topic.href}
        className="normal-case hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {topic.title}
      </Link>
    ),
  });
  if (tags.length > 0) {
    entries.push({ key: "tags", content: tags.join(", ") });
  }

  return (
    <Stack gap="lg" className="max-w-reading">
      <h1 className="text-h1 text-foreground">{title}</h1>

      <p className="text-body text-muted-foreground">{description}</p>

      <p className="text-caption text-muted-foreground/70 capitalize">
        {entries.map((entry, index) => (
          <span key={entry.key}>
            {index > 0 && " · "}
            {entry.content}
          </span>
        ))}
      </p>
    </Stack>
  );
}
