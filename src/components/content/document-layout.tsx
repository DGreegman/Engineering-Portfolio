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
 * (Previous/Next) fill these slots one at a time, each only ever passing a
 * prop here — never touching this file's own structure.
 *
 * Two different reasons a slot can be empty, handled two different ways:
 *
 * - **Not built yet** (`relatedLearning`, `previousNext` today): renders a
 *   dashed-border `PlaceholderRegion` labeled with the region's name — an
 *   honest "this is coming" signal, not a silent gap, while the task that
 *   owns it hasn't shipped.
 * - **Legitimately absent for this document** (`seriesBanner`, once Task
 *   4.3.3 shipped a real one; `tableOfContents`'s *content*, once Task
 *   4.3.5 shipped `TableOfContents`): renders nothing visible, no
 *   placeholder — most articles were never going to be part of a series,
 *   and a short article can legitimately have no h2-h4 headings, so
 *   treating either as an unfinished region to flag would be wrong, not
 *   honest. The two slots get there differently: `seriesBanner`'s whole
 *   `Section` is conditionally omitted below, so an absent series leaves
 *   no trace in the DOM at all; `tableOfContents` still renders its
 *   `Section`/`SidebarContainer` wrapper unconditionally (touching that
 *   would mean modifying `DocumentContainer`'s structure, Task 4.3.2's,
 *   which this task doesn't own) — `TableOfContents` itself just returns
 *   `null` into it when `headings` is empty, leaving an empty `<aside>`
 *   landmark rather than none. Harmless (nothing for a screen reader to
 *   announce inside it) and a smaller compromise than changing layout
 *   structure a different task owns. `seriesBanner`'s version of this was
 *   a bug caught by actually publishing an article and looking at it, not
 *   by re-reading the code: `how-jwt-works.mdx` has no `series`, and the
 *   page was showing a "Series Banner Region" placeholder box anyway, left
 *   over from before Task 4.3.3's real `SeriesBanner` existed.
 * - `breadcrumb`/`header`/`body`/`tableOfContents` keep their placeholder
 *   fallback as a defensive-only path — every real article resolves a
 *   topic (required by schema) and has body content, and the route always
 *   passes a `TableOfContents` element (never leaves the prop unset), so
 *   none of these should actually hit their fallback; it exists to make it
 *   obvious if that assumption is ever wrong, not because emptiness is
 *   expected.
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
  previousNext?: React.ReactNode;
}

export function DocumentLayout({
  breadcrumb,
  header,
  seriesBanner,
  tableOfContents,
  body,
  relatedLearning,
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

      <Section aria-label="Related Learning" spacing="md" width="full">
        {relatedLearning ?? (
          <PlaceholderRegion label="Related Learning Region" />
        )}
      </Section>

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
