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
 * Grid is `grid-cols-1 lg:grid-cols-3` — no intermediate 2-column step —
 * so with exactly three entries every state is a complete, balanced row
 * (a 2-up grid would orphan the third card on its own row). Tablet gets
 * the same clean single-column stack as mobile.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ENGINEERING_NOTEBOOK_COPY } from "@/lib/constants/homepage-copy";
import type { NotebookArticle } from "@/lib/constants/placeholder-knowledge";

/**
 * One entry on the shelf. Title leads — the strongest visual element, per
 * review feedback §2 — followed by the summary (written as a question or
 * trade-off, not a description, so it earns the read rather than
 * summarizing it away). Topic, reading time, and publication date collapse
 * into a single quiet citation line beneath, `·`-separated at a reduced
 * `/70` opacity — never separate badges/pills (review feedback §3): this
 * should read like the line under an academic paper's title, not
 * marketing metadata.
 *
 * The whole card is the click target, not just the title (latest review
 * feedback), via the "stretched link" pattern: the title is the one real
 * `<Link>` — so it's still the single accessible/keyboard-reachable
 * element, correct DOM semantics, no nested-interactive-element problems —
 * and `after:absolute after:inset-0` extends its *hit area* to cover the
 * whole `relative`-positioned `Card`. Hover gets the same subtle
 * scale+ring treatment already established for Current Focus's cards
 * (`motion-safe`-gated); keyboard focus gets the site's standard strong
 * `ring-2 ring-ring` indicator (the same token Header/Button/nav links
 * use, already verified for WCAG contrast — see globals.css's `--ring`
 * comment) rather than the subtle hover ring, since "subtle" and "clear"
 * are two different asks. The link's own native focus outline is removed
 * in favor of that card-level indicator, so keyboard users see the whole
 * clickable region highlighted, not just the title text.
 */
function NotebookEntry({ article }: { article: NotebookArticle }) {
  return (
    <Card className="relative h-full transition-[transform,box-shadow] duration-150 ease-out hover:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]">
      <CardHeader>
        <h4 className="text-h4 text-foreground">
          <Link
            href={article.href}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {article.title}
          </Link>
        </h4>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          <p className="text-small text-muted-foreground">{article.summary}</p>
          <p className="text-caption text-muted-foreground/70">
            {article.topic} · {article.readingTime} · {article.publishedAt}
          </p>
        </Stack>
      </CardContent>
    </Card>
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
            <ul className="grid gap-6 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.title}>
                  <NotebookEntry article={article} />
                </li>
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
