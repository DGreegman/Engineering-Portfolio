import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const productionOrigin = "https://gracious.diftrak.com";
export const productionHtmlRoutes = [
  "/",
  "/about",
  "/knowledge",
  "/work",
  "/work/library",
  "/engineering-log",
  "/search",
  "/knowledge/backend",
  "/work/vaultpay",
  "/engineering-log/cookeaze-webhook-reliability-gap",
];

export const productionAssets = [
  "/search-index.json",
  "/rss.xml",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icon.svg",
  "/og/engineering-desk.png",
  "/images/portrait.jpeg",
  "/images/projects/vaultpay.png",
  "/images/projects/gohunt.png",
  "/images/projects/haya.png",
];

export const requiredResponseHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "deny",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "x-robots-tag": "noindex, nofollow",
};

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(
      `\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`,
      "i",
    ),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function findCanonical(html) {
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag);
  const canonicalTag = linkTags.find((tag) =>
    getAttribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("canonical"),
  );
  return canonicalTag ? getAttribute(canonicalTag, "href") : undefined;
}

function findRobotsContent(html) {
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => tag);
  const robotsTag = metaTags.find(
    (tag) => getAttribute(tag, "name")?.toLowerCase() === "robots",
  );
  return robotsTag ? getAttribute(robotsTag, "content") : undefined;
}

function expectedExportPath(outputDirectory, route) {
  return route === "/"
    ? path.join(outputDirectory, "index.html")
    : path.join(outputDirectory, `${route.slice(1)}.html`);
}

function collectHtmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = path.join(directory, entry);
    return statSync(entryPath).isDirectory()
      ? collectHtmlFiles(entryPath)
      : entry.endsWith(".html")
        ? [entryPath]
        : [];
  });
}

export function getExportedHtmlRoutes(outputDirectory = "out") {
  return collectHtmlFiles(outputDirectory)
    .map((filePath) => {
      const relativePath = path
        .relative(outputDirectory, filePath)
        .split(path.sep)
        .join("/");
      if (relativePath === "404.html" || relativePath === "_not-found.html") {
        return undefined;
      }
      const routePath = relativePath.replace(/\.html$/, "");
      return routePath === "index" ? "/" : `/${routePath}`;
    })
    .filter(Boolean)
    .sort();
}

const assetRelTokens = new Set([
  "apple-touch-icon",
  "icon",
  "manifest",
  "mask-icon",
  "modulepreload",
  "preload",
  "stylesheet",
]);

function localAssetPath(reference, pageRoute, origin = productionOrigin) {
  const value = reference.trim();
  if (!value || value.startsWith("#")) return undefined;
  try {
    const resolved = new URL(value, new URL(pageRoute, origin));
    if (
      resolved.origin !== origin ||
      !["http:", "https:"].includes(resolved.protocol)
    ) {
      return undefined;
    }
    const decodedPath = decodeURIComponent(resolved.pathname);
    if (decodedPath === "/" || decodedPath.endsWith(".html")) return undefined;
    return decodedPath;
  } catch {
    return undefined;
  }
}

function referencesInHtml(html, pageRoute, origin) {
  const references = [];
  for (const [tag] of html.matchAll(/<[a-z][^>]*>/gi)) {
    const tagName = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    const rel = getAttribute(tag, "rel")?.toLowerCase().split(/\s+/) ?? [];
    const shouldReadHref =
      tagName === "link" && rel.some((token) => assetRelTokens.has(token));
    for (const attribute of ["src", "poster", "data", "data-src"]) {
      const value = getAttribute(tag, attribute);
      if (value) references.push(value);
    }
    if (shouldReadHref) {
      const value = getAttribute(tag, "href");
      if (value) references.push(value);
    }
    const srcset = getAttribute(tag, "srcset");
    if (srcset) {
      const withoutDataUrls = srcset.replace(/data:[^,\s]+,[^,\s]+/gi, "");
      for (const candidate of withoutDataUrls.split(",")) {
        const value = candidate.trim().split(/\s+/)[0];
        if (value) references.push(value);
      }
    }
  }
  return references
    .map((reference) => localAssetPath(reference, pageRoute, origin))
    .filter(Boolean);
}

