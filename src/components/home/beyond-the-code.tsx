/**
 * BeyondTheCode
 *
 * The homepage's final section — "the closing page of a notebook"
 * (Task 3.7), not an About page. See docs/13-HOMEPAGE_EXPERIENCE.md
 * ("Meet the Engineer" — "introduced only after trust has been
 * established... identity reinforces the experience rather than leading
 * it") and docs/14-HOMEPAGE_COPY.md ("Beyond the Code"). Copy is
 * reproduced verbatim from lib/constants/homepage-copy.ts's
 * `BEYOND_THE_CODE_COPY`.
 *
 * The simplest section on the page, deliberately: title, four paragraphs,
 * one CTA — no grid, no list, no card, no metadata. Structurally closest
 * to the Hero (title + prose + single CTA), which reads right — this is
 * its closing bookend. No photo, skills list, timeline, stats, resume
 * summary, or social grid (Task 3.7's explicit constraints) — the CTA
 * points to `/about`, where identity and contact actually live
 * (docs/03-SITEMAP.md: no standalone Contact page, it's a section of
 * About), so this section stays reflective rather than becoming a second,
 * compressed About page.
 *
 * Left-aligned like every other section on the page — no `text-center` or
 * `mx-auto` on the content itself. That consistency is deliberate: the
 * homepage is one continuous notebook, not a page that centers itself for
 * its final beat.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { BEYOND_THE_CODE_COPY } from "@/lib/constants/homepage-copy";

export function BeyondTheCode() {
  return (
    <Section spacing="md" width="wide">
      <Stack gap="lg" className="max-w-prose">
        <h2 className="text-h2 text-foreground">
          {BEYOND_THE_CODE_COPY.title}
        </h2>

        <Stack gap="sm">
          {BEYOND_THE_CODE_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <div>
          {/* This renders an <a> (next/link), not a <button> — tell Base
              UI so it stops assuming native-button semantics on an
              element that doesn't have them. */}
          <Button
            nativeButton={false}
            render={<Link href={BEYOND_THE_CODE_COPY.primaryCta.href} />}
          >
            {BEYOND_THE_CODE_COPY.primaryCta.label}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
