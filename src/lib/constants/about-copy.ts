/**
 * About Copy — `/about` (Task 6.3)
 *
 * The single content module `app/about/page.tsx` and every `components/
 * about/*` section reads from directly — no resolver, no `getAbout()`,
 * mirroring `homepage-copy.ts`'s own shape exactly (one named export per
 * section) rather than inventing a different pattern for a page that's
 * architecturally the same kind of thing (docs/40 §11, D1).
 *
 * Editorial Source Rule (docs/40 §4): every string below is hand-transcribed
 * and adapted from `docs/01-PERSONAL_BRAND.md` — that document is the
 * source this copy was written *from*, never a file this application
 * imports *from* at runtime. Where a section draws on this repository's own
 * real content instead (the Work case studies, `lib/constants/site.ts`),
 * that's noted per export.
 *
 * Deliberately NOT a restatement of `BEYOND_THE_CODE_COPY`
 * (homepage-copy.ts) — same source person, different depth, verified by
 * direct comparison as part of Task 6.3's own release review (docs/40 §5,
 * §6 WI-10 step 2). Do not copy `BEYOND_THE_CODE_COPY`'s paragraphs into any
 * export below, and do not add unrelated personal-data fields here — this
 * file holds About's own page copy, not a general identity store (docs/40's
 * own implementation-authorization constraint).
 */

/**
 * About Header — docs/01 "Positioning Statement".
 *
 * First-person, matching the voice every other page on this site already
 * uses (Hero, BeyondTheCode) — docs/01 itself states the same fact in third
 * person ("Gracious Obeagu is a Backend Engineer and Technical Lead...");
 * this is a voice adaptation, not a new claim.
 */
export const ABOUT_HEADER_COPY = {
  eyebrow: "About",
  headline: "Backend Engineer & Technical Lead.",
  introduction: [
    "I'm a Backend Engineer and Technical Lead specializing in secure backend systems, developer tooling, API design, distributed systems, and engineering best practices.",
    "My long-term direction is to become a security-focused engineer — someone who designs resilient systems, secures modern cloud infrastructure, and embeds security into every stage of software development, rather than adding it at the end.",
  ],
} as const;

/**
 * Journey — docs/01 "Long-Term Vision" ("a living engineering hub that
 * documents the journey from Backend Engineer to Security-Focused Software
 * Architect"), grounded further in this repository's own real Work case
 * studies rather than an invented career history (docs/39 §8/§21's own
 * "shorter is honest" ruling — no employer, year, or project count appears
 * here that isn't already real, checked-in content).
 */
export const JOURNEY_COPY = {
  title: "Journey",
  paragraphs: [
    "This workspace exists because building software and writing about how it's built have always been the same practice — one that starts with a real problem, not a framework choice.",
    "The engineering case studies documented in Work — VaultPay, Cookeaze, Haya, GoHunt — are the actual evidence of that practice: systems designed, reasoned about, and in some cases hardened against real production failure modes, documented as they happened rather than rewritten afterward into something tidier than it was.",
    "The throughline across that work is a shift already underway, not a destination already reached: from building backend systems well to building them securely by default.",
  ],
} as const;

/**
 * Engineering Principles — docs/01 "Engineering Philosophy", the fuller
 * five-point statement that section states directly. Deliberately a
 * different five points from the homepage's own `HOW_I_THINK_COPY`
 * (Simplicity over Complexity, Reliability before Cleverness, Documentation
 * is Part of Engineering, Security is a Design Decision, Learn Publicly) —
 * same person, two different real statements docs/01 and docs/14 each make
 * in their own words, not one restated as the other (docs/40 §5).
 */