function referencesInCss(css, cssPath, origin) {
  const references = [];
  for (const [, reference] of css.matchAll(
    /url\(\s*["']?([^"')]+)["']?\s*\)/gi,
  )) {
    references.push(reference);
  }
  for (const [, reference] of css.matchAll(/@import\s+["']([^"']+)["']/gi)) {
    references.push(reference);
  }
  return references
    .map((reference) => localAssetPath(reference, cssPath, origin))
    .filter(Boolean);
}

export function discoverLocalAssets(outputDirectory = "out", routes) {
  const htmlRoutes = routes ?? getExportedHtmlRoutes(outputDirectory);
  const discovered = new Set();
  const pendingCss = [];
  for (const route of htmlRoutes) {
    const filePath = expectedExportPath(outputDirectory, route);
    if (!existsSync(filePath)) continue;
    for (const asset of referencesInHtml(
      readFileSync(filePath, "utf8"),
      route,
      productionOrigin,
    )) {
      if (discovered.has(asset)) continue;
      discovered.add(asset);
      if (asset.toLowerCase().endsWith(".css")) pendingCss.push(asset);
    }
  }

  const visitedCss = new Set();
  while (pendingCss.length) {
    const cssPath = pendingCss.pop();
    if (visitedCss.has(cssPath)) continue;
    visitedCss.add(cssPath);
    const filePath = path.join(outputDirectory, cssPath.slice(1));
    if (!existsSync(filePath) || !statSync(filePath).isFile()) continue;
    for (const asset of referencesInCss(
      readFileSync(filePath, "utf8"),
      cssPath,
      productionOrigin,
    )) {
      if (discovered.has(asset)) continue;
      discovered.add(asset);
      if (asset.toLowerCase().endsWith(".css")) pendingCss.push(asset);
    }
  }
  return [...discovered].sort();
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function validateCanonicalAndRobots(route, html, failures) {
  const canonical = findCanonical(html);
  const expectedCanonical = new URL(route, productionOrigin);
  let canonicalMatches = false;

  try {
    const actualCanonical = canonical ? new URL(canonical) : undefined;
    canonicalMatches =
      actualCanonical?.origin === productionOrigin &&
      actualCanonical.pathname === expectedCanonical.pathname &&
      !actualCanonical.search &&
      !actualCanonical.hash;
  } catch {
    canonicalMatches = false;
  }

  if (!canonicalMatches) {
    failures.push(
      `${route}: canonical URL must be ${expectedCanonical.href}; received ${canonical ?? "none"}`,
    );
  }

  const robots = findRobotsContent(html);
  if (!robots || !/\bnoindex\b/i.test(robots)) {
    failures.push(`${route}: HTML robots metadata is missing noindex`);
  }
}

function parseGlobalHeaders(headersText) {
  const headers = new Map();
  let inGlobalRule = false;
  let foundGlobalRule = false;

  for (const line of headersText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (!line.startsWith(" ") && trimmed.startsWith("/")) {
      inGlobalRule = trimmed === "/*";
      foundGlobalRule ||= inGlobalRule;
      continue;
    }

    if (!inGlobalRule) continue;
    const separator = trimmed.indexOf(":");
    if (separator < 0) continue;
    const name = trimmed.slice(0, separator).trim().toLowerCase();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .toLowerCase();
    headers.set(name, value);
  }

  return { foundGlobalRule, headers };
}

function validateHeaderValues(headers, label, failures) {
  for (const [name, expected] of Object.entries(requiredResponseHeaders)) {
    const actual = headers.get(name);
    if (actual !== expected) {
      failures.push(
        `${label}: ${name} must be "${expected}"; received ${actual ?? "missing"}`,
      );
    }
  }
}

function validateRobotsSitemapAndRss(
  { robots, sitemap, rss, exportedRoutes },
  failures,
) {
  if (/^\s*sitemap\s*:/im.test(robots)) {
    failures.push(
      "/robots.txt must not advertise the sitemap while noindex is active",
    );
  }
  if (!/^\s*allow\s*:\s*\/\s*$/im.test(robots)) {
    failures.push(
      "/robots.txt must allow crawling so crawlers can read noindex metadata",
    );
  }

  const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map(
    ([, location]) => decodeXml(location),
  );
  if (sitemapLocations.length === 0) {
    failures.push("/sitemap.xml has no locations");
  }
  const sitemapRoutes = new Set();
  for (const location of sitemapLocations) {
    try {
      const parsed = new URL(location);
      if (parsed.origin !== productionOrigin) {
        failures.push(
          `/sitemap.xml contains a non-production URL: ${location}`,
        );
      } else if (parsed.search || parsed.hash) {
        failures.push(
          `/sitemap.xml contains a URL with query or fragment: ${location}`,
        );
      } else {
        sitemapRoutes.add(parsed.pathname);
      }
    } catch {
      failures.push(`/sitemap.xml contains an invalid URL: ${location}`);
    }
  }
  if (exportedRoutes) {
    const expectedSitemapRoutes = new Set(
      exportedRoutes.filter((route) => route !== "/search"),
    );
    for (const route of expectedSitemapRoutes) {
      if (!sitemapRoutes.has(route)) {
        failures.push(
          `/sitemap.xml is missing exported production route ${route}`,
        );
      }
    }
    for (const route of sitemapRoutes) {
      if (!expectedSitemapRoutes.has(route)) {
        failures.push(
          `/sitemap.xml contains unexpected production route ${route}`,
        );
      }
    }
  }

  const rssLinks = [...rss.matchAll(/<link>(.*?)<\/link>/gi)].map(([, link]) =>
    decodeXml(link),
  );
  if (rssLinks.length === 0)
    failures.push("/rss.xml has no item or channel links");
  for (const link of rssLinks) {
    try {
      if (new URL(link).origin !== productionOrigin) {
        failures.push(`/rss.xml contains a non-production URL: ${link}`);
      }
    } catch {
      failures.push(`/rss.xml contains an invalid URL: ${link}`);
    }
  }
}

function readRequiredFile(outputDirectory, route, failures) {
  const filePath = path.join(outputDirectory, route.slice(1));
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    failures.push(`${route}: required exported file is missing`);
    return "";
  }
  const contents = readFileSync(filePath, "utf8");
  if (!contents.length) failures.push(`${route}: exported file is empty`);
  return contents;
}

