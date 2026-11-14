/**
 * EngineeringNotebook
 *
 * "A curated reading shelf, not a blog feed" (Task 3.4). Introduces the
 * Knowledge collection from the homepage without becoming a blog listing.
 * See docs/13-HOMEPAGE_EXPERIENCE.md ("Knowledge Preview" — "demonstrate
 * engineering depth... encourage exploration") and
 * docs/14-HOMEPAGE_COPY.md ("Engineering Notebook"). Copy is reproduced
 * verbatim from lib/constants/homepage-copy.ts's `ENGINEERING_NOTEBOOK_COPY`.
 *
 * Fully data-agnostic (Task 3.4 review feedback §5): this component takes
 * `articles` as a required prop and has no idea where they came from. Today
 * `app/page.tsx` passes `PLACEHOLDER_KNOWLEDGE`
 * (lib/constants/placeholder-knowledge.ts); once the Content Engine
 * (Milestone 3) exists, that becomes real Knowledge entries — a one-line
 * change in `page.tsx`, not a change here. The only data-driven branch this
 * component makes is presentational: an empty `articles` array renders
 * `ENGINEERING_NOTEBOOK_COPY.emptyState` instead of the grid, which is
 * genuine doc-14 copy for exactly that real future case, not a stand-in.
 *
 * Entries use numbered editorial rows with topic and reading metadata in
 * one column and the article summary in another on wide screens. This
 * creates a browsing rhythm distinct from the featured work panel above.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { ENGINEERING_NOTEBOOK_COPY } from "@/lib/constants/homepage-copy";
import type { NotebookArticle } from "@/lib/constants/placeholder-knowledge";

/**
 * One numbered article row. The stretched link gives the complete row a
 * generous target while preserving one native link and one tab stop.
 */
function NotebookEntry({
  article,
  index,
}: {
  article: NotebookArticle;
  index: number;
}) {
  return (
    <li className="relative grid gap-3 border-t border-border py-6 transition-colors hover:bg-secondary/35 focus-within:bg-secondary/35 focus-within:ring-2 focus-within:ring-ring lg:grid-cols-[3.5rem_minmax(0,1fr)_minmax(16rem,0.8fr)] lg:gap-6 lg:py-7">
      <p className="font-mono text-caption text-brand-accent">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div>
        <h3 className="text-h4 text-foreground">
          <Link
            href={article.href}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 text-small text-muted-foreground">
          {article.topic} · {article.readingTime} · {article.publishedAt}
        </p>
      </div>
      <p className="text-small text-muted-foreground lg:pl-2">
        {article.summary}
      </p>
    </li>
  );
}

export function EngineeringNotebook({
  articles,
}: {
  articles: NotebookArticle[];
}) {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer
    // for every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-prose">
          <h2 className="text-h2 text-foreground">
            {ENGINEERING_NOTEBOOK_COPY.title}
          </h2>
          {ENGINEERING_NOTEBOOK_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <Stack gap="sm">
          <h3 className="text-h4 text-foreground">
            {ENGINEERING_NOTEBOOK_COPY.sectionLabel}
          </h3>

          {articles.length === 0 ? (
            <Stack gap="xs">
              {ENGINEERING_NOTEBOOK_COPY.emptyState.map((paragraph) => (
                <p key={paragraph} className="text-body text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </Stack>
          ) : (
            <ul className="border-b border-border">
              {articles.map((article, index) => (
                <NotebookEntry
                  key={article.title}
                  article={article}
                  index={index}
                />
              ))}
            </ul>
          )}
        </Stack>

        <div>
          <Button
            nativeButton={false}
            render={<Link href={ENGINEERING_NOTEBOOK_COPY.primaryCta.href} />}
          >
            {ENGINEERING_NOTEBOOK_COPY.primaryCta.label}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
