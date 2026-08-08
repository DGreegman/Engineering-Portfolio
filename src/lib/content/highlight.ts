/**
 * Syntax Highlighting (Task 4.3.6 — Code Experience)
 *
 * A thin wrapper around Shiki — the task's explicit requirement — kept in
 * `lib/content/` alongside the rest of the content engine (`toc.ts`,
 * `mdx.tsx`) rather than inside a component: highlighting is a content
 * transform (raw code text in, themed HTML out), not presentation, and
 * `code-block.tsx` composes this the same way `article-body.tsx` composes
 * `MDXContent` — a component consuming a content-engine primitive, not
 * reimplementing one.
 *
 * `structure: "inline"` (not Shiki's default `"classic"`) returns bare,
 * per-token `<span>`s with no wrapping `<pre>`/`<code>` — `CodeBlock` owns
 * that wrapper itself (its own `font-mono`/`text-small`/overflow classes),
 * so Shiki is asked for only the one thing it's needed for: colored
 * tokens, not a second competing set of container markup.
 *
 * `themes: { light, dark }` with `defaultColor: false` (rather than a
 * single theme, or two separate highlight calls) makes every token carry
 * both a `--shiki-light` and a `--shiki-dark` CSS custom property in one
 * pass — `styles/typography.css`'s `.dark` selector then picks one, the
 * same "compute once, one small CSS rule follows `.dark`" idiom already
 * used for every other themed color token in this codebase.
 *
 * `github-light-high-contrast` / `github-dark-high-contrast` (Task 4.3.10
 * accessibility fix — originally `github-light`/`github-dark`): still the
 * same GitHub visual family this task's own Code Experience docstring
 * intentionally chose ("restrained enough to sit inside this codebase's
 * mostly-grayscale design system without looking like a foreign embedded
 * editor"), but GitHub's own accessibility-audited variant rather than its
 * default one. The default pairing measured below WCAG AA's 4.5:1 against
 * this codebase's actual `bg-muted/50` code-block background — not GitHub's
 * own near-white/near-black editor background the default theme was tuned
 * for — on real tokens from real fixture code: `#D73A49` (a keyword red)
 * at 4.38:1 and `#E36209` (a constant orange) at 3.34:1 in light mode,
 * `#6A737D` (comments, identical hex in both themes) at 3.69:1 in dark
 * mode, all confirmed by axe-core's `color-contrast` check, not a
 * stylistic guess. The high-contrast variant's equivalent tokens measured
 * 4.83:1–10.3:1 against the same composited background — every category
 * checked clears AA with real margin, in both themes.
 */
import { codeToHtml, bundledLanguagesInfo } from "shiki";

const THEMES = {
  light: "github-light-high-contrast",
  dark: "github-dark-high-contrast",
} as const;
const FALLBACK_LANG = "plaintext";

/**
 * Highlights `code` as `lang`, degrading to unhighlighted plain text (never
 * throwing) when `lang` is missing or isn't a language Shiki's bundle
 * recognizes — a typo'd fence tag (` ```typescrpt `) should still render
 * the reader's code, just without color, not fail the whole article.
 */
export async function highlightCode(
  code: string,
  lang: string | undefined,
): Promise<string> {
  const options = {
    themes: THEMES,
    defaultColor: false as const,
    structure: "inline" as const,
  };
  try {
    return await codeToHtml(code, { ...options, lang: lang ?? FALLBACK_LANG });
  } catch {
    return await codeToHtml(code, { ...options, lang: FALLBACK_LANG });
  }
}

/**
 * Resolves a fence's raw language identifier (`"ts"`, `"py"`, `"sh"`) to
 * Shiki's own canonical display name (`"TypeScript"`, `"Python"`,
 * `"Shell"`) — reusing Shiki's already-bundled language metadata rather
 * than a second, hand-maintained id-to-label table this codebase would
 * have to keep in sync itself.
 *
 * Returns `undefined` only when `lang` itself is `undefined` — "Display
 * language labels only when explicitly provided" (this task's own
 * requirement). An identifier Shiki doesn't recognize is still shown,
 * capitalized as-is: it *was* explicitly provided by the author, just not
 * one this function can prettify — showing it honestly beats hiding it.
 */
export function resolveLanguageLabel(
  lang: string | undefined,
): string | undefined {
  if (!lang) return undefined;
  const info = bundledLanguagesInfo.find(
    (entry) => entry.id === lang || entry.aliases?.includes(lang),
  );
  if (info) return info.name;
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}
