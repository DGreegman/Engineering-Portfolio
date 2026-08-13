/**
 * AboutHeader — `/about`'s opening section (Task 6.3, WI-2; portrait added
 * in Task 6.3a).
 *
 * "Who is this, in one line?" (docs/39 §8). The page's only `<h1>`.
 * Structurally the same eyebrow → h1 → intro-paragraphs shape every other
 * landing/index page in this workspace already opens with (WorkHero,
 * `app/engineering-log/page.tsx`'s own inline header) — reused as a
 * pattern, not imported across a route boundary, matching every prior
 * Core Pages task's "every route owns its own section components" rule.
 *
 * Portrait (Task 6.3a, resized/realigned twice per live review): a real
 * asset now exists (`public/images/portrait.jpeg`, 1080×998), so docs/39
 * D3's "no portrait until a real asset exists" condition is satisfied.
 * Rendered secondary in DOM order — text first, portrait second — but
 * sized deliberately, not token-sized: full column width below the text on
 * mobile/small-tablet (`flex-col`, image `w-full`), then a large, clearly
 * visible fixed width beside the text, trailing, from `md:` up
 * (`md:flex-row`, image `md:w-72 lg:w-96`). The row breakpoint is `md:`
 * (768px), not `sm:` (640px) — at 640–767px there isn't room for a fixed-
 * width portrait beside `max-w-reading`-width text without squeezing
 * either one, so that range stays in the stacked, full-width mobile
 * layout rather than a cramped in-between row.
 *
 * "Supports the narrative rather than leading it" (Task 6.3a's original
 * framing) is now expressed through position and DOM order — text first,
 * portrait secondary/trailing — not through making the portrait small;
 * a small image read as an afterthought rather than restrained, per live
 * review.
 *
 * The outer row is *not* capped at `max-w-reading` — it spans the same
 * full-width `Section width="full"` container every other page's own
 * header row already uses, so the portrait's right edge lands on the same
 * shared `PageContainer` right edge `Header`'s own icon cluster aligns to
 * (`workspace-layout.tsx`'s own documented invariant: one shared container,
 * used by Header/Footer/every page body alike). Only the text column
 * itself carries `max-w-reading`, so paragraphs stay a comfortable reading
 * width even though the row around them doesn't.
 *
 * The source photo (1080×998, very slightly wider than tall) carries a
 * QR/watermark element in its top-right corner. Excluded entirely through
 * CSS presentation cropping — `aspect-[3/4]` (a narrower-than-source
 * portrait ratio) + `object-cover` + `objectPosition: "30% 50%"` — never
 * by editing the source file, which is untouched. At this crop ratio, the
 * visible window covers roughly the leftmost 70% of the original width
 * (x ≈ 116px–864px of 1080px at 30% position); the watermark sits at
 * roughly x ≈ 953px–1080px — comfortably outside the visible window with
 * margin on both sides, confirmed against the actual file, not estimated
 * from the crop math alone.
 *
 * A Server Component: static content, no interactivity. `next/image`
 * (not a plain `<img>`) — the one existing image usage elsewhere in this
 * codebase (`mdx-components.tsx`'s `Img`) uses a plain `<img>` specifically
 * because Markdown-authored images carry no known dimensions; this asset's
 * dimensions are known and fixed, so `next/image`'s optimization applies
 * cleanly. `fill` (not fixed `width`/`height` attributes) because the
 * *container*, not the image, owns the responsive size — a fixed aspect
 * ratio at a Tailwind-responsive width, the same pattern `Card`'s own
 * `has-[>img:first-child]` image handling anticipates for a sized box.
 */
import Image from "next/image";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ABOUT_HEADER_COPY } from "@/lib/constants/about-copy";

export function AboutHeader() {
  return (
    <Section spacing="md" width="full">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
        <Stack gap="lg" className="max-w-reading flex-1">
          <p className="font-mono text-caption text-muted-foreground">
            {ABOUT_HEADER_COPY.eyebrow}
          </p>

          <h1 className="text-h1 text-foreground">
            {ABOUT_HEADER_COPY.headline}
          </h1>

          <Stack gap="sm">
            {ABOUT_HEADER_COPY.introduction.map((paragraph) => (
              <p
                key={paragraph}
                className="text-body text-justify leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </Stack>
        </Stack>

        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl ring-1 ring-foreground/10 md:w-72 lg:w-96">
          <Image
            src="/images/portrait.jpeg"
            alt="Portrait of Gracious Obeagu"
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 768px) 18rem, 100vw"
            className="object-cover"
            style={{ objectPosition: "30% 50%" }}
            priority
          />
        </div>
      </div>
    </Section>
  );
}
