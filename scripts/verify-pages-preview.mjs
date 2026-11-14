const previewOrigin =
  "https://portfolio-preview.engineering-desk-preview.pages.dev";
const requestOrigin = new URL(
  process.env.PREVIEW_VERIFY_BASE_URL ?? previewOrigin,
).origin;

const htmlPages = [
  "/",
  "/work",
  "/knowledge",
  "/engineering-log",
  "/work/vaultpay",
  "/knowledge/backend",
  "/engineering-log/cookeaze-webhook-reliability-gap",
  "/search",
];

const assets = [
  "/search-index.json",
  "/rss.xml",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icon.svg",
  "/images/projects/vaultpay.png",
  "/images/projects/gohunt.png",
  "/images/projects/haya.png",
];

const failures = [];
const responses = new Map();

async function fetchRequired(path) {
  const response = await fetch(new URL(path, requestOrigin), {
    signal: AbortSignal.timeout(20_000),
  });

  if (response.status !== 200) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  if (new URL(response.url).origin !== requestOrigin) {
    throw new Error(`${path} redirected outside the preview origin`);
  }

  const robotsHeader = response.headers.get("x-robots-tag")?.toLowerCase();
  if (
    !robotsHeader?.includes("noindex") ||
    !robotsHeader.includes("nofollow")
  ) {
    throw new Error(`${path} is missing X-Robots-Tag: noindex, nofollow`);
  }

  responses.set(path, response);
  console.log(`PASS ${path} HTTP 200; noindex header present`);
  return response;
}

for (const path of [...htmlPages, ...assets]) {
  try {
    await fetchRequired(path);
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
  }
}

for (const path of htmlPages) {
  const response = responses.get(path);
  if (!response) continue;

  const html = await response.text();
  const robotsMeta = [...html.matchAll(/<meta\b[^>]*>/gi)].find(([tag]) =>
    /\bname=["']robots["']/i.test(tag),
  )?.[0];

  if (!robotsMeta || !/\bnoindex\b/i.test(robotsMeta)) {
    failures.push(`${path}: HTML robots metadata is missing noindex`);
  }

  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find(([tag]) =>
    /\brel\s*=\s*(?:"canonical"|'canonical')/i.test(tag),
  )?.[0];
  const canonicalMatch = canonicalTag?.match(
    /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/i,
  );
  const canonical =
    canonicalMatch?.[1] ?? canonicalMatch?.[2] ?? canonicalMatch?.[3];

  let canonicalIsPreview = false;
  if (canonical) {
    try {
      canonicalIsPreview = new URL(canonical).origin === previewOrigin;
    } catch {
      canonicalIsPreview = false;
    }
  }

  if (!canonicalIsPreview) {
    failures.push(
      `${path}: canonical URL is missing or outside the preview origin`,
    );
  }
}

const robotsResponse = responses.get("/robots.txt");
if (robotsResponse) {
  const robots = await robotsResponse.text();
  if (/^\s*sitemap\s*:/im.test(robots)) {
    failures.push("/robots.txt advertises a sitemap");
  }
}

const sitemapResponse = responses.get("/sitemap.xml");
if (sitemapResponse) {
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map(
    ([, loc]) => loc.replaceAll("&amp;", "&"),
  );

  if (locations.length === 0) failures.push("/sitemap.xml has no locations");
  if (sitemap.includes("gracious.diftrak.com")) {
    failures.push("/sitemap.xml contains a production URL");
  }
  for (const location of locations) {
    if (new URL(location).origin !== previewOrigin) {
      failures.push(`/sitemap.xml contains a non-preview URL: ${location}`);
    }
  }
}

const rssResponse = responses.get("/rss.xml");
if (rssResponse) {
  const rss = await rssResponse.text();
  if (!rss.includes(previewOrigin))
    failures.push("/rss.xml does not use the preview origin");
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

if (failures.length > 0) {
  console.error("Preview verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${htmlPages.length} HTML routes, ${assets.length} resources, preview canonicals, and noindex safeguards.`,
  );
}
