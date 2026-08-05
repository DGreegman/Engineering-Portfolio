# Sitemap

Version: 1.0
Status: Draft
Work: Gracious Obeagu Portfolio

---

# Purpose

This document defines the complete information architecture of the portfolio.

The portfolio should not behave like a traditional developer portfolio.

Instead, it should feel like an engineering knowledge hub where visitors can quickly understand the engineer, explore engineering work, and discover technical content.

Every page must have a clear purpose.

If a page does not contribute to the visitor's understanding of the engineer, it should not exist.

---

# Navigation Structure

Knowledge

Work

Engineering Log

About

Home is intentionally not a separate nav item — the wordmark links there.
Now and Contact are not part of primary navigation (see their sections
below).

---

# Navigation Philosophy

Navigation should remain intentionally small.

Users should never feel overwhelmed.

The entire website should be discoverable in less than three clicks.

---

# Page Hierarchy

/
│
├── Knowledge
│     ├── Backend
│     ├── Security
│     ├── System Design
│     ├── Go
|     ├── Python 
│     ├── Node.js
│     ├── Architecture
│     ├── Career
│     └── Teaching
│
├── Work
│     ├── VaultPay
│     ├── Haya
│     ├── GoHunt
|     ├── Cookeaze 
│     └── NETS
│
├── Engineering Log
│
└── About

Now and Contact sit outside the primary tree — Now is deferred (see
"Future Expansion"), Contact is folded into About (see its section below).

---

# Homepage

Purpose

The homepage introduces the engineer.

It should answer three questions immediately.

Who are you?

What do you build?

Why should someone continue exploring?

Sections

Hero

Selected Work

Engineering Philosophy

Latest Writing

Current Focus

Call to Action

---

# Work

Purpose

Showcase engineering work through detailed case studies rather than Work cards.

Every Work should demonstrate engineering thinking.

Each Work should answer:

- What problem existed?
- Why was this architecture chosen?
- What trade-offs were made?
- What challenges occurred?
- How was success measured?
- What would be improved today?

Case Studies

VaultPay

GoHunt

Haya

NETS

Cookeaze

Future case studies should follow the same structure.

---

# Knowledge

Purpose

Become the central repository for evergreen technical knowledge.

Articles should be educational rather than promotional.

Categories

Backend

Security

Go

Node.js

System Design

Architecture

Career

Teaching

Future categories may be added without changing the site's structure.

---

# Engineering Log

Purpose

Chronicle engineering discoveries and lessons as they happen — dated,
narrower, and more personal than a Knowledge article. Not a rewrite of an
evergreen concept; a record of what was actually learned building
something, when it happened, and what it cost.

Each entry should surface:

- What was the challenge?
- What was the outcome?
- What technologies were involved?

Sections

Recent Entries

Archives

Unlike Knowledge, entries aren't organized by fixed category — chronology
is the primary structure. Future archival grouping (by year, by technology)
may be added without changing the site's structure.

---

# Individual Article

Purpose

Teach one engineering concept thoroughly.

Every article should include:

Introduction

Problem

Explanation

Examples

Best Practices

Key Takeaways

Related Articles

---

# About

Purpose

Tell the engineering story rather than a personal biography.

Recommended sections

Journey

Engineering Principles

Current Interests

Tools

Learning Roadmap

Contact

There is no standalone Contact page — this section is the frictionless
way to reach out that a dedicated page used to provide.

Include

Email

GitHub

LinkedIn

Resume

Optional scheduling link (future)

---

# Footer

Should remain minimal.

Navigation

Social links

Copyright

Current year

Portfolio version

Since there's no standalone Contact page, the footer's social links
(GitHub, LinkedIn, Email) double as the quick-contact path Contact used to
provide.

---

# URL Structure

/

 /work

 /work/vaultpay

 /work/gohunt

 /work/haya

 /work/nets
 
 /work/cookeaze

 /knowledge

 /knowledge/backend

 /knowledge/security

 /knowledge/system-design

 /knowledge/go

 /knowledge/nodejs

 /knowledge/architecture

 /knowledge/career

 /knowledge/teaching

 /engineering-log

 /about

---

# Future Expansion

The architecture should support additional pages without redesign.

Possible additions

Now (a personal "now page" documenting current priorities and focus —
deferred until it's part of an active content milestone)

Speaking

Resources

Open Source

Uses

Books

Newsletter

Labs

Security Research

---

# Information Architecture Principles

- Maximum three levels deep.
- Predictable URLs.
- Descriptive navigation labels.
- No hidden content.
- Content grouped by purpose.
- Consistent navigation across every page.

---

# Success Criteria

Visitors should:

- Find any Work within two clicks.
- Find any article within three clicks.
- Understand the site structure without explanation.
- Never feel lost while navigating.

The sitemap should remain scalable as new content is added over the coming years.
