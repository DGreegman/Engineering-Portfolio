/**
 * DocumentLayout
 *
 * The structural frame every Engineering Article uses — Task 4.3.2's
 * "Reading Layout," the document skeleton `docs/20-ARTICLE_EXPERIENCE.md`'s
 * "Top-to-bottom document structure" specifies: Breadcrumb → Document
 * Header → Series Banner (conditional) → Reading Layout (Table of Contents
 * + Document Body) → Related Learning → Previous/Next Navigation. Lives in
 * `components/content/` rather than `components/knowledge/`: it's specific
 * to reading *one document*, not to the Knowledge library's browsing/
 * discovery surfaces (`components/knowledge/` is `StartHere`,
 * `BrowseByTopic`, and the rest of that library-discovery vocabulary) —
 * matching `docs/10-Technical Architecture.md`'s own Component
 * Organization, which reserves `content/` for exactly this
 * (`docs/09-Component Specification.md`'s "Content Components" category:
 * Article Header, Markdown Renderer, ...).
 *
 * Every region is a named, optional slot rather than hardcoded content —
 * "support future document components without modification" (this task's
 * own engineering constraint). Tasks 4.3.3 (Document Header) through 4.3.9
 * (Previous/Next) filled these slots one at a time, each only ever passing
 * a prop here — never touching this file's own structure. As of Task
 * 4.3.9, every region had shipped for the Article; Task 5.3 (Case Study
 * Experience) is the first consumer to actually exercise that "support
 * future document components without modification" promise — see
 * `relatedKnowledge`/`engineeringLogs` below.
 *
 * A slot can still render visibly empty for a *specific* document without
 * that being a bug — most articles were never going to be part of a
 * series, a short article can legitimately have no h2-h4 headings, an
 * article with no prerequisites/series/relatedContent and no sibling in
 * its own topic legitimately has nothing for Related Learning to show, and
 * a standalone article outside any series or topic sequence legitimately
 * has no Previous/Next pair. Two different mechanisms handle this,
 * depending on whether the *region itself* can be absent or only its
 * *content* can:
 *
 * - `seriesBanner`, `relatedLearning`, `relatedKnowledge`, and
 *   `engineeringLogs` are the slots whose `Section` is conditionally
 *   omitted below — an absent one leaves no trace in the DOM at all.
 *   `relatedLearning` moved into this group in Task 5.3: it rendered
 *   unconditionally through Task 4.3.9 because every Knowledge route
 *   always passed it, but the Case Study route legitimately never does
 *   (Work uses `relatedKnowledge`/`engineeringLogs` instead — docs/31 §3's
 *   "two separate closing relationships... on purpose" — so a Case Study
 *   page with an unconditional `relatedLearning` `Section` would show a
 *   dashed "Related Learning Region" placeholder box for a region that
 *   isn't part of its approved structure at all). This is the identical
 *   bug class `seriesBanner`'s own fix already caught once (below) —
 *   caught this time by design, not by publishing a broken page first.
 * - `tableOfContents` and `previousNext` still render their `Section`
 *   wrapper unconditionally (touching `tableOfContents`'s would mean
 *   modifying `DocumentContainer`'s structure, Task 4.3.2's, which no
 *   later task owns) — `TableOfContents`/`PreviousNext` each just return
 *   `null` into their own `Section` when they have nothing to show,
 *   leaving an empty landmark rather than none. Harmless (nothing for a
 *   screen reader to announce inside it) and a smaller compromise than
 *   changing layout structure a different task owns. `seriesBanner`'s
 *   version of this was a bug caught by actually publishing an article and
 *   looking at it, not by re-reading the code: `how-jwt-works.mdx` has no
 *   `series`, and the page was showing a "Series Banner Region" placeholder
 *   box anyway, left over from before Task 4.3.3's real `SeriesBanner`
 *   existed.
 *
 * `relatedKnowledge`/`engineeringLogs` (Task 5.3): the Case Study's own two
 * closing relationship regions, distinct from `relatedLearning` per
 * `docs/31-CASE_STUDY_EXPERIENCE.md` §1/§3 — Related Knowledge answers
 * "what concept does this apply," Engineering Logs answers "what process
 * produced this," and keeping them as two separately-landmarked `Section`s
 * (rather than composing two components inside the one existing
 * `relatedLearning` slot) is what preserves that distinction as a real,
 * separately-announced document region rather than a visual detail inside
 * one. A route passes either `relatedLearning` (Knowledge) or
 * `relatedKnowledge`/`engineeringLogs` (Work) — never expected to mix, though
 * nothing here enforces that structurally, the same "trusts its caller"
 * posture every other slot in this component already has.
 *
 * `relatedWork` (Task 6.2, docs/37-ENGINEERING_LOG_EXPERIENCE.md §12,
 * docs/38-ENGINEERING_LOG_IMPLEMENTATION_PLAN.md WI-1): the Engineering
 * Log entry's own closing relationship region — "which Case Study or
 * Case Studies did this process feed into," resolved by
 * `resolveRelatedWorkForLog()` (`lib/content/engineering-logs.ts`).
 * Deliberately a new, fourth closing-relationship slot rather than reusing
 * `engineeringLogs` (already correctly scoped to the *opposite* direction
 * of this exact relationship — a Case Study's own outgoing link to its
 * logs, hardcoded `aria-label="Engineering Logs"`, which would mislabel a
 * Log entry's incoming link back to Work) or `relatedKnowledge` (already
 * correctly scoped to a genuinely different relationship — concepts, not
 * projects). Follows the identical pattern Task 5.3 already established
 * for `relatedKnowledge`/`engineeringLogs`: its own hardcoded
 * `aria-label`, its own conditionally-omitted `Section`, no change to any
 * other slot's behavior. A route passes `relatedWork` alone (Engineering
 * Log), `relatedKnowledge`/`engineeringLogs` alone (Work), or
 * `relatedLearning` alone (Knowledge) — the same "trusts its caller,
 * never expected to mix" posture already stated above, now extended to a
 * third collection.
 *
 * Every `?? <PlaceholderRegion />` fallback below is now a defensive-only
 * path, not a "still coming" signal — every real article resolves a topic
 * (required by schema) and has body content, and every route always passes
 * a real `TableOfContents`/`PreviousNext` element (never leaves either of
 * those two props unset), so neither should actually hit its fallback;
 * each exists to make it obvious if that assumption is ever wrong, not
 * because emptiness is expected.
 *
 * No `authorFooter` slot: this task's own "Document Structure" region list
 * doesn't include one (`docs/20`'s Information Architecture does, as the
 * page's closing section) — omitted here rather than added on this task's
 * own initiative, per its "do not introduce new layout decisions unless
 * required" constraint. Revisit when a later task's scope actually calls
 * for it.
 *
 * Each simple (non-Reading-Layout) region reuses the existing `Section`
 * primitive directly rather than a new `DocumentSection` wrapper — nothing
 * about these regions needs behavior `Section` doesn't already provide
 * (spacing + width), so a second primitive purely for the sake of a
 * different name would be one of the "abstractions that are only used
 * once" (per instance) this task explicitly says to avoid, while adding no
 * capability `Section` doesn't already have. `aria-label` (not
 * `aria-labelledby`) on each: there's no heading to point at yet, since
 * region content doesn't exist yet — a future task adding one can upgrade
 * to `aria-labelledby` when it does, a small, self-contained change.
 *
 * `width="full"` on every region — this route (`/knowledge/[slug]`) has no
 * sidebar today, so relies on `WorkspaceLayout`'s shared `PageContainer`
 * for its horizontal gutter, the same pattern every `/knowledge/*` page
 * already uses (Tasks 4.1/4.2).
 *
 * A Server Component: pure structure, no client interactivity.
 */
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";
import { DocumentContainer } from "@/components/layout/document-container";

function PlaceholderRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-border p-6 text-caption text-muted-foreground",
        className,
      )}
    >
      {label}
      {children}
    </div>
  );
}

export interface DocumentLayoutProps {
  breadcrumb?: React.ReactNode;
  header?: React.ReactNode;
  seriesBanner?: React.ReactNode;
  tableOfContents?: React.ReactNode;
  body?: React.ReactNode;
  relatedLearning?: React.ReactNode;
  /** Case Study only (Task 5.3) — see this file's own docstring. */
  relatedKnowledge?: React.ReactNode;
  /** Case Study only (Task 5.3) — see this file's own docstring. */
  engineeringLogs?: React.ReactNode;
  /** Engineering Log only (Task 6.2) — see this file's own docstring. */
  relatedWork?: React.ReactNode;
  previousNext?: React.ReactNode;
}

export function DocumentLayout({
  breadcrumb,
  header,
  seriesBanner,
  tableOfContents,
  body,
  relatedLearning,
  relatedKnowledge,
  engineeringLogs,
  relatedWork,
  previousNext,
}: DocumentLayoutProps) {
  return (
    <>
      <Section aria-label="Breadcrumb" spacing="sm" width="full">
        {breadcrumb ?? <PlaceholderRegion label="Breadcrumb Region" />}
      </Section>

      <Section aria-label="Document Header" spacing="md" width="full">
        {header ?? <PlaceholderRegion label="Document Header Region" />}
      </Section>

      {seriesBanner && (
        <Section aria-label="Series Banner" spacing="md" width="full">
          {seriesBanner}
        </Section>
      )}

      <Section aria-label="Reading Layout" spacing="md" width="full">
        <DocumentContainer
          sidebar={
            tableOfContents ?? (
              <PlaceholderRegion label="Table of Contents Region" />
            )
          }
          body={
            body ?? (
              <PlaceholderRegion label="Document Body Region">
                {/* Repeated diagnostic lines, not article prose — enough
                    height to actually verify the sidebar's sticky
                    positioning by scrolling, without pretending to be
                    real content (Task 4.3.2 §"Out of Scope": no MDX
                    rendering, no document functionality). Removed the
                    moment a real body is passed in. */}
                <div className="mt-4 space-y-4">
                  {Array.from({ length: 16 }, (_, index) => (
                    <p key={index}>
                      Document Body Region — placeholder content for layout
                      verification (line {index + 1} of 16).
                    </p>
                  ))}
                </div>
              </PlaceholderRegion>
            )
          }
        />
      </Section>

      {relatedLearning && (
        <Section aria-label="Related Learning" spacing="md" width="full">
          {relatedLearning}
        </Section>
      )}

      {relatedKnowledge && (
        <Section aria-label="Related Knowledge" spacing="md" width="full">
          {relatedKnowledge}
        </Section>
      )}

      {engineeringLogs && (
        <Section aria-label="Engineering Logs" spacing="md" width="full">
          {engineeringLogs}
        </Section>
      )}

      {relatedWork && (
        <Section aria-label="Related Work" spacing="md" width="full">
          {relatedWork}
        </Section>
      )}

      <Section
        aria-label="Previous / Next Navigation"
        spacing="md"
        width="full"
      >
        {previousNext ?? (
          <PlaceholderRegion label="Previous / Next Navigation Region" />
        )}
      </Section>
    </>
  );
}
