/**
 * TopicHero
 *
 * The opening section of `/knowledge/[slug]` — introduces the domain
 * itself, not a specific article (Task 4.2 §2). Distinct from
 * `KnowledgeHero` (the library-wide intro): this one is built from a
 * `Topic`'s own metadata (title, introduction, counts) rather than a fixed
 * narrative paragraph, so a new component earns its place instead of
 * awkwardly overloading `KnowledgeHero` with two unrelated content shapes.
 *
 * `description` renders `Topic.heroIntroduction` (design refinement #1) —
 * two real paragraphs explaining *why the domain matters*, matching the
 * library-wide hero's own two-paragraph depth — rather than
 * `Topic.description`, the tile-sized one-liner `BrowseByTopic`/
 * `RelatedTopics` show. A topic without `heroIntroduction` yet falls back
 * to wrapping `description` as a single paragraph, so this never renders
 * nothing.
 *
 * Article/series counts render as two separate stat blocks (design
 * refinement #2), not one string joined by " · " — each is its own
 * number-over-label pair, more scannable than a sentence. Still just
 * typography (no borders, backgrounds, or icons) — "Typography is the
 * primary design element... not excessive color or decoration"
 * (docs/07-DESIGN_SYSTEM.md).
 *
 * `articleCount`/`seriesCount` are plain numbers, not sourced from `Topic`
 * directly inside this component — `app/knowledge/[slug]/page.tsx` decides
 * where each comes from (`Topic.articleCount` is a static aspirational
 * placeholder, only passed through when the topic has real placeholder
 * content to back it up; `seriesCount` is computed from the actual
 * filtered series list, so it can never drift from what `LearningSeries`
 * renders below). Both are optional: a topic with neither simply doesn't
 * render that stat, the same conditional-rendering pattern `TopicTile`
 * already established rather than showing a fabricated "0".
 *
 * `spacing="lg"` (not the library-wide `KnowledgeHero`'s "md") — design
 * refinement #3: more bottom space here, stacking with `StartHere`'s own
 * "lg" top space, for a calmer beat into Start Here than a plain md/md
 * pairing would give.
 *
 * `text-h1` (matching `KnowledgeHero`'s own scale) — the largest heading on
 * this page, one step down from the site's actual homepage hero.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-h4 text-foreground">{value}</p>
      <p className="text-caption text-muted-foreground">{label}</p>
    </div>
  );
}

export function TopicHero({
  title,
  description,
  heroIntroduction,
  articleCount,
  seriesCount,
}: {
  title: string;
  description: string;
  heroIntroduction?: readonly string[];
  articleCount?: number;
  seriesCount?: number;
}) {
  const paragraphs = heroIntroduction ?? [description];
  const hasStats =
    typeof articleCount === "number" || typeof seriesCount === "number";

  return (
    <Section spacing="lg" width="full">
      <Stack gap="lg" className="max-w-reading">
        <h1 className="text-h1 text-foreground">{title}</h1>

        <Stack gap="sm">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {hasStats && (
          <div className="flex gap-8">
            {typeof articleCount === "number" && (
              <Stat
                value={articleCount}
                label={articleCount === 1 ? "Article" : "Articles"}
              />
            )}
            {typeof seriesCount === "number" && (
              // "Learning Series" doesn't pluralize (unlike "Article(s)"
              // above) — "series" is already both singular and plural.
              <Stat value={seriesCount} label="Learning Series" />
            )}
          </div>
        )}
      </Stack>
    </Section>
  );
}
