/**
 * JsonLd
 *
 * Task 8.4 (docs/86, docs/87 §21.1) — the one shared rendering primitive
 * this task introduces. Deliberately minimal: it receives an
 * already-assembled `{ "@context": ..., "@graph": [...] }` object and
 * renders it as a `<script type="application/ld+json">`. It does not load
 * content, resolve slugs, inspect routes, decide which `@type` applies, or
 * make any metadata decision — every one of those responsibilities stays
 * in the calling route's own file (docs/87 §5's own explicit boundary).
 *
 * `JSON.stringify(data).replace(/</g, "\\u003c")` — the one safety
 * transform this component owns: `JSON.stringify`'s own output can
 * legally contain a literal `</script>` sequence if any string property
 * ever did (none of this repository's real content does today, but the
 * escaping is a property of *safely serializing arbitrary JSON inside an
 * HTML `<script>` tag* in general, not of any one page's own content), and
 * an unescaped one would prematurely close the tag in an HTML parser.
 * Escaping `<` to its Unicode escape is the standard, minimal fix — it
 * does not alter the JSON's own meaning (`<` decodes back to `<`
 * inside the parsed object) and adds no dependency.
 *
 * A Server Component: no props beyond the data itself, no interactivity,
 * no `"use client"`.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
