/**
 * SeriesBanner
 *
 * Structural rendering for an article's series membership — Task 4.3.3's
 * Series Banner region. "Structural," per this task's own scope, not
 * "fully resolved": an article's frontmatter only carries `series` (a
 * name/slug string) and `seriesOrder` (its position) — there's no series
 * loader yet to resolve the *total* part count or the series' own
 * title/description from that string (Task 4.3.1 built article
 * resolution, not series resolution; `resolveSeries()` in
 * `relationships.ts` is still an intentional placeholder that echoes the
 * slug back as the title). Showing "Part 2 of 4" would mean fabricating
 * the "4" — this renders only what's actually known: the series name and,
 * when present, this article's position within it.
 *
 * Not a link: with no series page built yet (`/series/[slug]` isn't a
 * route in this codebase), a link here would be another "doesn't resolve
 * yet" placeholder for a feature this task doesn't own — Related Learning
 * (Task 4.3.8) or whatever eventually builds series pages is a more
 * appropriate place to decide that.
 *
 * Conditional per this task's own instruction — "only display the banner
 * when series metadata exists." `DocumentLayout`'s `seriesBanner` slot
 * only receives this component when the route actually has series data to
 * pass it; this component itself doesn't re-check for that, since the
 * caller already knows before rendering it.
 *
 * A Server Component: static content, no interactivity.
 */
export function SeriesBanner({
  series,
  seriesOrder,
}: {
  series: string;
  seriesOrder?: number;
}) {
  return (
    <p className="rounded-md border border-border bg-muted/30 px-4 py-3 text-small text-muted-foreground">
      {typeof seriesOrder === "number" ? (
        <>
          Part {seriesOrder} of the{" "}
          <span className="text-foreground">{series}</span> series
        </>
      ) : (
        <>
          Part of the <span className="text-foreground">{series}</span> series
        </>
      )}
    </p>
  );
}
