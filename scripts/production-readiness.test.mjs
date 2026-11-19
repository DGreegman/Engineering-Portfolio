import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { createPagesHeaders } from "./write-pages-headers.mjs";
import {
  productionAssets,
  productionHtmlRoutes,
  productionOrigin,
  requiredResponseHeaders,
  discoverLocalAssets,
  getExportedHtmlRoutes,
  verifyProductionArtifact,
  verifyProductionDeployment,
} from "./verify-pages-production.mjs";
import {
  expectedAccountId,
  expectedProductionBranch,
  expectedProjectName,
  expectedProductionDomain,
  verifyCloudflareProductionProject,
} from "./verify-cloudflare-production-project.mjs";

function createFixture(t, overrides = {}) {
  const outputDirectory = mkdtempSync(
    path.join(os.tmpdir(), "engineering-desk-production-"),
  );
  t.after(() => rmSync(outputDirectory, { recursive: true, force: true }));

  const environment = {
    SITE_DEPLOYMENT_ENV: "production",
    SITE_URL: productionOrigin,
    SITE_PRODUCTION_BRANCH: "main",
    SITE_INDEXING_ENABLED: overrides.indexingEnabled ? "true" : "false",
  };
  writeFileSync(
    path.join(outputDirectory, "_headers"),
    createPagesHeaders({ ...environment, ...overrides.headersEnvironment }),
  );

  const htmlByRoute = new Map();
  for (const route of productionHtmlRoutes) {
    const canonical =
      route === "/" ? productionOrigin : new URL(route, productionOrigin).href;
    const robots =
      overrides.indexingEnabled && route !== "/search"
        ? "index, follow"
        : "noindex, follow";
    const page =
      overrides.html?.[route] ??
      `<html><head><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}"></head><body>Page</body></html>`;
    htmlByRoute.set(route, page);
    const filePath =
      route === "/"
        ? path.join(outputDirectory, "index.html")
        : path.join(outputDirectory, `${route.slice(1)}.html`);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, page);
  }

  for (const asset of productionAssets) {
    const filePath = path.join(outputDirectory, asset.slice(1));
    mkdirSync(path.dirname(filePath), { recursive: true });
    let contents = "asset";
    if (asset === "/search-index.json") {
      contents = JSON.stringify([
        { title: "Example", href: "/knowledge/backend" },
      ]);
    } else if (asset === "/robots.txt") {
      contents = "User-Agent: *\nAllow: /\n";
      if (overrides.indexingEnabled)
        contents += `Sitemap: ${productionOrigin}/sitemap.xml\n`;
    } else if (asset === "/sitemap.xml") {
      contents = `<urlset>${productionHtmlRoutes
        .filter((route) => route !== "/search")
        .map(
          (route) =>
            `<url><loc>${new URL(route, productionOrigin).href}</loc></url>`,
        )
        .join("")}</urlset>`;
    } else if (asset === "/rss.xml") {
      contents = `<rss><channel><link>${productionOrigin}</link><item><link>${productionOrigin}/knowledge/backend</link></item></channel></rss>`;
    }
    writeFileSync(filePath, contents);
  }

  return { outputDirectory, htmlByRoute };
}

function responseHeaders(overrides = {}) {
  return new Headers({
    ...requiredResponseHeaders,
    "x-robots-tag": "noindex, nofollow",
    ...overrides,
  });
}

test("preview and initial production headers retain security and noindex", () => {
  for (const environment of [
    {
      SITE_DEPLOYMENT_ENV: "preview",
      SITE_URL: "https://portfolio-preview.engineering-desk-preview.pages.dev",
      SITE_INDEXING_ENABLED: "false",
    },
    {
      SITE_DEPLOYMENT_ENV: "production",
      SITE_URL: productionOrigin,
      SITE_INDEXING_ENABLED: "false",
    },
  ]) {
    const headers = createPagesHeaders(environment);
    assert.match(headers, /X-Content-Type-Options: nosniff/);
    assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
    assert.match(headers, /X-Frame-Options: DENY/);
    assert.match(
      headers,
      /Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/,
    );
    assert.match(headers, /X-Robots-Tag: noindex, nofollow/);
  }
});

