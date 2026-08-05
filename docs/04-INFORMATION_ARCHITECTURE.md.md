# Information Architecture

Version: 1.0
Status: Draft
Project: Gracious Obeagu Portfolio

---

# Purpose

This document defines how information is organized, connected, and discovered throughout the portfolio.

The objective is not simply to help users find content.

The objective is to create a learning journey where every page naturally leads to another, encouraging exploration without overwhelming the visitor.

The portfolio should feel like an interconnected engineering knowledge base rather than a collection of independent pages.

---

# Information Architecture Principles

## Progressive Disclosure

Present only the information needed at each stage.

Start with high-level summaries.

Allow visitors to progressively explore deeper technical content.

Never overwhelm first-time visitors.

---

## Connected Knowledge

Every page should connect to at least one other meaningful page.

No page should become a dead end.

Examples:

Home
↓

Work
↓

Case Study

↓

Related Engineering Articles

↓

Another Case Study

↓

Contact

---

## Content Before Navigation

Content should naturally encourage discovery.

Users should not need to rely solely on the navigation bar.

Each page should recommend what to explore next.

---

## Engineering First

The website should prioritize engineering knowledge over personal promotion.

Every page should answer one important question.

Examples:

Who is this engineer?

How does this engineer solve problems?

What can I learn?

Why should I trust this engineer?

---

# User Journeys

## Journey 1 — Recruiter

Landing

↓

Hero

↓

Featured Work

↓

Resume

↓

LinkedIn

↓

Contact

Goal:

Quickly evaluate the candidate.

---

## Journey 2 — Engineering Manager

Landing

↓

Featured Work

↓

Case Study

↓

Architecture Decisions

↓

Related Engineering Article

↓

GitHub

↓

Contact

Goal:

Evaluate technical depth.

---

## Journey 3 — Fellow Engineer

Landing

↓

Engineering Journal

↓

Article

↓

Related Work

↓

Architecture

↓

Another Article

Goal:

Learn something useful.

---

## Journey 4 — Founder / CTO

Landing

↓

Work

↓

Problem Solved

↓

Technical Decisions

↓

Business Impact

↓

Contact

Goal:

Determine whether this engineer can own complex systems.

---

# Content Relationships

## Work → Articles

Every case study should recommend:

- 2–3 related engineering articles.

Example:

VaultPay

↓

"Why Money Should Never Use Floating Point"

↓

"Database Transactions Explained"

↓

"Optimistic vs Pessimistic Locking"

---

## Articles → Work

Every engineering article should reference real work where applicable.

Example:

Article

↓

Secure API Design

↓

See how this was implemented in Haya.

---

## About → Everything

The About page should serve as a gateway to the rest of the portfolio.

Instead of ending with biography, it should answer:

"What should I explore next?"

Recommended links:

Latest Work

Latest Journal Entry

Current Learning

Open Source

---

## Home → Everything

The homepage is a curated overview.

It should never contain complete information.

Its purpose is to encourage exploration.

---

# Content Hierarchy

Level 1

Identity

(Home)

↓

Level 2

Proof

(Work)

↓

Level 3

Knowledge

(Journal)

↓

Level 4

Connection

(Contact)

---

# Internal Linking Strategy

Every Work page should include:

Related Articles

Related Technologies

GitHub Repository

Live Demo (if applicable)

Next Case Study

---

Every Article should include:

Related Work

Further Reading

Recommended Articles

Tags

Published Date

Reading Time

---

Every About page should include:

Current Focus

Latest Work

Latest Article

Resume

Contact

---

# Search Strategy (Future)

Search should prioritize:

1. Article title

2. Work title

3. Tags

4. Technologies

5. Categories

6. Keywords

---

# Tags

Tags should be reused across the portfolio.

Example:

Go

Node.js

Security

Authentication

Authorization

Redis

PostgreSQL

System Design

Concurrency

Observability

Cloud

Docker

Kubernetes

API

Performance

Distributed Systems

---

# Categories

Work

Journal

Teaching

Open Source

Resources (Future)

Speaking (Future)

Security Research (Future)

---

# Recommended Reading Engine

Every page should answer:

"If the visitor enjoyed this page, what should they read next?"

Recommendations should be generated using:

Shared tags

Shared technologies

Shared engineering concepts

Shared domains

---

# Dead-End Prevention

No page should terminate the user's journey.

Every page must contain at least one meaningful next step.

Examples:

Continue Reading

Explore Related Work

View Source Code

Read the Engineering Journal

Contact

---

# Navigation Rules

Primary navigation should remain unchanged throughout the website.

Breadcrumbs should be used only where they improve orientation.

Users should always know where they are.

Navigation depth should remain shallow.

---

# Scalability

The information architecture must support:

Hundreds of articles.

Dozens of engineering case studies.

Open-source projects.

Conference talks.

Teaching resources.

Security research.

Without requiring structural redesign.

---

# Success Criteria

Visitors should never feel lost.

Every page should encourage exploration.

Related content should feel relevant.

The website should become more valuable as additional content is added.

Growth should improve the experience rather than complicate it.