export const ENGINEERING_PRINCIPLES_COPY = {
  title: "Engineering Principles",
  introduction: [
    "These five defaults govern the trade-offs behind every case study in Work — not aspirational statements, but the same evaluation standard applied consistently, whether the system in question is a payment ledger, an API, or this workspace's own architecture.",
  ],
  principles: [
    {
      title: "Correct before clever.",
      description:
        "A system's first job is to do what it's supposed to do — everything else is judged after that's already true.",
    },
    {
      title: "Readable before compact.",
      description:
        "Code is read far more often than it's written; a shorter version that costs the next reader more time isn't actually shorter.",
    },
    {
      title: "Reliable before fast.",
      description:
        "A system has to be dependable before it's worth optimizing — speed on top of an unreliable foundation just fails faster.",
    },
    {
      title: "Maintainable before trendy.",
      description:
        "Decisions are made for whoever maintains this system next, not for whatever's fashionable to reach for right now.",
    },
    {
      title: "Secure by design, not secure as an afterthought.",
      description:
        "Security is a fundamental engineering requirement, not a feature added later — it has to be part of the architecture from the start.",
    },
  ],
} as const;

/**
 * Current Interests — docs/01 "Growing Expertise" (Application Security,
 * SSDLC, Cloud Security, Threat Modeling, Secure API Design, IAM,
 * Infrastructure Security, DevSecOps). About's own depth on this material —
 * deliberately distinct wording and framing from the homepage's own
 * `CURRENT_FOCUS_COPY` (Distributed Systems, Cloud Architecture, Security
 * Engineering, AI Engineering), same underlying direction, not the same
 * four cards restated as prose (docs/40 §5).
 */
export const CURRENT_INTERESTS_COPY = {
  title: "Current Interests",
  paragraphs: [
    "Most of what I'm actively working through right now sits under one umbrella: Application Security and the Secure Software Development Lifecycle — specifically threat modeling, secure API design, identity and access management, and infrastructure security, rather than security as a general topic.",
    'Cloud security and DevSecOps sit alongside that — less "learning a new tool" and more learning how the same reliability and maintainability standard behind Engineering Principles extends past application code into infrastructure and deployment pipelines.',
  ],
} as const;

/**
 * Tools — docs/01 "Technical Strengths" (Current) and "Content Pillars"
 * name the underlying practices; the concrete list below is grounded more
 * specifically in this repository's own real Work case studies (their
 * `technologies` frontmatter), which is more verifiable than an abstract
 * self-description. Plain text by design — never a percentage, a rating, or
 * a logo wall (docs/01's own "Things We Never Do": "Never rate technologies
 * with percentages").
 */
export const TOOLS_COPY = {
  title: "Tools",
  introduction: [
    "This isn't a skills rating — it's what actually shows up across the case studies in Work: the languages, frameworks, and datastores the real systems documented there are built with, alongside practices that don't appear in a dependency file but shape every one of them just as much.",
  ],
  items: [
    "Go",
    "Node.js",
    "Python",
    "Fiber",
    "Django",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "API Design",
    "System Design",
    "Authentication & Authorization",
    "Technical Documentation",
  ],
} as const;

/**
 * Learning Roadmap — docs/01 "Future Identity" (Distributed Systems
 * Engineer, Solutions Architect, Cloud Security Engineer, Application
 * Security Engineer, Security-Focused Software Architect) and "Long-Term
 * Vision" ("the journey from Backend Engineer to Security-Focused Software
 * Architect").
 */
export const LEARNING_ROADMAP_COPY = {
  title: "Learning Roadmap",
  paragraphs: [
    "The direction stated plainly in this workspace's own long-term vision: moving from Backend Engineer toward Security-Focused Software Architect — someone who designs resilient systems, secures modern cloud infrastructure, and treats security as a first-class part of the architecture rather than a checklist applied afterward.",
    "Concretely, that means growing deeper into distributed systems design, cloud security, and application security specifically — not abandoning backend engineering, but extending the same standard behind Engineering Principles into infrastructure and threat modeling as well.",
  ],
} as const;

/**
 * Contact — docs/03-SITEMAP.md's own "no standalone Contact page" decision;
 * the three real channels below are read directly from `lib/constants/
 * site.ts` by the `Contact` component (docs/40 §4's "one fact, one file" —
 * not re-declared as strings here). No resume link, no scheduling link —
 * neither asset exists in this repository (docs/39 D3); omitted, not
 * stubbed.
 */
export const ABOUT_CONTACT_COPY = {
  title: "Contact",
  introduction: [
    "The fastest way to reach me is directly — no form, no scheduling tool standing between a message and an answer.",
  ],
} as const;