test("only an explicitly enabled, correctly identified production build drops X-Robots-Tag", () => {
  const rejectedBuild = createPagesHeaders({
    SITE_DEPLOYMENT_ENV: "production",
    SITE_URL: productionOrigin,
    SITE_INDEXING_ENABLED: "true",
    SITE_PRODUCTION_BRANCH: "main",
    CF_PAGES: "1",
    CF_PAGES_BRANCH: "preview",
  });
  assert.match(rejectedBuild, /X-Robots-Tag: noindex, nofollow/);

  const approvedTarget = createPagesHeaders({
    SITE_DEPLOYMENT_ENV: "production",
    SITE_URL: productionOrigin,
    SITE_INDEXING_ENABLED: "true",
    CF_PAGES: "1",
    SITE_PRODUCTION_BRANCH: "main",
    CF_PAGES_BRANCH: "main",
  });
  assert.doesNotMatch(approvedTarget, /X-Robots-Tag/);
});

test("production artifact verifier accepts production URLs, headers, resources, and noindex", (t) => {
  const { outputDirectory } = createFixture(t);
  assert.deepEqual(verifyProductionArtifact(outputDirectory), []);
});

test("production artifact allows public pages and keeps search out of the index", (t) => {
  const { outputDirectory, htmlByRoute } = createFixture(t, {
    indexingEnabled: true,
  });
  const options = { indexingEnabled: true };
  assert.deepEqual(verifyProductionArtifact(outputDirectory, options), []);

  writeFileSync(
    path.join(outputDirectory, "about.html"),
    htmlByRoute
      .get("/about")
      .replace("</head>", '<meta name="googlebot" content="noindex"></head>'),
  );
  writeFileSync(
    path.join(outputDirectory, "search.html"),
    htmlByRoute.get("/search").replace("noindex", "index"),
  );
  const failures = verifyProductionArtifact(outputDirectory, options);
  assert.ok(
    failures.includes("/about: HTML googlebot metadata blocks indexing"),
  );
  assert.ok(
    failures.includes("/search: HTML robots metadata is missing noindex"),
  );
});

test("live production verification rejects a host-wide noindex header", async (t) => {
  const { outputDirectory, htmlByRoute } = createFixture(t, {
    indexingEnabled: true,
  });
  const fetchImpl = async (url) => {
    const route = new URL(url).pathname;
    const body =
      htmlByRoute.get(route) ??
      readFileSync(path.join(outputDirectory, route.slice(1)));
    return new Response(body, { headers: requiredResponseHeaders });
  };
  const options = { indexingEnabled: true, fetchImpl };
  assert.deepEqual(await verifyProductionDeployment(options), []);

  const failures = await verifyProductionDeployment({
    ...options,
    fetchImpl: async (url) => {
      const response = await fetchImpl(url);
      if (new URL(url).pathname === "/") {
        response.headers.set("X-Robots-Tag", "googlebot: noindex");
      }
      return response;
    },
  });
  assert.ok(failures.includes("/: x-robots-tag blocks indexing"));
});

test("artifact verifier rejects missing expected HTML routes", (t) => {
  const { outputDirectory } = createFixture(t);
  rmSync(path.join(outputDirectory, "about.html"));
  assert.ok(
    verifyProductionArtifact(outputDirectory).some((failure) =>
      failure.includes("/about: required exported HTML route is missing"),
    ),
  );
});

test("artifact verifier rejects sitemap URLs that are not exported routes", (t) => {
  const { outputDirectory } = createFixture(t);
  writeFileSync(
    path.join(outputDirectory, "sitemap.xml"),
    `<urlset><url><loc>${productionOrigin}/missing-production-route</loc></url></urlset>`,
  );
  const failures = verifyProductionArtifact(outputDirectory);
  assert.ok(
    failures.some((failure) =>
      failure.includes("unexpected production route /missing-production-route"),
    ),
  );
  assert.ok(
    failures.some((failure) =>
      failure.includes("missing exported production route /about"),
    ),
  );
});

