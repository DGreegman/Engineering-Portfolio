/**
 * StartHere
 *
 * "Where should I begin?" (Task 4.1 §1) — the page's actual answer to that
 * question. Three curated entries, not the newest three: this section
 * exists specifically to reduce decision fatigue for first-time visitors
 * (Task 4.1 §4), so it must stay editorially curated rather than
 * chronological or algorithmic.
 *
 * Fully data-agnostic, same pattern as the homepage's
 * `EngineeringNotebook`: `articles` is a required prop. Today
 * `app/knowledge/page.tsx` passes `PLACEHOLDER_START_HERE`
 * (lib/constants/placeholder-knowledge-landing.ts); once the Content Engine
 * can mark real entries as curated starting points, that becomes a
 * one-line change here — the component itself doesn't change (Task 4.1 §9).
 *
 * Reuses the stretched-link card pattern already established by
 * `EngineeringNotebook`'s `NotebookEntry` (title is the one real `<Link>`,
 * `after:absolute after:inset-0` extends the hit area to the whole card),
 * plus a small "Recommended" kicker above each title (design refinement
 * #4) so these read as curated picks rather than the same card pattern
 * `BrowseByTopic`/`RecentlyPublished` use elsewhere on this page.
 *
 * `spacing="lg"` (not the page's usual "md") — design refinement #3:
 * deliberately more top space than any other section transition on this
 * page, so the Hero → Start Here move reads as a stronger beat, matching
 * this section's role as the actual answer to "where do I begin."
 *
 * `Section` gets an explicit `id`/`aria-labelledby` pair pointing at its own
 * `h2` — Task 4.1 §11 calls out "proper landmark structure" directly, so
 * every section on this page labels its own landmark region.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { START_HERE_COPY } from "@/lib/constants/knowledge-copy";
import type { KnowledgeArticleCard } from "@/lib/constants/placeholder-knowledge-landing";

function StartHereEntry({ article }: { article: KnowledgeArticleCard }) {
  const citation = article.difficulty
    ? `${article.topic} · ${article.difficulty} · ${article.readingTime}`
    : `${article.topic} · ${article.readingTime}`;

  return (
    <Card className="relative h-full transition-[transform,box-shadow] duration-150 ease-out hover:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]">
      <CardHeader>
        <p className="font-mono text-caption text-muted-foreground">
          {START_HERE_COPY.cardLabel}
        </p>
        <h3 className="text-h4 text-foreground">
          <Link
            href={article.href}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {article.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          <p className="text-small text-muted-foreground">
            {article.description}
          </p>
          <p className="text-caption text-muted-foreground/70 capitalize">
            {citation}
          </p>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function StartHere({ articles }: { articles: KnowledgeArticleCard[] }) {
  return (
    // width="full" — see KnowledgeHero's comment: WorkspaceLayout's shared
    // sidebar/main Container already supplies the gutter for this page.
    <Section
      id="start-here"
      aria-labelledby="start-here-heading"
      spacing="lg"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="start-here-heading" className="text-h2 text-foreground">
            {START_HERE_COPY.title}
          </h2>
          {START_HERE_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {articles.length === 0 ? (
          <Stack gap="xs">
            {START_HERE_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="grid gap-6 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.title}>
                <StartHereEntry article={article} />
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
