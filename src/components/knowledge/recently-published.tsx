/**
 * RecentlyPublished
 *
 * The page's one chronological section (Task 4.1 §7) — appears after every
 * discovery-focused section, and stays visually the quietest one on the
 * page on purpose: "chronology should never dominate the page." Reuses the
 * homepage `EngineeringLog`'s minimal row treatment (no card, no summary,
 * just a quiet metadata line and a title) rather than
 * `EngineeringNotebook`'s card grid, specifically so this section reads as
 * lighter-weight than `StartHere` above it — the same content shape
 * (`KnowledgeArticleCard`) rendered with deliberately less visual weight.
 *
 * Fully data-agnostic: `articles` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { RECENTLY_PUBLISHED_COPY } from "@/lib/constants/knowledge-copy";
import type { KnowledgeArticleCard } from "@/lib/constants/placeholder-knowledge-landing";

function RecentEntryRow({ article }: { article: KnowledgeArticleCard }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-4 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        {article.topic} · {article.publishedAt}
      </p>
      <h3 className="mt-1 text-body font-normal text-foreground">
        <Link
          href={article.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {article.title}
        </Link>
      </h3>
    </li>
  );
}

export function RecentlyPublished({
  articles,
}: {
  articles: KnowledgeArticleCard[];
}) {
  return (
    // width="full" — see KnowledgeHero's comment.
    <Section
      id="recently-published"
      aria-labelledby="recently-published-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="recently-published-heading"
            className="text-h2 text-foreground"
          >
            {RECENTLY_PUBLISHED_COPY.title}
          </h2>
          {RECENTLY_PUBLISHED_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {articles.length === 0 ? (
          <Stack gap="xs">
            {RECENTLY_PUBLISHED_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ol className="max-w-reading divide-y divide-border/50">
            {articles.map((article) => (
              <RecentEntryRow key={article.href} article={article} />
            ))}
          </ol>
        )}
      </Stack>
    </Section>
  );
}
