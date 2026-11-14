/**
 * Site Constants
 *
 * Identity and external-link values referenced from more than one place
 * (Header, Footer, Contact, and SEO metadata) — kept here once so none of
 * them re-type the same string.
 */

/** docs/01-PERSONAL_BRAND.md's documented identity. */
export {
  COMPANY_URL,
  CONTACT_EMAIL,
  FOOTER_CLOSING_MESSAGE,
  GITHUB_URL,
  LINKEDIN_URL,
  RSS_PATH,
  SITE_NAME,
} from "@/lib/constants/site-identity";

export const PRODUCTION_SITE_URL = "https://gracious.diftrak.com";
export const PRODUCTION_SITE_HOST = new URL(PRODUCTION_SITE_URL).host;

function parseSiteOrigin(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `SITE_URL must be a valid absolute URL; received: ${value}`,
    );
  }

  const isLocalhost = url.hostname === "localhost";
  if (
    (url.protocol !== "https:" && !(isLocalhost && url.protocol === "http:")) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin without a path or credentials.",
    );
  }

  return url.origin;
}

function resolveSiteUrl(): string {
  const environment = process.env.VERCEL_ENV;
  const configuredUrl = process.env.SITE_URL;

  if (environment === "preview") {
    const deploymentHost = process.env.VERCEL_URL;
    if (!deploymentHost || !/^[a-z0-9.-]+$/i.test(deploymentHost)) {
      throw new Error(
        "Preview builds require Vercel system environment variables, including VERCEL_URL.",
      );
    }
    return parseSiteOrigin(`https://${deploymentHost}`);
  }

  if (environment === "production") {
    // When no explicit portfolio origin has been configured, use Vercel's
    // configured production hostname instead of emitting localhost. The
    // separate indexing gate below keeps the beta host non-indexable.
    const origin = configuredUrl
      ? parseSiteOrigin(configuredUrl)
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? parseSiteOrigin(
            `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
          )
        : null;
    if (!origin) {
      throw new Error(
        "Production builds require SITE_URL or VERCEL_PROJECT_PRODUCTION_URL.",
      );
    }
    if (origin !== PRODUCTION_SITE_URL) {
      // A beta production deployment may temporarily serve its Vercel
      // production hostname. For that case, preserve that actual origin.
      if (configuredUrl) {
        throw new Error(`Production SITE_URL must be ${PRODUCTION_SITE_URL}.`);
      }
    }
    return origin;
  }

  // Cloudflare Pages supplies the exact deployment URL at build time. Use it
  // for previews so their canonical metadata never points at production. A
  // production build may use the approved custom origin before DNS is
  // attached; until then, CF_PAGES_URL remains a safe fallback.
  if (process.env.CF_PAGES === "1") {
    const productionBranch = process.env.SITE_PRODUCTION_BRANCH;
    const isConfiguredProductionBuild =
      process.env.SITE_DEPLOYMENT_ENV === "production" &&
      Boolean(productionBranch) &&
      process.env.CF_PAGES_BRANCH === productionBranch;

    if (isConfiguredProductionBuild && configuredUrl) {
      const origin = parseSiteOrigin(configuredUrl);
      if (origin !== PRODUCTION_SITE_URL) {
        throw new Error(`Production SITE_URL must be ${PRODUCTION_SITE_URL}.`);
      }
      return origin;
    }

    const pagesUrl = process.env.CF_PAGES_URL;
    if (!pagesUrl) {
      throw new Error("Cloudflare Pages builds require CF_PAGES_URL.");
    }
    return parseSiteOrigin(pagesUrl);
  }

  // Retain the existing Workers preview compatibility for the already
  // approved local POC. Pages builds use the branch above.
  const cloudflareEnvironment = process.env.SITE_DEPLOYMENT_ENV;
  if (cloudflareEnvironment === "preview") {
    return configuredUrl ? parseSiteOrigin(configuredUrl) : PRODUCTION_SITE_URL;
  }

  if (cloudflareEnvironment === "production") {
    if (!configuredUrl) {
      throw new Error(
        "Cloudflare production builds require SITE_URL to be explicitly configured.",
      );
    }
    const origin = parseSiteOrigin(configuredUrl);
    if (origin !== PRODUCTION_SITE_URL) {
      throw new Error(`Production SITE_URL must be ${PRODUCTION_SITE_URL}.`);
    }
    return origin;
  }

  if (process.env.NODE_ENV === "development") {
    return configuredUrl
      ? parseSiteOrigin(configuredUrl)
      : "http://localhost:3000";
  }

  if (!configuredUrl) {
    throw new Error(
      "Set SITE_URL for production builds; localhost is only used by local development.",
    );
  }

  return parseSiteOrigin(configuredUrl);
}

/**
 * Canonical origin used by metadata, JSON-LD, sitemap, and RSS.
 * Production is deliberately strict; previews use their unique deployment URL.
 */
export const SITE_URL = resolveSiteUrl();

/**
 * Indexing is opt-in. Vercel additionally requires its configured production
 * hostname to match the approved custom host; Cloudflare requires its
 * explicit production marker. Preview and unknown environments stay noindex.
 */
export const IS_SITE_INDEXABLE =
  process.env.SITE_INDEXING_ENABLED === "true" &&
  SITE_URL === PRODUCTION_SITE_URL &&
  (process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_PROJECT_PRODUCTION_URL?.toLowerCase() ===
        PRODUCTION_SITE_HOST
    : process.env.CF_PAGES === "1"
      ? process.env.SITE_DEPLOYMENT_ENV === "production" &&
        Boolean(process.env.SITE_PRODUCTION_BRANCH) &&
        process.env.CF_PAGES_BRANCH === process.env.SITE_PRODUCTION_BRANCH
      : process.env.SITE_DEPLOYMENT_ENV === "production");
