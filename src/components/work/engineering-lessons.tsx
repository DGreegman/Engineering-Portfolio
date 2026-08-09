/**
 * EngineeringLessons
 *
 * "What reusable engineering knowledge emerged from this work?" (docs/29-
 * WORK_LANDING_PROPOSAL.md §1/§3/§6 — the approved reframing away from "what
 * was learned"). This section closes the loop back to `EngineeringPhilosophy`
 * at the top of the page: philosophy stated a position, the sections in
 * between supplied evidence, this synthesizes what that evidence actually
 * taught (docs/29 §1).
 *
 * Also the concrete "bridge" docs/29 §6 asks for: every lesson's
 * `relatedKnowledge` is a real link into the Knowledge Library rather than
 * an inline re-explanation of the concept — this section states what was
 * learned in practice, the link is where the concept is taught in full
 * (docs/24-ENGINEERING_PRINCIPLES.md Principle 3, single source of truth,
 * applied here so a concept is explained in exactly one place). `sourceProject`
 * grounds each lesson in the specific case study it was distilled from —
 * "not every lesson becomes an article, but every article may originate
 * from one of these lessons" only holds if the lesson is shown as
 * evidence-backed, not asserted from nowhere.
 *
 * No stretched-link row here, unlike this page's other list sections — a
 * lesson has no page of its own to navigate to; `relatedKnowledge` is the
 * one real link per row, so there's nothing to extend a hit area around.
 *
 * Future architectural note (Task 5.1 review refinement #3, documentation
 * only — no implementation change now): `PLACEHOLDER_ENGINEERING_LESSONS` is
 * static, hand-authored data today, which is appropriate for placeholder
 * content but is presently an isolated content block rather than a resolved
 * relationship. The intended long-term shape is another layer of the same
 * engineering knowledge graph docs/26-CASE_STUDY_TEMPLATE.md already
 * describes ("Related Knowledge" / "Related Engineering Logs" per case
 * study):
 *
 *   Engineering Lessons → Knowledge Articles → Case Studies
 *
 * i.e. a lesson stops being typed by hand and becomes a resolved edge
 * between a Knowledge article and the case study(s) it was distilled from —
 * `sourceProject`/`relatedKnowledge` are exactly the two ends that edge
 * needs, which is why they're already modeled as separate fields here
 * rather than a single opaque string. `lessons` stays this component's prop
 * either way — only what resolves its value upstream changes.
 *
 * Fully data-agnostic: `lessons` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ENGINEERING_LESSONS_COPY } from "@/lib/constants/work-copy";
import type { EngineeringLessonEntry } from "@/lib/constants/placeholder-work-landing";

function LessonRow({ entry }: { entry: EngineeringLessonEntry }) {
  return (
    <li className="py-6">
      <p className="font-mono text-caption text-muted-foreground/60">
        {entry.sourceProject}
      </p>
      <p className="mt-1 text-body leading-relaxed text-foreground">
        {entry.lesson}
      </p>
      <p className="mt-2 text-caption text-muted-foreground">
        <Link
          href={entry.relatedKnowledge.href}
          className="text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          Related: {entry.relatedKnowledge.label} →
        </Link>
      </p>
    </li>
  );
}

export function EngineeringLessons({
  lessons,
}: {
  lessons: EngineeringLessonEntry[];
}) {
  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="engineering-lessons"
      aria-labelledby="engineering-lessons-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="engineering-lessons-heading"
            className="text-h2 text-foreground"
          >
            {ENGINEERING_LESSONS_COPY.title}
          </h2>
          {ENGINEERING_LESSONS_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {lessons.length === 0 ? (
          <Stack gap="xs">
            {ENGINEERING_LESSONS_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="max-w-reading divide-y divide-border/50">
            {lessons.map((entry) => (
              <LessonRow key={entry.lesson} entry={entry} />
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
