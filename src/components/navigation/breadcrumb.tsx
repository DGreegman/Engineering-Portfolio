/**
 * Breadcrumb
 *
 * Displays a document's location within the Knowledge Library — Task
 * 4.3.3's Breadcrumb region (`docs/09-Component Specification.md`
 * categorizes Breadcrumb as a Navigation component, hence living here
 * rather than in `components/content/` alongside `DocumentHeader`).
 *
 * "Communicate hierarchy rather than function primarily as navigation"
 * (Task 4.3.3's own framing) shaped one decision, not the whole design:
 * ancestor segments are still real `<Link>`s — a standard, expected
 * breadcrumb affordance nothing in the task forbids, and docs/08-UX
 * Guidelines.md's own "Navigation Should Be Predictable" already expects
 * it — but the *typography* stays quiet (`text-small`, muted foreground,
 * no button-like chrome), so the row reads first as "here's where this
 * document sits" and only secondarily as "here's where you could go."
 * `aria-current="page"` marks the current document as plain text, the
 * standard accessible breadcrumb pattern — never a link to itself.
 *
 * Generic, not knowledge-specific: `items`/`current` are plain
 * label/href pairs, so this is reusable by any future page needing a
 * breadcrumb (Work case studies, Engineering Log entries), not just
 * Engineering Articles — matching its Navigation-category, not
 * Knowledge-domain, placement.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb({
  items,
  current,
}: {
  items: BreadcrumbItem[];
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-muted-foreground">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-x-2">
            <Link
              href={item.href}
              className="rounded-sm hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {item.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
