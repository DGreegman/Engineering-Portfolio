/**
 * LogEntryRow
 *
 * One row in the Engineering Log Index's chronological listing
 * (`docs/37-ENGINEERING_LOG_EXPERIENCE.md` §8, `docs/38-
 * ENGINEERING_LOG_IMPLEMENTATION_PLAN.md` WI-4) — date, title, and the
 * entry's own one-line `description`, the one extra line the homepage's
 * own, deliberately barer preview (`components/home/engineering-log.tsx`)
 * doesn't show (that section is competing with six others for attention;
 * this page's entire job is presenting this one collection, so it can
 * afford the one extra line without losing the collection's restraint —
 * docs/37 §8's own reasoning).
 *
 * No running "LOG 00N" identifier the way the homepage preview and
 * `RelatedEngineeringLogs` (Work) both use — that numbering is a
 * small-curated-set flourish (`docs/26`'s own precedent for
 * `FeaturedCaseStudies`' "CASE 00N"), and this page is the complete
 * archive, not a curated preview — the same reasoning `CaseStudyListing`
 * (Work) already applied when it dropped Featured's own running number at
 * archive scale.
 *
 * Whole-row clickability via the same stretched-link pattern every other
 * listing row in this codebase already uses: the title is the one real
 * `<Link>`, `after:absolute after:inset-0` extends its hit area to the
 * full row.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";

export interface LogEntryRowItem {
  slug: string;
  title: string;
  description: string;
  href: string;
  publishedAt: string;
}

export function LogEntryRow({ entry }: { entry: LogEntryRowItem }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-6 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        {entry.publishedAt}
      </p>
      <h3 className="mt-1 text-h4 text-foreground">
        <Link
          href={entry.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {entry.title}
        </Link>
      </h3>
      <Stack gap="xs" className="mt-2">
        <p className="text-small text-muted-foreground">{entry.description}</p>
      </Stack>
    </li>
  );
}
