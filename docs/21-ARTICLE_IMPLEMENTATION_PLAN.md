# 21 — ARTICLE_IMPLEMENTATION_PLAN

## Purpose

This document translates the approved Article Experience architecture into a structured implementation plan.

It defines the order in which the Engineering Article Experience should be built, identifies dependencies between tasks, establishes acceptance criteria, and ensures implementation follows the approved architecture rather than introducing new design decisions.

This document is an execution plan.

It is **not** an experience document, design proposal, or implementation guide.

---

# References

This implementation plan depends on the following approved documents:

* 10-Technical Architecture.md (routing strategy — see "Routing" and "Rendering Strategy")
* 11-Content Model.md (content engine's logical model — see "URL Philosophy" and "Metadata Standards")
* 15-KNOWLEDGE_EXPERIENCE.md
* 16-WRITING_GUIDELINES.md
* 18-ARTICLE_TEMPLATE.md
* 20-ARTICLE_EXPERIENCE.md

Implementation should reference these documents before any architectural decisions are made.

Corrected from earlier references to `10-ROUTING_ARCHITECTURE.md` and `11-CONTENT_ENGINE.md` — no documents exist under those names. The routing and content-engine material this plan depends on lives in the two documents named above; "content engine" as a term is `10-Technical Architecture.md`'s own name for `lib/content/` ("Content Processing" section), not a separate document.

---

# Objective

Build the Engineering Article Experience defined in the approved architecture.

The final result should provide a reading experience comparable to a modern engineering handbook or documentation system while remaining consistent with the Engineering Workspace philosophy.

---

# Implementation Principles

Every task should:

* implement approved architecture rather than redesign it
* remain focused on a single responsibility
* minimize coupling with unrelated features
* reuse existing design system components whenever possible
* extend the current content engine instead of replacing it
* avoid speculative features outside the approved scope

---

# Implementation Workflow

Every implementation task follows the same lifecycle.

```text
Implementation Task

↓

Implementation

↓

Engineering Review

↓

Design Review

↓

Refinement

↓

Approval
```

Implementation should never proceed to the next task until the current task has been reviewed and approved.

---

# Task Breakdown

---

# Task 4.3.1 — Document Resolution

## Purpose

Extend the content engine so the application can resolve Engineering Articles using the approved routing strategy.

## References

* 20-ARTICLE_EXPERIENCE.md
* Routing Resolution Order
* Required Schema Dependency: topic

## Scope

* Routing resolution
* Topic detection
* Article detection
* 404 handling
* Schema updates
* Article loading
* Metadata loading

## Out of Scope

* UI
* Layout
* Rendering
* Navigation

## Dependencies

None.

## Acceptance Criteria

* Routing follows the documented Topic → Article → 404 algorithm.
* Required article metadata is available.
* The new `topic` field is supported.
* Existing topic pages continue to function without regression.
* No routing ambiguity exists.

## Verification

Regression scenarios executed manually against a running instance (typecheck/lint/build pass on their own; this is what was additionally exercised at runtime):

* Known topic slug resolves the Topic Page — Backend, Security, Cloud, Performance, Testing.
* Known article slug resolves the document — verified with a temporary sample article (`content/knowledge/understanding-apis.mdx`), removed once verification was complete.
* Unknown slug returns 404 — checked both with and without an article present in the collection.
* Schema rejects a missing `topic` field.
* Schema rejects a `topic` value outside the controlled vocabulary.
* Schema rejects a non-singular (array) `topic` value.
* Schema accepts a valid `topic` value.
* No browser console errors across topic pages, the resolved article, the Knowledge landing page, and the homepage.
* Production build succeeds both with the temporary article present and with the collection empty again — `generateStaticParams` handles zero articles without error.

---

# Task 4.3.2 — Reading Layout

## Purpose

Create the structural layout for article documents.

## References

* Information Architecture
* Layout Strategy

## Scope

* Reading container
* Overall page layout
* Section spacing
* Responsive layout
* Sticky regions

## Out of Scope

* MDX rendering
* Code blocks
* TOC functionality
* Callouts

## Dependencies

Task 4.3.1

## Acceptance Criteria

* Layout matches the approved architecture.
* Reading width uses existing design tokens.
* Layout is responsive.
* Layout supports future document components.

---

# Task 4.3.3 — Document Header

## Purpose

Implement the document header.

## Scope

* Breadcrumb
* Title
* Description
* Metadata
* Reading time
* Difficulty
* Series
* Tags

## Dependencies

Task 4.3.2

## Acceptance Criteria

* Metadata hierarchy is clear.
* Header remains readable across screen sizes.
* Breadcrumb reflects document hierarchy.

---

# Task 4.3.4 — MDX Rendering

## Purpose

Render engineering documents using the approved article template.

## Scope

* Markdown
* Headings
* Lists
* Tables
* Images
* Links
* Footnotes
* Code fences

## Out of Scope

Interactive MDX components.

## Dependencies

Task 4.3.1

## Acceptance Criteria

* All article template sections render correctly.
* Typography matches workspace standards.
* Rendering is consistent across articles.

---

# Task 4.3.5 — Reading Navigation

## Purpose

Implement page-level reading navigation.

## Scope

* Table of Contents
* Heading IDs
* Scroll synchronization
* Sticky TOC
* Active section indication

## Dependencies

Task 4.3.4

## Acceptance Criteria

* TOC reflects document headings.
* Keyboard navigation remains accessible.
* Active section updates correctly.
* Focus is never stolen during scrolling.

---

# Task 4.3.6 — Code Experience

## Purpose

Deliver an excellent code-reading experience.

## Scope

* Syntax highlighting
* Filenames
* Copy action
* Inline code
* Command blocks

## Dependencies

Task 4.3.4

## Acceptance Criteria

* Build-time syntax highlighting.
* Minimal client-side JavaScript.
* Copy interaction functions correctly.
* Code typography remains readable.

---

# Task 4.3.7 — Callout System

## Purpose

Implement reusable engineering callouts.

## Scope

* Base Callout component
* Variant system
* Warning
* Tip
* Security
* Trade-off
* Best Practice
* Common Mistake

## Dependencies

Task 4.3.4

## Acceptance Criteria

* One reusable primitive supports all variants.
* Callouts remain accessible.
* Visual styling is consistent.

---

# Task 4.3.8 — Related Learning

## Purpose

Implement document relationships.

## Scope

* Prerequisites
* Related Learning
* Continue Learning
* Topic integration
* Knowledge graph preparation

## Dependencies

Task 4.3.1

Task 4.3.4

## Acceptance Criteria

* Related documents are generated correctly.
* Topic relationships are respected.
* Structure supports future typed relationships.

---

# Task 4.3.9 — Previous / Next Navigation

## Purpose

Implement sequential document navigation.

## Scope

* Previous document
* Next document
* Topic-aware fallback

## Dependencies

Task 4.3.8

## Acceptance Criteria

* Navigation is predictable.
* Links remain within the knowledge structure.
* Edge cases are handled gracefully.

---

# Task 4.3.10 — Accessibility & Refinement

## Purpose

Perform the final implementation review and polish.

## Scope

* Accessibility
* Keyboard navigation
* Heading hierarchy
* Screen reader support
* Responsive review
* Visual consistency
* Performance review

## Dependencies

All previous tasks.

## Acceptance Criteria

* WCAG considerations are satisfied.
* Typography remains consistent.
* Reading experience is uninterrupted.
* No visual regressions.
* No accessibility regressions.

---

# Review Checklist

Each implementation task should be reviewed using the following criteria before approval.

## Engineering

* Does implementation match the approved architecture?
* Are responsibilities clearly separated?
* Is unnecessary complexity avoided?
* Is existing infrastructure reused where appropriate?

---

## Design

* Does the experience remain documentation-first?
* Is visual hierarchy preserved?
* Is the interface free from unnecessary visual noise?

---

## Learning Experience

* Does the implementation improve comprehension?
* Does it reduce cognitive load?
* Does it maintain a predictable reading flow?

---

## Accessibility

* Keyboard navigation
* Screen reader support
* Heading hierarchy
* Focus management
* Color contrast
* Responsive behavior

---

## Performance

* Avoid unnecessary client-side JavaScript.
* Prefer server rendering where appropriate.
* Minimize hydration.
* Reuse shared infrastructure.

---

# Definition of Done

Task 4.3 is complete when:

* All implementation tasks have been completed.
* Every task has passed engineering review.
* Every task has passed design review.
* No outstanding architectural questions remain.
* The implementation conforms to the approved Article Experience architecture.
* The Engineering Article Experience provides a consistent, documentation-first reading experience suitable for long-term growth of the Engineering Workspace.

---

# Future Work

The following capabilities are intentionally excluded from Task 4.3 and remain future enhancements:

* Interactive diagrams
* Version history
* Reader annotations
* Reading state synchronization
* Semantic knowledge graph
* Interactive code playgrounds
* AI-assisted article summaries

These should be considered only after the core Engineering Article Experience has been completed, reviewed, and approved.
