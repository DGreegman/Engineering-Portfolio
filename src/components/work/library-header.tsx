/**
 * LibraryHeader
 *
 * "Where am I, and how much work is here?" (docs/30-CASE_STUDY_LIBRARY_
 * PROPOSAL.md §1). Orientation, not argument — this section states what
 * this page is (the complete archive) and its real scale, and carries no
 * thesis the rest of the page has to substantiate, unlike the Landing's
 * `WorkHero`.
 *
 * Kept as its own component rather than a generalized, props-driven reuse
 * of `WorkHero` — the same "different purpose, similar shape" call
 * `KnowledgeHero`/`TopicHero` already made in the Knowledge section. Those
 * two coexist as separate components because a topic hero's job (orient a
 * reader within one domain, show a real `articleCount`) is meaningfully
 * different from the library-wide hero's (introduce the whole library),
 * even though both open with an eyebrow/headline/introduction. `WorkHero`
 * and `LibraryHeader` are the same situation: `WorkHero` opens an argument,
 * `LibraryHeader` opens an archive and reports a real count — different
 * purposes that happen to share a visual shape, not one purpose expressed
 * on two pages (which is what `ContinueExploring`'s Task 5.2 generalization
 * actually was).
 *
 * `count` is a required prop, same data-agnostic pattern as every other
 * section on this page — `app/work/library/page.tsx` passes
 * `getProjectLibrary().length`, not a guess.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { LIBRARY_HEADER_COPY } from "@/lib/constants/work-library-copy";

export function LibraryHeader({ count }: { count: number }) {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer for
    // every page now; see work-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <Stack gap="lg" className="max-w-reading">
        <p className="font-mono text-caption text-muted-foreground">
          {LIBRARY_HEADER_COPY.eyebrow}
        </p>

        <h1 className="text-h1 text-foreground">
          {LIBRARY_HEADER_COPY.headline}
        </h1>

        <Stack gap="sm">
          {LIBRARY_HEADER_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <p className="text-small text-muted-foreground">
            {LIBRARY_HEADER_COPY.scaleLabel(count)}
          </p>
        </Stack>
      </Stack>
    </Section>
  );
}
