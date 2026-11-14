import type { MetadataRoute } from "next";
import { IS_SITE_INDEXABLE, SITE_URL } from "@/lib/constants/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep crawlers able to read each page's noindex metadata on previews and
    // before launch. Only the explicitly approved production build advertises
    // the sitemap.
    rules: { userAgent: "*", allow: "/" },
    ...(IS_SITE_INDEXABLE ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
