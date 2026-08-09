/**
 * EngineeringPhilosophy
 *
 * "How does this engineer approach problems, before I see any evidence?"
 * (docs/29-WORK_LANDING_PROPOSAL.md §1). This section is the page's thesis
 * statement — everything beneath it on the page exists to substantiate what
 * gets claimed here, per docs/29 §1's "Why This Order and No Other."
 *
 * Deliberately not a restatement of the homepage's `HowIThink` — that
 * section explains five general engineering principles; this one is scoped
 * to how problems get approached under real constraints and reads as a
 * claim the rest of `/work` has to prove, not a philosophy essay on its
 * own (docs/25-WORK_EXPERIENCE.md: "This is not a biography. It is an
 * explanation of engineering mindset.").
 *
 * Also deliberately not `HowIThink`'s bordered rail or `CurrentFocus`'s
 * `Card` grid — docs/25/docs/27 both ask the Work section to establish its
 * own identity while remaining consistent with the rest of the workspace.
 * `commitments` render as a plain, borderless grid with a single top rule
 * per cell — closer to a short reference list than a card or a chaptered
 * essay, appropriate for a set of four short, parallel statements rather
 * than a progression (`HowIThink`) or a set of independent explorations
 * (`CurrentFocus`).
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ENGINEERING_PHILOSOPHY_COPY } from "@/lib/constants/work-copy";

export function EngineeringPhilosophy() {
  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="engineering-philosophy"
      aria-labelledby="engineering-philosophy-heading"
      spacing="lg"
      width="full"
    >
      <Stack gap="xl">
        <Stack gap="sm" className="max-w-prose">
          <h2
            id="engineering-philosophy-heading"
            className="text-h2 text-foreground"
          >
            {ENGINEERING_PHILOSOPHY_COPY.title}
          </h2>
          {ENGINEERING_PHILOSOPHY_COPY.introduction.map((paragraph) => (
            <p
              key={paragraph}
              className="text-body leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </Stack>

        <Stack gap="sm">
          <p className="font-mono text-caption text-muted-foreground">
            {ENGINEERING_PHILOSOPHY_COPY.commitmentsLabel}
          </p>
          <ul className="grid gap-6 sm:grid-cols-2">
            {ENGINEERING_PHILOSOPHY_COPY.commitments.map((commitment) => (
              <li
                key={commitment.title}
                className="border-t border-border/40 pt-4"
              >
                <h3 className="text-h4 text-foreground">{commitment.title}</h3>
                <p className="mt-2 text-small text-muted-foreground">
                  {commitment.description}
                </p>
              </li>
            ))}
          </ul>
        </Stack>
      </Stack>
    </Section>
  );
}