export function verifyProductionArtifact(outputDirectory = "out") {
  const failures = [];
  const exportedRoutes = getExportedHtmlRoutes(outputDirectory);
  const headersPath = path.join(outputDirectory, "_headers");
  if (!existsSync(headersPath)) {
    failures.push("out/_headers is missing");
  } else {
    const { foundGlobalRule, headers } = parseGlobalHeaders(
      readFileSync(headersPath, "utf8"),
    );
    if (!foundGlobalRule) failures.push("out/_headers has no global /* rule");
    validateHeaderValues(headers, "out/_headers", failures);
  }

  for (const route of productionHtmlRoutes) {
    if (!exportedRoutes.includes(route)) {
      failures.push(`${route}: required exported HTML route is missing`);
    }
  }

  for (const filePath of collectHtmlFiles(outputDirectory)) {
    const html = readFileSync(filePath, "utf8");
    const relativePath = path
      .relative(outputDirectory, filePath)
      .split(path.sep)
      .join("/");
    const routePath = relativePath.replace(/\.html$/, "");
    const route = routePath === "index" ? "/" : `/${routePath}`;
    const robots = findRobotsContent(html);
    if (!robots || !/\bnoindex\b/i.test(robots)) {
      failures.push(
        `${path.relative(outputDirectory, filePath)}: HTML is missing noindex metadata`,
      );
    }
    if (
      /portfolio-preview\.engineering-desk-preview\.pages\.dev|localhost:3000/i.test(
        html,
      )
    ) {
      failures.push(
        `${path.relative(outputDirectory, filePath)}: HTML contains a preview or localhost URL`,
      );
    }
    if (relativePath !== "404.html" && relativePath !== "_not-found.html") {
      validateCanonicalAndRobots(route, html, failures);
    }
  }

  const requiredAssets = new Set([
    ...productionAssets,
    ...discoverLocalAssets(outputDirectory, exportedRoutes),
  ]);
  for (const asset of requiredAssets) {
    const assetPath = path.join(outputDirectory, asset.slice(1));
    if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
      failures.push(`${asset}: required exported asset is missing`);
    } else if (statSync(assetPath).size === 0) {
      failures.push(`${asset}: exported asset is empty`);
    }
  }

  let searchIndex = [];
  try {
    searchIndex = JSON.parse(
      readRequiredFile(outputDirectory, "/search-index.json", failures),
    );
    if (!Array.isArray(searchIndex) || searchIndex.length === 0) {
      failures.push("/search-index.json must be a non-empty JSON array");
    }
  } catch {
    failures.push("/search-index.json is not valid JSON");
  }

  const robots = readRequiredFile(outputDirectory, "/robots.txt", failures);
  const sitemap = readRequiredFile(outputDirectory, "/sitemap.xml", failures);
  const rss = readRequiredFile(outputDirectory, "/rss.xml", failures);
  validateRobotsSitemapAndRss(
    { robots, sitemap, rss, exportedRoutes },
    failures,
  );

  return failures;
}

