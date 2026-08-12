/**
 * RelatedLearning
 *
 * The Engineering Article's closing "where do I go next" region — Task
 * 4.3.8's own scope, slotting into `DocumentLayout`'s `relatedLearning`
 * prop (Task 4.3.2). Renders the four groups
 * `lib/content/relationships.ts`'s `resolveRelatedLearning()` already
 * resolved against real content: Prerequisites, Continue Learning, Related
 * Concepts, and Same Topic — in that order, matching
 * `docs/18-ARTICLE_TEMPLATE.md`'s "Related Learning" section and this
 * task's own group order.
 *
 * This component does no resolution itself — it only renders what it's
 * handed. All relationship logic (which slugs resolve, which group wins
 * when more than one could apply, the Same Topic fallback trigger) lives
 * in `relationships.ts`, once, so this file can't drift from it or
 * duplicate it (this task's own "avoid duplicate relationship logic"
 * constraint).
 *
 * Each group renders only when populated — an empty group returns `null`
 * rather than an empty heading with nothing beneath it (this task's own
 * "avoid empty sections" requirement) — and the whole component returns
 * `null` when every group is empty, so a genuinely unconnected article
 * (no prerequisites, no series, no relatedContent, and no other article
 * sharing its topic) leaves no visible trace rather than an empty "Related
 * Learning" heading. The route still always passes a `<RelatedLearning />`
 * element (same pattern `TableOfContents` already established for its own
 * "possibly nothing to show" case — see `document-layout.tsx`'s docstring),
 * so `DocumentLayout`'s placeholder fallback for this slot is now
 * effectively dead code, exactly as it already is for every other region a
 * later task has since shipped.
 *
 * Card layout and citation line (difficulty · reading time · published)
 * reuse the exact idiom already established by `StartHere`'s
 * `StartHereEntry` and `TopicArticleList`'s `ArticleRow` — a stretched-link
 * `Card` with a title `Link`, description, and a quiet `·`-joined caption —
 * rather than a new visual pattern invented for this section (this task's
 * "reuse existing article summary components where appropriate"
 * acceptance criterion). `topic` is deliberately omitted from the caption:
 * every card in the Same Topic group already shares the current article's
 * topic by definition (the same reasoning `TopicArticleList` already
 * documents for why *its* rows omit topic), and Prerequisites/Continue
 * Learning/Related Concepts entries are compact previews, not a place to
 * introduce a field none of this codebase's other summary cards mix with
 * difficulty/reading-time this way.
 *
 * One deliberate deviation from `StartHereEntry`'s copied idiom (Task
 * 4.3.10 accessibility fix): that pattern puts the keyboard-focus ring on
 * the *card* via `focus-within:ring-2 focus-within:ring-ring`, banking on
 * `:focus-within` to light it up when the inner title `Link` receives
 * focus. Confirmed by real keyboard-Tab testing (not just code reading)
 * that this silently never renders — `Card`'s own unconditional `ring-1
 * ring-foreground/10` computes the element's actual `box-shadow` and the
 * `focus-within:` override loses that fight, so a keyboard user tabbing to
 * a card here got no visible focus indicator at all (WCAG 2.4.7 Focus
 * Visible, Level AA — confirmed present in the pre-existing `StartHere`
 * component too, via the identical inherited pattern, but that file
 * belongs to Task 4.1 and is out of this task's scope to touch). The fix
 * kept local to this file: the ring lives on the `Link` itself via
 * `focus-visible:*`, the same single-element pattern every other working
 * focus indicator in this codebase already uses (`Breadcrumb`, `CopyButton`,
 * `PreviousNext`, `DocumentHeader`'s topic link) — not a new pattern
 * invented for this fix, the *proven* one adopted in place of the broken
 * one.
 *
 * Heading hierarchy: this component's own `<h2>Related Learning</h2>` sits
 * as a sibling to the MDX body's own h2s (Introduction, The Problem, ...) —
 * both are direct children of the document's one `<h1>` — each group name
 * (Prerequisites, Continue Learning, ...) is an `<h3>`, and each card title
 * is an `<h4>`, so the section nests three levels deep without skipping
 * any (`docs/20-ARTICLE_EXPERIENCE.md`'s Accessibility section: "Exactly
 * one `<h1>` per article").
 *
 * A Server Component: static content resolved server-side, no
 * interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  hasRelatedLearningContent,
  type RelatedLearningGroups,
  type ResolvedArticleSummary,
} from "@/lib/content/relationships";

function RelatedArticleCard({ article }: { article: ResolvedArticleSummary }) {
  const citation = article.difficulty
    ? `${article.difficulty} · ${article.readingTime} · ${article.publishedAt}`
    : `${article.readingTime} · ${article.publishedAt}`;

  return (
    <Card className="relative h-full transition-[transform,box-shadow] duration-150 ease-out hover:ring-foreground/20 motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]">
      <CardHeader>
        <h4 className="text-h4 text-foreground">
          <Link
            href={article.href}
            className="rounded-sm after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {article.title}
          </Link>
        </h4>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          <p className="text-small text-muted-foreground">
            {article.description}
          </p>
          {/* `text-muted-foreground`, not `/70` — Task 4.3.10 accessibility
              fix; see `document-header.tsx`'s identical fix for the
              measured contrast ratios (the same token, same defect,
              copied from that component when this one was built). */}
          <p className="text-caption text-muted-foreground capitalize">
            {citation}
          </p>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RelatedLearningGroup({
  headingId,
  title,
  description,
  articles,
}: {
  headingId: string;
  title: string;
  description: string;
  articles: ResolvedArticleSummary[];
}) {
  // "Display only when populated" — this task's own Rendering Behaviour
  // requirement, applied per group, not just to the section as a whole.
  if (articles.length === 0) return null;

  return (
    // No `aria-labelledby` on this wrapper (Task 4.3.10 accessibility fix
    // — an axe-core `aria-prohibited-attr` finding): `Stack` renders a
    // plain `<div>` with no ARIA role, which doesn't expose an accessible
    // name via `aria-labelledby` at all — the attribute was inert, not
    // merely redundant. The visible `<h3 id={headingId}>` below already
    // makes each group's name reachable in normal reading order and via
    // heading-level screen-reader navigation; a `role="region"` would make
    // the label meaningful, but four new landmark regions nested inside
    // Related Learning's own `Section` landmark is more landmark
    // proliferation than a heading-navigable list of four groups needs.
    <Stack gap="sm">
      <Stack gap="xs">
        <h3 id={headingId} className="text-h3 text-foreground">
          {title}
        </h3>
        <p className="text-small text-muted-foreground">{description}</p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <RelatedArticleCard article={article} />
          </li>
        ))}
      </ul>
    </Stack>
  );
}