test("artifact verifier discovers local HTML and CSS assets and rejects missing files", (t) => {
  const { outputDirectory } = createFixture(t);
  writeFileSync(
    path.join(outputDirectory, "index.html"),
    `<html><head><meta name="robots" content="noindex"><link rel="canonical" href="${productionOrigin}/"><link rel="stylesheet" href="/styles/site.css"><script src="/scripts/app.js"></script><script src="https://third-party.example/library.js"></script></head><body><img src="/images/hero.webp"></body></html>`,
  );
  mkdirSync(path.join(outputDirectory, "styles"), { recursive: true });
  for (const asset of [
    "scripts/app.js",
    "styles/site.css",
    "images/hero.webp",
    "fonts/site.woff2",
    "images/background.avif",
  ]) {
    const filePath = path.join(outputDirectory, asset);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, "asset");
  }
  writeFileSync(
    path.join(outputDirectory, "styles/site.css"),
    `@font-face{src:url("/fonts/site.woff2")}body{background:url('/images/background.avif')}`,
  );

  const discovered = discoverLocalAssets(outputDirectory);
  assert.ok(discovered.includes("/scripts/app.js"));
  assert.ok(discovered.includes("/styles/site.css"));
  assert.ok(discovered.includes("/fonts/site.woff2"));
  assert.ok(!discovered.some((asset) => asset.includes("third-party")));
  assert.deepEqual(verifyProductionArtifact(outputDirectory), []);

  rmSync(path.join(outputDirectory, "fonts/site.woff2"));
  assert.ok(
    verifyProductionArtifact(outputDirectory).some((failure) =>
      failure.includes("/fonts/site.woff2: required exported asset is missing"),
    ),
  );
});

test("production artifact verifier rejects bad canonicals, missing noindex, and weakened headers", (t) => {
  const { outputDirectory } = createFixture(t, {
    html: {
      "/about":
        '<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="https://example.com/about"></head></html>',
    },
  });
  writeFileSync(
    path.join(outputDirectory, "_headers"),
    createPagesHeaders({
      SITE_DEPLOYMENT_ENV: "production",
      SITE_URL: productionOrigin,
      SITE_INDEXING_ENABLED: "false",
    }).replace("X-Frame-Options: DENY\n", ""),
  );
  const additionalRoutePath = path.join(
    outputDirectory,
    "knowledge",
    "unlisted.html",
  );
  mkdirSync(path.dirname(additionalRoutePath), { recursive: true });
  writeFileSync(
    additionalRoutePath,
    `<html><head><meta name="robots" content="noindex"><link rel="canonical" href="https://example.com/knowledge/unlisted"></head></html>`,
  );

  const failures = verifyProductionArtifact(outputDirectory);
  assert.ok(
    failures.some((failure) => failure.includes("/about: canonical URL")),
  );
  assert.ok(
    failures.some((failure) =>
      failure.includes("/about: HTML robots metadata"),
    ),
  );
  assert.ok(
    failures.some((failure) =>
      failure.includes("/knowledge/unlisted: canonical URL"),
    ),
  );
  assert.ok(failures.some((failure) => failure.includes("x-frame-options")));
  assert.ok(
    getExportedHtmlRoutes(outputDirectory).includes("/knowledge/unlisted"),
  );
});

test("post-deployment verifier checks routes, assets, headers, feeds, and noindex", async (t) => {
  const { htmlByRoute } = createFixture(t);
  const responseBody = (route) => {
    if (htmlByRoute.has(route)) return htmlByRoute.get(route);
    if (route === "/search-index.json")
      return JSON.stringify([{ title: "Example" }]);
    if (route === "/robots.txt") return "User-Agent: *\nAllow: /\n";
    if (route === "/sitemap.xml")
      return `<urlset>${productionHtmlRoutes
        .filter((item) => item !== "/search")
        .map(
          (item) =>
            `<url><loc>${new URL(item, productionOrigin).href}</loc></url>`,
        )
        .join("")}</urlset>`;
    if (route === "/rss.xml")
      return `<rss><link>${productionOrigin}</link><item><link>${productionOrigin}/knowledge/backend</link></item></rss>`;
    return "asset";
  };
  const fetchImpl = async (url) =>
    new Response(responseBody(new URL(url).pathname), {
      status: 200,
      headers: responseHeaders(),
    });

  const failures = await verifyProductionDeployment({
    baseUrl: "http://127.0.0.1:8787",
    fetchImpl,
  });
  assert.deepEqual(failures, []);
});

