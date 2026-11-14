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
 * The closing section keeps the existing four paragraphs and one CTA, set
 * in a warm, two-column panel that gives the contact pathway a clear final
 * beat without becoming a compressed About page. No photo, skills list,
 * timeline, stats, resume summary, or social grid — the CTA
 * points to `/about`, where identity and contact actually live
 * (docs/03-SITEMAP.md: no standalone Contact page, it's a section of
 * About), so this section stays reflective rather than becoming a second,
 * compressed About page.
 *
 * The copy remains left-aligned; at desktop the CTA anchors the closing
 * panel's lower edge.
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
    // width="full" — WorkspaceLayout supplies the shared PageContainer
    // for every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <div className="grid gap-8 rounded-xl border border-border bg-secondary/60 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:p-12">
        <Stack gap="lg" className="max-w-4xl">
          <div>
            <p className="font-mono text-caption font-medium uppercase tracking-[0.12em] text-brand-accent">
              A little beyond the systems
            </p>
            <h2 className="mt-3 text-h2 text-foreground">
              {BEYOND_THE_CODE_COPY.title}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-x-8">
            {BEYOND_THE_CODE_COPY.introduction.map((paragraph) => (
              <p key={paragraph} className="text-small text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
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
      </div>
    </Section>
  );
}
