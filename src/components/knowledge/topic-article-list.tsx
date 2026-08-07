/**
 * TopicArticleList
 *
 * The topic page's "Articles" section (Task 4.2 §5) — the remaining shelf,
 * beyond the three Start Here picks above it. A genuinely new component,
 * not a reskin of `RecentlyPublished`: that component is deliberately the
 * quietest section on the library-wide page ("chronology should never
 * dominate," title + date only), while Task 4.2 §5 explicitly asks for a
 * richer preview per entry — title, summary, reading time, difficulty, and
 * published date all shown — which calls for its own component rather than
 * stretching `RecentlyPublished` to do a job it was deliberately built not
 * to do.
 *
 * Reuses the same stretched-link `divide-y` row pattern as
 * `LearningSeries`/`EngineeringCaseStudies`' `CaseFile`: the title is the
 * one real `<Link>`, `after:absolute after:inset-0` extends the hit area to
 * the full row. Citation line omits topic (unlike `StartHere`'s cards) —
 * Task 4.2 §5's own field list doesn't include it, and every article here
 * is already known to belong to the current topic by virtue of the page
 * it's on, so repeating it on every row would be redundant.
 *
 * Fully data-agnostic: `articles` is a required prop, same pattern as every
 * other section on this page. `app/knowledge/[slug]/page.tsx` passes a
 * topic's slice of `placeholder-topic-articles.ts` today; swapping that for
 * real Knowledge entries later is a one-line change at the call site, not a
 * component redesign (Task 4.2 §1 — "should already support future MDX
 * content without redesign").
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import type { KnowledgeArticleCard } from "@/lib/constants/placeholder-knowledge-landing";

function ArticleRow({ article }: { article: KnowledgeArticleCard }) {
  const citation = article.difficulty
    ? `${article.difficulty} · ${article.readingTime} · ${article.publishedAt}`
    : `${article.readingTime} · ${article.publishedAt}`;

  return (
    <li className="relative -mx-4 rounded-md px-4 py-8 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <h3 className="text-h4 text-foreground">
        <Link
          href={article.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {article.title}
        </Link>
      </h3>
      <Stack gap="xs" className="mt-2">
        <p className="text-small text-muted-foreground">
          {article.description}
        </p>
        <p className="text-caption text-muted-foreground/70 capitalize">
          {citation}
        </p>
      </Stack>
    </li>
  );
}

export function TopicArticleList({
  title,
  introduction,
  emptyState,
  articles,
}: {
  title: string;
  introduction: readonly string[];
  emptyState: readonly string[];
  articles: KnowledgeArticleCard[];
}) {
  return (
    <Section
      id="articles"
      aria-labelledby="articles-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="articles-heading" className="text-h2 text-foreground">
            {title}
          </h2>
          {introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {articles.length === 0 ? (
          <Stack gap="xs">
            {emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ol className="max-w-reading divide-y divide-border">
            {articles.map((article) => (
              <ArticleRow key={article.href} article={article} />
            ))}
          </ol>
        )}
      </Stack>
    </Section>
  );
}
