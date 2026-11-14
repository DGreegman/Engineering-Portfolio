import path from "node:path";
import { pathToFileURL } from "node:url";

export const expectedAccountId = "1b9ebe81039d0c4556b215bf27e2c6d2";
export const expectedProjectName = "engineering-desk";
export const expectedProductionBranch = "main";
export const expectedProductionDomain = "gracious.diftrak.com";

export async function verifyCloudflareProductionProject({
  accountId,
  apiToken,
  fetchImpl = fetch,
}) {
  if (!apiToken) {
    throw new Error("CLOUDFLARE_PRODUCTION_API_TOKEN is required.");
  }
  if (accountId !== expectedAccountId) {
    throw new Error(
      "CLOUDFLARE_PRODUCTION_ACCOUNT_ID does not match the audited Cloudflare account.",
    );
  }

  const apiBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${expectedProjectName}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${apiToken}`,
  };
  const options = { headers, signal: AbortSignal.timeout(20_000) };
  const response = await fetchImpl(apiBase, options);

  if (!response.ok) {
    throw new Error(
      `Could not verify Cloudflare Pages project ${expectedProjectName} (HTTP ${response.status}).`,
    );
  }

  const payload = await response.json();
  if (!payload.success || payload.result?.name !== expectedProjectName) {
    throw new Error(
      `Cloudflare API did not confirm the ${expectedProjectName} project in the expected account.`,
    );
  }
  if (payload.result?.production_branch !== expectedProductionBranch) {
    throw new Error(
      `Cloudflare project ${expectedProjectName} must use production branch ${expectedProductionBranch}.`,
    );
  }

  const domainsResponse = await fetchImpl(`${apiBase}/domains`, options);
  if (!domainsResponse.ok) {
    throw new Error(
      `Could not verify custom domains for ${expectedProjectName} (HTTP ${domainsResponse.status}).`,
    );
  }
  const domainsPayload = await domainsResponse.json();
  if (!domainsPayload.success || !Array.isArray(domainsPayload.result)) {
    throw new Error(
      `Cloudflare API did not return the custom domains for ${expectedProjectName}.`,
    );
  }
  const expectedDomain = domainsPayload.result.find(
    (domain) => domain.name === expectedProductionDomain,
  );
  if (!expectedDomain) {
    throw new Error(
      `Cloudflare Pages project ${expectedProjectName} is missing ${expectedProductionDomain}.`,
    );
  }
  if (expectedDomain.status !== "active") {
    throw new Error(
      `Cloudflare custom domain ${expectedProductionDomain} must be active; received ${expectedDomain.status ?? "unknown"}.`,
    );
  }

  return { ...payload.result, verifiedDomain: expectedDomain };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    await verifyCloudflareProductionProject({
      accountId: process.env.CLOUDFLARE_PRODUCTION_ACCOUNT_ID,
      apiToken: process.env.CLOUDFLARE_PRODUCTION_API_TOKEN,
    });
    console.log(
      `Verified Cloudflare account, ${expectedProjectName}, production branch ${expectedProductionBranch}, and active ${expectedProductionDomain}.`,
    );
  } catch (error) {
    console.error(`Production Cloudflare preflight failed: ${error.message}`);
    process.exitCode = 1;
  }
}
