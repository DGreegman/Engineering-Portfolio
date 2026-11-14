import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { bundledLanguagesInfo, codeToHtml } from "shiki";
import { format } from "prettier";

const contentRoot = path.resolve("content");
const generatedRoot = path.resolve(".generated-mdx");
const publicRoot = path.resolve("public");
const collections = ["engineering-log", "knowledge", "work"];
const imports = [];
const entries = [];
const searchIndex = [];
let index = 0;

const themes = {
  light: "github-light-high-contrast",
  dark: "github-dark-high-contrast",
};

function resolveLanguageLabel(language) {
  if (!language) return undefined;
  const info = bundledLanguagesInfo.find(
    (entry) => entry.id === language || entry.aliases?.includes(language),
  );
  return info?.name ?? language.charAt(0).toUpperCase() + language.slice(1);
}

async function highlightCode(code, language) {
  const options = {
    themes,
    defaultColor: false,
    structure: "inline",
  };

  try {
    return await codeToHtml(code, {
      ...options,
      lang: language ?? "plaintext",
    });
  } catch {
    return await codeToHtml(code, { ...options, lang: "plaintext" });
  }
}

async function precompileCodeFences(source) {
  const lines = source.split("\n");
  const output = [];

  for (let index = 0; index < lines.length; index += 1) {
    const opening = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(lines[index]);
    if (!opening) {
      output.push(lines[index]);
      continue;
    }

    const [, , marker, info] = opening;
    const markerCharacter = marker[0];
    const closingPattern = new RegExp(
      `^ {0,3}${markerCharacter}{${marker.length},}\\s*$`,
    );
    let closingIndex = index + 1;
    while (
      closingIndex < lines.length &&
      !closingPattern.test(lines[closingIndex])
    ) {
      closingIndex += 1;
    }

    if (closingIndex >= lines.length) {
      output.push(...lines.slice(index));
      break;
    }

    const codeLines = lines.slice(index + 1, closingIndex);
    const code = codeLines.length > 0 ? `${codeLines.join("\n")}\n` : "";
    const language = info.trim().split(/\s+/, 1)[0] || undefined;
    const highlightedHtml = await highlightCode(code, language);
    const languageLabel = resolveLanguageLabel(language);

    output.push(
      `<PreHighlightedCode code={${JSON.stringify(code)}} language={${JSON.stringify(language)}} languageLabel={${JSON.stringify(languageLabel)}} highlightedHtml={${JSON.stringify(highlightedHtml)}} />`,
    );
    index = closingIndex;
  }

  return output.join("\n");
}

for (const collection of collections) {
  const collectionDirectory = path.join(contentRoot, collection);
  const generatedDirectory = path.join(generatedRoot, collection);
  await mkdir(generatedDirectory, { recursive: true });

  const filenames = (await readdir(collectionDirectory))
    .filter((filename) => filename.endsWith(".mdx"))
    .sort();

  for (const filename of filenames) {
    const slug = filename.slice(0, -".mdx".length);
    const source = await readFile(
      path.join(collectionDirectory, filename),
      "utf8",
    );
    const { data: frontmatter, content } = matter(source);
    const precompiledContent = await precompileCodeFences(content);
    const generatedFilename = `${slug}.mdx`;
    await writeFile(
      path.join(generatedDirectory, generatedFilename),
      precompiledContent,
    );

    if (frontmatter.draft !== true) {
      const publishedAt = new Date(frontmatter.publishedAt);
      if (Number.isNaN(publishedAt.getTime())) {
        throw new Error(
          `Invalid publishedAt in content/${collection}/${filename}`,
        );
      }

      searchIndex.push({
        collection,
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        difficulty: frontmatter.difficulty,
        publishedAt: publishedAt.toISOString(),
        readingTime: readingTime(content).text,
      });
    }

    const componentName = `Mdx${index}`;
    const modulePath = `./${collection}/${generatedFilename}`;
    imports.push(`import ${componentName} from ${JSON.stringify(modulePath)};`);
    entries.push(
      `  ${JSON.stringify(`${collection}/${slug}`)}: ${componentName},`,
    );
    index += 1;
  }
}

if (index === 0) {
  throw new Error("No MDX article modules were generated from content/");
}

const registry = [
  'import type { MDXComponents } from "mdx/types";',
  'import type { ComponentType } from "react";',
  ...imports,
  "",
  "type CompiledMdx = ComponentType<{ components?: MDXComponents }>;",
  "",
  "const registry: Record<string, CompiledMdx> = {",
  ...entries,
  "};",
  "",
  "export function getCompiledMdx(collection: string, slug: string) {",
  "  return registry[`${collection}/${slug}`];",
  "}",
  "",
].join("\n");

await writeFile(path.join(generatedRoot, "registry.tsx"), registry);
await writeFile(
  path.join(generatedRoot, "search-index.ts"),
  `export const searchIndex = ${JSON.stringify(searchIndex, null, 2)} as const;\n`,
);
await mkdir(publicRoot, { recursive: true });
await writeFile(
  path.join(publicRoot, "search-index.json"),
  await format(JSON.stringify(searchIndex), { parser: "json" }),
);
console.log(
  `Prepared ${index} build-time MDX modules in ${path.relative(process.cwd(), generatedRoot)}.`,
);
