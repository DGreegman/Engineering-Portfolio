import { CURRENT_FOCUS_COPY } from "@/lib/constants/homepage-copy";

/** A compact companion panel for the homepage's engineering principles. */
export function CurrentFocus() {
  return (
    <aside
      aria-labelledby="current-focus-heading"
      className="rounded-xl border border-border bg-surface-elevated/70 p-6 sm:p-8"
    >
      <p className="font-mono text-caption font-medium uppercase tracking-[0.12em] text-brand-accent">
        Engineering now
      </p>
      <h3 id="current-focus-heading" className="mt-3 text-h3 text-foreground">
        {CURRENT_FOCUS_COPY.title}
      </h3>
      <div className="mt-3 space-y-2">
        {CURRENT_FOCUS_COPY.introduction.map((paragraph) => (
          <p key={paragraph} className="text-small text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
      <ul className="mt-6 divide-y divide-border/80">
        {CURRENT_FOCUS_COPY.focusAreas.map((area, index) => (
          <li
            key={area.title}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-4 first:pt-0 last:pb-0"
          >
            <span className="pt-0.5 font-mono text-caption text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-body font-semibold text-foreground">
                {area.title}
              </h4>
              <p className="mt-1 text-small text-muted-foreground">
                {area.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
