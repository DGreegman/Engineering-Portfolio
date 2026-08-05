# 10 — Technical Architecture

> Engineering blueprint for the Engineering Portfolio

---

# Purpose

This document defines the technical architecture of the Engineering Portfolio.

It explains the technologies, system boundaries, application structure, rendering strategy, content pipeline, deployment architecture, and engineering decisions that power the platform.

The objective is to build a fast, maintainable, scalable, documentation-first application.

---

# Architecture Principles

The system should prioritize:

* Simplicity over cleverness
* Performance by default
* Maintainability
* Content-first architecture
* Accessibility
* SEO
* Developer Experience
* Progressive enhancement

Every technical decision should support these principles.

---

# High-Level Architecture

```
Visitors
    │
    ▼
Next.js Application
    │
 ┌──┼───────────────┐
 │  │               │
 ▼  ▼               ▼
Content Engine   Search Index   Analytics
    │
    ▼
MDX + Metadata
    │
    ▼
Knowledge Graph
    │
    ▼
Static Assets
    │
    ▼
Vercel
```

The portfolio should primarily function as a statically generated website enhanced with selective dynamic capabilities.

---

# Technology Stack

## Framework

* Next.js (App Router)

Reason:

* Server Components
* Excellent SEO
* Static Generation
* Route Groups
* Metadata API
* Image Optimization

---

## Language

TypeScript

Reason:

* Type safety
* Better refactoring
* Self-documenting code
* Improved maintainability

---

## Styling

Tailwind CSS

Reason:

* Utility-first workflow
* Consistent spacing
* Small production bundles
* Easy theming

---

## UI Components

shadcn/ui

Reason:

* Accessible
* Customizable
* Not opinionated
* Built on Base UI

Base UI is the primitive library (MUI/Radix authors), chosen over Radix UI as of the shadcn CLI v4 default (July 2026) to track community adoption and ongoing upstream investment. Radix remains a supported alternative; this is a deliberate choice, not a fallback.

Components should remain project-owned.

---

## Icons

Lucide Icons

Reason:

* Lightweight
* Consistent
* Engineering aesthetic

---

## Content

MDX

Reason:

Content is the product.

MDX enables:

* interactive components
* diagrams
* callouts
* embedded React components
* syntax-highlighted code
* reusable knowledge blocks

---

## Content Processing

Internal content engine (`lib/content/`) — a lightweight, library-agnostic set of utilities built on MDX, gray-matter, and Zod, rather than a generated-output framework (e.g. Contentlayer or the `@content-collections/*` package).

Responsible for:

* validation
* metadata
* relationships
* indexing
* reading time
* tag generation

---

## Syntax Highlighting

Shiki

Reason:

Consistent syntax highlighting across themes.

Supports:

* line highlighting
* diff blocks
* annotations

---

## Diagrams

Mermaid

Initially used for:

* sequence diagrams
* flowcharts
* architecture diagrams

Future custom diagram components may replace Mermaid where needed.

---

## Search

Local search index.

Requirements:

* instant results
* keyboard shortcut
* fuzzy matching
* tag search
* technology search
* article search

The first version should not require an external search service.

---

## Analytics

Privacy-friendly analytics.

Track only meaningful interactions.

Examples:

* page views
* search usage
* article completion
* outbound links

Avoid intrusive tracking.

---

# Rendering Strategy

## Static Generation (Default)

Most pages should be generated at build time.

Examples:

* knowledge articles
* work
* engineering logs
* about
* homepage

Benefits:

* speed
* SEO
* reliability

---

## Dynamic Rendering

Reserved only for features that require it.

Examples:

* search indexing updates
* future comments
* future newsletters
* API endpoints

Dynamic rendering should remain the exception.

---

# Content Architecture

```
content/

├── knowledge/
├── work/
├── engineering-log/
├── technologies/
├── series/
└── pages/
```

Each content type owns its metadata and MDX body.

---

# Metadata Standard

Every content item should include:

* title
* slug
* description
* publishedAt
* updatedAt
* tags
* technologies
* difficulty
* readingTime
* featured
* draft
* coverImage
* prerequisites
* relatedContent

Metadata powers navigation and discovery.

---

# Routing

Examples:

```
/

 /knowledge

 /knowledge/api-idempotency

 /work/vaultpay

 /engineering-log/building-my-first-go-service

 /series/system-design

 /about

 /rss.xml

 /sitemap.xml
```

Routes should remain human-readable and permanent.

---

# Folder Structure

```
app/

components/

content/

lib/

hooks/

styles/

types/

public/

scripts/

```

Content is processed by an internal, library-agnostic content engine (`lib/content/`) built on MDX and Zod rather than a generated-output framework (e.g. Contentlayer), so there is no separate `contentlayer/` build directory to track.

Responsibilities should remain clearly separated.

---

# Component Organization

```
components/

layout/

navigation/

content/

knowledge/

feedback/

shared/

ui/
```

Avoid large miscellaneous component folders.

---

# Library Structure

```
lib/

search/

content/

seo/

analytics/

reading-time/

metadata/

utils/

constants/
```

Business logic belongs here.

---

# State Management

Default:

React state.

Context only when necessary.

Avoid introducing global state libraries without clear justification.

Server Components should handle the majority of data flow.

---

# Images

Requirements:

* responsive
* optimized
* lazy-loaded
* descriptive alt text
* modern formats where supported

Avoid oversized assets.

---

# Asset Strategy

```
public/

images/

icons/

logos/

og/

fonts/
```

Assets should be version-controlled.

---

# SEO Architecture

Every page should generate:

* title
* description
* Open Graph
* Twitter Card
* canonical URL
* structured data

Automatically.

---

# RSS

Automatically generated.

Includes:

* Knowledge
* Engineering Logs
* Case Studies

RSS should remain a first-class feature.

---

# Sitemap

Generated automatically during build.

---

# Robots

Configured automatically.

---

# Performance Targets

Lighthouse

Performance ≥ 95

Accessibility ≥ 100

SEO ≥ 100

Best Practices ≥ 100

---

# Accessibility

Must support:

* keyboard navigation
* semantic HTML
* screen readers
* focus management
* reduced motion
* sufficient contrast

Accessibility is a release requirement.

---

# Error Handling

Use:

* custom error pages
* not-found pages
* graceful MDX failures
* descriptive logging

Never expose internal errors to users.

---

# Deployment

Primary Platform:

Vercel

Reasons:

* native Next.js support
* preview deployments
* edge network
* image optimization
* analytics integration

Future self-hosting should remain possible.

---

# CI/CD

Every pull request should:

* lint
* type check
* build
* validate content
* verify links
* run tests (future)

Only successful builds should be deployable.

---

# Coding Standards

Follow:

* strict TypeScript
* ESLint
* Prettier
* consistent imports
* semantic naming
* accessible HTML

Code should optimize readability over brevity.

---

# Security

The portfolio should follow secure-by-default practices.

Examples:

* Content Security Policy
* secure headers
* sanitized MDX
* dependency updates
* no exposed secrets
* least privilege
* environment variable validation

Security reflects engineering quality.

---

# Future Expansion

The architecture should support future additions without major restructuring.

Potential expansions:

* newsletter
* comments
* bookmarks
* authentication
* interactive playgrounds
* API examples
* learning paths
* AI-assisted search
* multi-language support

The initial architecture should not block future growth.

---

# Technical North Star

Build a platform that is fast, reliable, maintainable, and enjoyable to extend.

The architecture should allow future features to be added through composition rather than rewrites.

