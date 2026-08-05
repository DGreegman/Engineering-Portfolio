# Engineering Portfolio Documentation

Welcome to the documentation for the Engineering Portfolio project.

This repository follows a documentation-driven development approach. Every major engineering decision should trace back to one of the documents in this directory.

---

# Reading Order

The documents are intended to be read in the following sequence:

## Phase 1 — Strategy

These documents define **why** the project exists and **what** it aims to achieve.

1. Personal Brand
2. Product Requirements Document (PRD)
3. Sitemap
4. Information Architecture
5. Knowledge Architecture
6. Content Strategy

---

## Phase 2 — Design

These documents define **how the experience should feel**.

7. Design System
8. UX Guidelines
9. Component Specification

---

## Phase 3 — Engineering

These documents define **how the application should be built**.

10. Technical Architecture
11. Content Model
12. Implementation Roadmap

---

# Documentation Principles

The documentation is the source of truth.

Implementation should follow the documentation.

If implementation requires changing an architectural decision, update the documentation before introducing the change into the codebase.

Documentation and implementation should evolve together.

---

# Development Workflow

Every milestone should follow this sequence:

1. Read the relevant documentation.
2. Produce an implementation plan.
3. Identify assumptions.
4. Implement the milestone.
5. Review the implementation against the documentation.
6. Refactor where necessary.
7. Commit changes.

No milestone should skip the review phase.

---

# Definition of Done

A milestone is complete only if it:

* Matches the Design System.
* Follows the UX Guidelines.
* Uses approved components.
* Aligns with the Technical Architecture.
* Preserves the Content Model.
* Passes linting and type checking.
* Meets accessibility requirements.
* Meets performance expectations.

---

# AI Agent Guidelines

When assisting with implementation:

* Read the relevant documentation before writing code.
* Do not invent new architecture when an existing decision already exists.
* Prefer extending existing components over creating new ones.
* Explain implementation plans before modifying code.
* Keep components reusable and composable.
* Raise questions whenever documentation is ambiguous rather than making assumptions.

The objective is not simply to generate code, but to preserve the engineering philosophy established by this documentation.

---

# Current Status

Planning: ✅ Complete

Implementation: Ready

Current Milestone:

Refer to **12 — Implementation Roadmap** for the active milestone.

---

# Long-Term Goal

Create an engineering knowledge platform that demonstrates not only what was built, but how an engineer thinks.

Every commit should move the project closer to that goal.

