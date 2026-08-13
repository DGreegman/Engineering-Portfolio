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

export const metadata: Metadata = {
  title: "About — Engineering Portfolio",
  description:
    "Backend Engineer and Technical Lead — engineering principles, current interests, tools, and how to get in touch.",
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