test("post-deployment verifier fails when a response lacks a security header", async (t) => {
  const { htmlByRoute } = createFixture(t);
  const fetchImpl = async (url) => {
    const route = new URL(url).pathname;
    const body = htmlByRoute.get(route) ?? "asset";
    return new Response(body, {
      status: 200,
      headers: responseHeaders({ "x-frame-options": "" }),
    });
  };

  const failures = await verifyProductionDeployment({
    baseUrl: "http://127.0.0.1:8787",
    fetchImpl,
  });
  assert.ok(failures.some((failure) => failure.includes("x-frame-options")));
});

test("post-deployment verifier checks discovered assets and fails on an unsuccessful asset response", async (t) => {
  const { htmlByRoute } = createFixture(t);
  const fetchImpl = async (url) => {
    const route = new URL(url).pathname;
    if (route === "/scripts/app.js")
      return new Response("missing", { status: 404 });
    const body = htmlByRoute.get(route) ?? "asset";
    return new Response(body, { status: 200, headers: responseHeaders() });
  };
  const failures = await verifyProductionDeployment({
    baseUrl: "http://127.0.0.1:8787",
    assets: [...productionAssets, "/scripts/app.js"],
    fetchImpl,
  });
  assert.ok(
    failures.some((failure) =>
      failure.includes("/scripts/app.js: returned HTTP 404"),
    ),
  );
});

test("Cloudflare preflight accepts only the expected account, project, and main branch", async () => {
  const requestedUrls = [];
  const fetchImpl = async (url, options) => {
    requestedUrls.push(String(url));
    assert.equal(options.headers.Authorization, "Bearer production-token");
    assert.match(String(url), new RegExp(`/accounts/${expectedAccountId}/`));
    if (String(url).endsWith("/domains")) {
      return Response.json({
        success: true,
        result: [{ name: expectedProductionDomain, status: "active" }],
      });
    }
    return Response.json({
      success: true,
      result: {
        name: expectedProjectName,
        production_branch: expectedProductionBranch,
      },
    });
  };

  await verifyCloudflareProductionProject({
    accountId: expectedAccountId,
    apiToken: "production-token",
    fetchImpl,
  });
  assert.ok(requestedUrls.some((url) => url.endsWith("/engineering-desk")));
  assert.ok(
    requestedUrls.some((url) => url.endsWith("/engineering-desk/domains")),
  );

  await assert.rejects(
    verifyCloudflareProductionProject({
      accountId: "wrong-account",
      apiToken: "production-token",
      fetchImpl,
    }),
    /does not match the audited Cloudflare account/,
  );

  await assert.rejects(
    verifyCloudflareProductionProject({
      accountId: expectedAccountId,
      apiToken: "production-token",
      fetchImpl: async () =>
        Response.json({
          success: true,
          result: { name: expectedProjectName, production_branch: "preview" },
        }),
    }),
    /must use production branch main/,
  );

  await assert.rejects(
    verifyCloudflareProductionProject({
      accountId: expectedAccountId,
      apiToken: "production-token",
      fetchImpl: async (url) =>
        String(url).endsWith("/domains")
          ? Response.json({
              success: true,
              result: [{ name: expectedProductionDomain, status: "pending" }],
            })
          : Response.json({
              success: true,
              result: {
                name: expectedProjectName,
                production_branch: expectedProductionBranch,
              },
            }),
    }),
    /must be active/,
  );

  await assert.rejects(
    verifyCloudflareProductionProject({
      accountId: expectedAccountId,
      apiToken: "production-token",
      fetchImpl: async (url) =>
        String(url).endsWith("/domains")
          ? Response.json({ success: true, result: [] })
          : Response.json({
              success: true,
              result: {
                name: expectedProjectName,
                production_branch: expectedProductionBranch,
              },
            }),
    }),
    /is missing gracious\.diftrak\.com/,
  );
});
