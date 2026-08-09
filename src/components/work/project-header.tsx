/**
 * ProjectHeader
 *
 * Title, summary, and metadata row for a Case Study — Task 5.3's Work-scoped
 * counterpart to `DocumentHeader` (`components/content/document-header.tsx`).
 * Same structural role (the document's admission decision point — docs/31 §1:
 * "is this the account I'm looking for?"), deliberately different metadata
 * vocabulary, per `docs/31-CASE_STUDY_EXPERIENCE.md` §3/§7's explicit
 * design rule: **the header should answer "what was built," "why was it
 * built," and "how difficult was the engineering challenge" — never "which
 * technologies were used."**
 *
 * `title`/`description` answer the first two questions (title is the one
 * `<h1>` per document — `docs/20`'s rule, extended here — `description` is
 * the one-line engineering-challenge summary, reusing the exact discipline
 * `FeaturedCaseStudies`/`EngineeringCaseStudies` already established: a
 * challenge statement, not a product description). `difficulty` answers the
 * third. `domain`/`status`/`timeline` are supporting orientation — the same
 * facets `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md`'s Browse Lenses already
 * established, reused here rather than a parallel vocabulary.
 *
 * `technologies` renders as its own, visually quieter line beneath the main
 * citation row — never merged into it — so a reader's eye lands on Domain/
 * Status/Timeline/Difficulty first and technology second, structurally
 * enforcing docs/31 §3/§8's "technology belongs in supporting metadata, not
 * the primary identity of the case study" rather than leaving that to
 * writer discipline alone. Omitted entirely when empty, the same
 * "never a fabricated placeholder for a field that isn't there" rule
 * `DocumentHeader` already applies to its own optional fields.
 *
 * A Server Component: static content, no interactivity.
 */
import { Stack } from "@/components/layout/stack";
import type { Difficulty } from "@/types/content";

export interface ProjectHeaderProps {
  title: string;
  description: string;
  domain: string;
  status: "Completed" | "In Progress";
  timeline?: string;
  difficulty?: Difficulty;
  technologies: string[];
}

export function ProjectHeader({
  title,
  description,
  domain,
  status,
  timeline,
  difficulty,
  technologies,
}: ProjectHeaderProps) {
  const entries: { key: string; content: React.ReactNode }[] = [
    { key: "domain", content: domain },
    { key: "status", content: status },
  ];
  if (timeline) {
    entries.push({ key: "timeline", content: timeline });
  }
  if (difficulty) {
    entries.push({ key: "difficulty", content: difficulty });
  }

  return (
    <Stack gap="lg" className="max-w-reading">
      <h1 className="text-h1 text-foreground">{title}</h1>

      <p className="text-body text-muted-foreground">{description}</p>

      <Stack gap="xs">
        <p className="text-caption text-muted-foreground capitalize">
          {entries.map((entry, index) => (
            <span key={entry.key}>
              {index > 0 && " · "}
              {entry.content}
            </span>
          ))}
        </p>

        {technologies.length > 0 && (
          <p className="text-caption text-muted-foreground/70">
            {technologies.join(" · ")}
          </p>
        )}
      </Stack>
    </Stack>
  );
}
