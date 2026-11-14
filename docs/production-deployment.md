# Production Deployment

The production deployment is a manual GitHub Actions workflow. The existing
`ci.yml` workflow remains the automatic path for preview deployments to
`engineering-desk-preview` on the `portfolio-preview` branch.

## Required external configuration

Before dispatching `.github/workflows/deploy-production.yml`:

1. Create a Cloudflare Pages **Direct Upload** project named
   `engineering-desk` with `main` as its production branch. Direct Upload is
   the deployment model used by this workflow; Cloudflare does not allow a
   Direct Upload project to be converted to Git integration later.
2. Associate `gracious.diftrak.com` with that project and confirm Cloudflare
   reports the custom domain as active with HTTPS available. Any DNS change
   must be reviewed and made separately by the domain owner; this workflow
   does not change DNS.
3. In GitHub repository settings, create a `production` environment before
   running the workflow. Restrict allowed deployment branches to `main`, add
   at least one authorized required reviewer, enable **Prevent self-review**,
   and disallow administrator bypass of protection rules.
4. Add these as **environment secrets** on `production`:
   - `CLOUDFLARE_PRODUCTION_ACCOUNT_ID` — the audited account ID
     `1b9ebe81039d0c4556b215bf27e2c6d2`.
   - `CLOUDFLARE_PRODUCTION_API_TOKEN` — a separate token for this production
     deployment, created under the audited account and scoped to Account →
     Cloudflare Pages → Edit. Do not use a zone-scoped or global API token.

Do not copy the preview token into production secrets by default. The
workflow checks the account ID and queries the Pages API to verify that the
`engineering-desk` project exists, has `main` as its production branch, and
has `gracious.diftrak.com` attached with status `active` before it invokes
Wrangler. The preflight uses account-scoped Pages API paths for both project
and custom-domain checks; a missing or inactive domain fails closed.

GitHub can create an environment implicitly when a workflow references a
missing environment; that new environment has no protection rules. Configure
the environment and its reviewers before dispatching. If required reviewers
are unavailable under the repository's visibility or GitHub plan, do not
deploy and do not remove the environment gate. Ask a repository admin to add
an authorized reviewer, or move to a plan/visibility that supports required
reviewers. Keep production deployment blocked until that protection is in
place.

## Dispatch and approval

Run **Production deployment** from the `main` branch and enter exactly:

```text
DEPLOY engineering-desk
```

The workflow rejects any other ref or confirmation value. It builds a fresh
production artifact for the selected commit with:

```text
SITE_DEPLOYMENT_ENV=production
SITE_URL=https://gracious.diftrak.com
SITE_PRODUCTION_BRANCH=main
SITE_INDEXING_ENABLED=false
```

The build verifies this artifact before upload. Only after it passes does the
deployment job request approval from the protected `production` environment.
Production secrets are available only to that approved deployment job. The
job downloads and rechecks the artifact, verifies the Cloudflare account and
project, then deploys `out/` to project `engineering-desk`, branch `main`.
It runs live route, asset, metadata, feed, sitemap, security-header, and
noindex checks against `https://gracious.diftrak.com` afterward. The artifact
check compares required production routes with exported HTML and requires the
sitemap routes to match exported HTML routes, excluding the intentionally
omitted `/search` page. It discovers local runtime assets from HTML and linked
CSS, including fonts, images, scripts, stylesheets, and other static files;
third-party URLs are excluded. The live verifier requests each discovered
asset. A non-200 asset response or any other post-deployment verification
failure marks the deployment job and workflow as failed.

The preview artifact is never reused for production: its absolute URLs point
to the preview hostname. Pushes and merges to `main` continue to deploy only
through the existing preview workflow.

## Indexing and response headers

The production workflow hardcodes `SITE_INDEXING_ENABLED=false`; it has no
input that can enable indexing. Production HTML metadata and the global
Cloudflare `X-Robots-Tag` header both remain noindex. `robots.txt` allows
crawling so crawlers can see each page's noindex metadata, but it does not
advertise the sitemap while noindex is active. The sitemap and RSS are still
generated with the production origin.

`scripts/write-pages-headers.mjs` emits these global Pages headers for
production and preview exports:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Robots-Tag: noindex, nofollow` while indexing is disabled or the build
  is not the explicitly approved production target

HSTS is not emitted here because the host is a subdomain of `diftrak.com`;
zone-level HSTS scope should be confirmed with the domain owner. A Content
Security Policy is also intentionally deferred until the static Next.js
bootstrap and structured-data scripts have been evaluated against a tested
policy.

Do not enable search indexing as part of the initial deployment. After the
custom domain, HTTPS, routes, metadata, and headers have been verified, a
separate reviewed change and explicit deployment approval are required to
enable indexing.

## Rollback

If live verification fails or the deployed site has a production issue, use
the Cloudflare Pages dashboard to restore the previous successful production
deployment:

1. Open **Workers & Pages** → `engineering-desk` → **Deployments**.
2. Find the prior deployment marked successful and confirm its deployment
   details identify the expected commit/build.
3. From that production deployment's three-dot menu, choose **Rollback to this
   deployment** and confirm the action.
4. Re-run the production route, asset, security-header, sitemap, feed, and
   noindex checks against `https://gracious.diftrak.com`.

Cloudflare Pages only permits successful production deployments as rollback
targets; preview deployments are not valid targets. The workflow does not
attempt automatic rollback. Keep the production secrets and environment
protection configured so a subsequent reviewed dispatch can redeploy a
corrected build if needed.
