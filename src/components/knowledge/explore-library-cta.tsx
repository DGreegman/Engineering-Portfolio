/**
 * ExploreLibraryCta
 *
 * The page's single primary action (Task 4.1 §8) — concludes `/knowledge`
 * by encouraging further exploration rather than introducing new content.
 *
 * Points back to `#browse-by-topic` (the id `BrowseByTopic` sets on its own
 * `Section`) rather than an unbuilt "all articles" route: this page is
 * already the library's entrance, and Search/filtering/pagination are
 * explicitly out of scope for this task (Task 4.1 "Constraints"), so the
 * honest "explore more" destination is the discovery section already on
 * this page. See `lib/constants/knowledge-copy.ts`'s
 * `EXPLORE_LIBRARY_CTA_COPY` docstring for the full reasoning.
 *
 * Structurally the simplest section on the page, deliberately — title, one
 * sentence, one CTA — mirroring the homepage's closing `BeyondTheCode`
 * section (no grid, no list, no card).
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { EXPLORE_LIBRARY_CTA_COPY } from "@/lib/constants/knowledge-copy";

export function ExploreLibraryCta() {
  return (
    // width="full" — see KnowledgeHero's comment.
    <Section
      id="explore-library"
      aria-labelledby="explore-library-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg" className="max-w-prose">
        <h2 id="explore-library-heading" className="text-h2 text-foreground">
          {EXPLORE_LIBRARY_CTA_COPY.title}
        </h2>
        <p className="text-body text-muted-foreground">
          {EXPLORE_LIBRARY_CTA_COPY.description}
        </p>
        <div>
          {/* This renders an <a> (next/link), not a <button> — tell Base UI
              so it stops assuming native-button semantics on an element
              that doesn't have them. */}
          <Button
            nativeButton={false}
            render={<Link href={EXPLORE_LIBRARY_CTA_COPY.primaryCta.href} />}
          >
            {EXPLORE_LIBRARY_CTA_COPY.primaryCta.label}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