export function RelatedLearning({ groups }: { groups: RelatedLearningGroups }) {
  // A genuinely unconnected article — no prerequisites, no series, no
  // relatedContent, and no sibling in its own topic — renders nothing here
  // rather than an empty "Related Learning" heading over four empty
  // groups. Shared with the route's own pre-render check (Task 5.7 RC
  // refinement #2) via `hasRelatedLearningContent()` — one definition of
  // "empty," not two that could drift apart.
  if (!hasRelatedLearningContent(groups)) return null;

  return (
    <Stack gap="lg">
      <h2 className="text-h2 text-foreground">Related Learning</h2>

      <RelatedLearningGroup
        headingId="related-learning-prerequisites"
        title="Prerequisites"
        description="Ideally understood before reading this document."
        articles={groups.prerequisites}
      />
      <RelatedLearningGroup
        headingId="related-learning-continue"
        title="Continue Learning"
        description="The recommended next step in this learning journey."
        articles={groups.continueLearning}
      />
      <RelatedLearningGroup
        headingId="related-learning-concepts"
        title="Related Concepts"
        description="Conceptually related documents worth exploring."
        articles={groups.relatedConcepts}
      />
      <RelatedLearningGroup
        headingId="related-learning-same-topic"
        title="More From This Topic"
        description="Other documents from the same engineering domain."
        articles={groups.sameTopic}
      />
    </Stack>
  );
}
