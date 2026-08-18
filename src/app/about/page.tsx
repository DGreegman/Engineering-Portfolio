/**
 * About — `/about` (Task 6.3)
 *
 * The fourth and final `PRIMARY_NAVIGATION` destination — the page
 * `BeyondTheCode`'s own "Let's Connect →" CTA has pointed at since before
 * this milestone began (docs/39 §1). A single, static, server-rendered
 * editorial page composing the seven sections docs/03-SITEMAP.md and
 * docs/39 §8 name: About Header, Journey, Engineering Principles, Current
 * Interests, Tools, Learning Roadmap, Contact.
 *
 * Fully static composition — every section owns its own copy import
 * directly from `lib/constants/about-copy.ts` (docs/40 §11's own "no
 * data/loader architecture required" finding), so no props are threaded
 * from this file into any child, unlike the homepage's own sections which
 * receive already-resolved collection data. No `DocumentLayout` — this is
 * a listing-adjacent, statically-composed page, the same shape
 * `app/work/page.tsx` and `app/engineering-log/page.tsx` already use, not
 * the single-document skeleton `/work/[slug]` etc. need (docs/40 §6 WI-9).
 */
import type { Metadata } from "next";

import { AboutHeader } from "@/components/about/about-header";
import { Journey } from "@/components/about/journey";
import { EngineeringPrinciples } from "@/components/about/engineering-principles";
import { CurrentInterests } from "@/components/about/current-interests";
import { Tools } from "@/components/about/tools";
import { LearningRoadmap } from "@/components/about/learning-roadmap";
import { Contact } from "@/components/about/contact";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

// Task 8.2 (docs/83 §5): one local const, read three times below.
const description =
  "Software Engineer and Technical Lead — engineering principles, current interests, tools, and how to get in touch.";

export const metadata: Metadata = {
  title: "About",
  description,
  // Task 8.3 (docs/84, docs/85 §14): types repeated verbatim from root —
  // alternates is replaced wholesale, not deep-merged, the moment a route
  // defines its own (docs/83 §3's identical rule for openGraph/twitter).
  alternates: {
    canonical: "/about",
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  openGraph: {
    title: "About",
    description,
    url: "/about",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <Journey />
      <EngineeringPrinciples />
      <CurrentInterests />
      <Tools />
      <LearningRoadmap />
      <Contact />
    </>
  );
}
