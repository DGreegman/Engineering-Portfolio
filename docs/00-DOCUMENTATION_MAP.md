# 00 — DOCUMENTATION_MAP

## Purpose

This document provides a high-level map of the Engineering Workspace documentation.

Rather than documenting implementation details, it explains how the documentation is organized, how documents relate to one another, and the order in which they should be consumed.

It serves as the entry point for engineers, contributors, and implementation agents working on the project.

---

# Documentation Philosophy

The Engineering Workspace follows a documentation-first development process.

Every implementation begins with documentation.

Every architectural decision is reviewed before implementation.

Every implementation is reviewed before approval.

The goal is to make the documentation the primary source of truth rather than the codebase itself.

---

# Development Workflow

```text
Experience Documentation
        ↓
Architecture Specification
        ↓
Implementation Planning
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

Each stage produces an artifact that informs the next.

---

# Documentation Categories

The documentation is organized into four primary categories.

## 1. Experience Documentation

Defines the intended user experience.

Answers questions such as:

* What should users experience?
* Why does this feature exist?
* How should information be organized?

These documents should not contain implementation details.

---

## 2. Architecture Specifications

Translate the experience into a technical architecture.

These documents define:

* information architecture
* routing
* document relationships
* system boundaries
* long-term scalability

Architecture documents should not contain implementation code.

---

## 3. Implementation Plans

Break approved architecture into executable tasks.

Implementation plans define:

* implementation order
* dependencies
* scope
* acceptance criteria
* review checkpoints

They exist to reduce implementation risk and prevent architectural drift.

---

## 4. Implementation

Only after the previous three stages have been completed should implementation begin.

Implementation should follow the approved documentation rather than redefining architecture.

---

# Current Documentation Structure

## Foundation

Defines the core principles of the Engineering Workspace.

* Project philosophy
* Design system
* Development workflow
* Content architecture

---

## Knowledge Library

Defines how engineering knowledge is organized.

Includes:

* Knowledge Experience
* Writing Guidelines
* Case Study Template
* Article Template
* Article Experience
* Article Implementation Plan

Together these documents describe the complete lifecycle of an engineering article from authoring through implementation.

---

# Document Relationships

```text
Knowledge Experience
        │
        ▼
Writing Guidelines
        │
        ▼
Article Template
        │
        ▼
Article Experience
        │
        ▼
Article Implementation Plan
        │
        ▼
Implementation
```

Each document builds upon the previous one.

Documents should be read in this order when working on the Engineering Article Experience.

---

# Source of Truth

Each document has a clearly defined responsibility.

| Document                    | Responsibility                                            |
| --------------------------- | --------------------------------------------------------- |
| Knowledge Experience        | Defines the learning experience                           |
| Writing Guidelines          | Defines how content is written                            |
| Article Template            | Defines the structure of an engineering article           |
| Article Experience          | Defines the architecture of the article document          |
| Article Implementation Plan | Defines how the approved architecture will be implemented |

Responsibility should not overlap between documents.

---

# Engineering Principles

All future documentation should follow these principles.

* One document should have one primary responsibility.
* Avoid duplicating information across documents.
* Reference existing documents instead of copying content.
* Keep architecture separate from implementation.
* Treat documentation as the project's primary source of truth.

---

# Adding New Documentation

Before creating a new document, ask:

1. Does an existing document already own this responsibility?
2. Is this a new experience, architecture, or implementation concern?
3. Can this information be added by reference instead of duplication?

If the answer to the first question is "yes," prefer updating the existing document.

---

# Review Process

Every major document follows the same review lifecycle.

```text
Draft
        ↓
Review
        ↓
Refinement
        ↓
Approval
```

Only approved documentation should be referenced during implementation.

---

# Long-Term Vision

The documentation system should scale alongside the Engineering Workspace.

As new capabilities are introduced—such as additional document types, interactive experiences, or new content domains—they should extend the existing documentation hierarchy rather than creating parallel systems.

The documentation should remain organized, discoverable, and maintainable as the project evolves into a long-term engineering knowledge library.
