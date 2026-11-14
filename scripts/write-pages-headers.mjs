import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const headersPath = new URL("../out/_headers", import.meta.url);
const productionOrigin = "https://gracious.diftrak.com";

function canEnableIndexing(environment) {
  if (
    environment.SITE_DEPLOYMENT_ENV !== "production" ||
    environment.SITE_INDEXING_ENABLED !== "true" ||
    environment.SITE_URL !== productionOrigin ||
    environment.SITE_PRODUCTION_BRANCH !== "main"
  ) {
    return false;
  }

  if (environment.CF_PAGES === "1") {
    return (
      Boolean(environment.SITE_PRODUCTION_BRANCH) &&
      environment.CF_PAGES_BRANCH === environment.SITE_PRODUCTION_BRANCH
    );
  }

  if (environment.VERCEL_ENV) {
    return (
      environment.VERCEL_ENV === "production" &&
      environment.VERCEL_PROJECT_PRODUCTION_URL?.toLowerCase() ===
        "gracious.diftrak.com"
    );
  }

  return true;
}

export function createPagesHeaders(environment = process.env) {
  const headers = [
    "/*",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  X-Frame-Options: DENY",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
  ];

  if (!canEnableIndexing(environment)) {
    headers.push("  X-Robots-Tag: noindex, nofollow");
  }

  return `${headers.join("\n")}\n`;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await writeFile(headersPath, createPagesHeaders(), "utf8");
}
