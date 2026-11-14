import { rm, writeFile } from "node:fs/promises";

const headersPath = new URL("../out/_headers", import.meta.url);

if (process.env.SITE_DEPLOYMENT_ENV === "preview") {
  await writeFile(
    headersPath,
    "/*\n  X-Robots-Tag: noindex, nofollow\n",
    "utf8",
  );
} else {
  // Clear a previous preview artifact so production and local exports cannot
  // inherit the preview-only indexing header.
  await rm(headersPath, { force: true });
}