export async function verifyProductionDeployment({
  baseUrl = productionOrigin,
  routes = productionHtmlRoutes,
  assets = productionAssets,
  fetchImpl = fetch,
} = {}) {
  const failures = [];
  const requestOrigin = new URL(baseUrl).origin;
  const responses = new Map();

  const uniqueAssets = [...new Set(assets)];
  for (const route of [...new Set(routes), ...uniqueAssets]) {
    try {
      const response = await fetchImpl(new URL(route, requestOrigin), {
        redirect: "manual",
        signal: AbortSignal.timeout(20_000),
      });
      if (response.status !== 200) {
        throw new Error(`returned HTTP ${response.status}`);
      }

      const finalUrl = response.url || new URL(route, requestOrigin).href;
      if (new URL(finalUrl).origin !== requestOrigin) {
        throw new Error("redirected outside the production request origin");
      }

      const responseHeaders = new Map(
        Object.entries(requiredResponseHeaders).map(([name]) => [
          name,
          response.headers.get(name)?.trim().toLowerCase(),
        ]),
      );
      validateHeaderValues(responseHeaders, route, failures);
      responses.set(route, response);
      console.log(
        `PASS ${route} HTTP 200; security and noindex headers present`,
      );
    } catch (error) {
      failures.push(`${route}: ${error.message}`);
    }
  }

  for (const route of routes) {
    const response = responses.get(route);
    if (!response) continue;
    validateCanonicalAndRobots(route, await response.text(), failures);
  }

  const searchIndexResponse = responses.get("/search-index.json");
  if (searchIndexResponse) {
    try {
      const index = await searchIndexResponse.json();
      if (!Array.isArray(index) || index.length === 0) {
        failures.push("/search-index.json is not a non-empty JSON array");
      }
    } catch {
      failures.push("/search-index.json is not valid JSON");
    }
  }

  const responseText = async (route) =>
    responses.has(route) ? responses.get(route).text() : "";
  const [robots, sitemap, rss] = await Promise.all([
    responseText("/robots.txt"),
    responseText("/sitemap.xml"),
    responseText("/rss.xml"),
  ]);
  validateRobotsSitemapAndRss(
    { robots, sitemap, rss, exportedRoutes: routes },
    failures,
  );

  return failures;
}

function reportFailures(failures) {
  if (failures.length === 0) return false;
  console.error("Production verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  return true;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const artifactFailures = verifyProductionArtifact("out");
  if (reportFailures(artifactFailures)) {
    process.exitCode = 1;
  } else if (process.argv.includes("--artifact-only")) {
    console.log(
      "Production static artifact verified; indexing remains disabled.",
    );
  } else {
    const deploymentFailures = await verifyProductionDeployment({
      baseUrl: process.env.PRODUCTION_VERIFY_BASE_URL ?? productionOrigin,
      routes: getExportedHtmlRoutes("out"),
      assets: [...productionAssets, ...discoverLocalAssets("out")],
    });
    if (reportFailures(deploymentFailures)) {
      process.exitCode = 1;
    } else {
      console.log(
        `Verified ${getExportedHtmlRoutes("out").length} production routes, runtime assets, security headers, sitemap, RSS, and noindex safeguards.`,
      );
    }
  }
}
