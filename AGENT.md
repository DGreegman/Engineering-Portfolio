# AGENT.md

> Engineering operating manual for AI coding assistants.

---

# Purpose

This repository follows a documentation-driven engineering workflow.

The purpose of this document is to define how AI coding assistants should collaborate on the project.

The objective is not simply to generate working code.

The objective is to produce maintainable software that faithfully implements the engineering vision documented in the `/docs` directory.

This document is the primary behavioral guide for AI assistants.

---

# Project Overview

This project is an **Engineering Knowledge Base**.

It is not a traditional portfolio.

It is a documentation-first platform that demonstrates engineering thinking through interconnected knowledge, case studies, and engineering logs.

Every implementation decision should reinforce that goal.

---

# Source of Truth

Documentation is authoritative.

Implementation exists to realize the documentation.

If implementation appears to conflict with documentation:

1. Stop.
2. Explain the conflict.
3. Propose a solution.
4. Wait for approval before changing architecture.

Never silently diverge from documented decisions.

---

# Documentation Hierarchy

When resolving conflicts, use the following priority:

1. README.md
2. Implementation Roadmap
3. Technical Architecture
4. Content Model
5. Component Specification
6. UX Guidelines
7. Design System
8. Content Strategy
9. Knowledge Architecture
10. Information Architecture
11. Sitemap
12. PRD
13. Personal Brand

Higher documents override lower ones only when genuine conflicts exist.

---

# Required Workflow

Before implementing any feature:

## Step 1

Understand the current milestone.

Read:

* README.md
* Relevant documentation
* Existing implementation

---

## Step 2

Produce an implementation plan.

The plan should include:

* Objective
* Files affected
* Components involved
* Dependencies
* Risks
* Assumptions

Do not write code yet.

---

## Step 3

Wait for approval.

Implementation begins only after the plan has been reviewed.

---

## Step 4

Implement incrementally.

Prefer small commits.

Avoid unrelated refactoring.

---

## Step 5

Self-review.

Compare implementation against documentation before considering the task complete.

---

# Engineering Principles

Prioritize:

* Readability
* Simplicity
* Composition
* Accessibility
* Performance
* Maintainability
* Predictability

Avoid clever solutions that reduce clarity.

---

# Architecture Rules

Always follow the documented architecture.

Do not:

* invent new folder structures
* duplicate logic
* bypass shared components
* introduce unnecessary dependencies
* replace established patterns without explanation

Architecture should evolve intentionally.

---

# Component Rules

Prefer composition over duplication.

Before creating a new component:

1. Search existing components.
2. Determine whether an existing component can be extended.
3. Explain why a new component is required.

Avoid component proliferation.

---

# Styling Rules

Follow the Design System.

Use:

* spacing tokens
* typography hierarchy
* reusable utilities

Avoid:

* inline styles
* arbitrary spacing
* inconsistent layouts

Visual consistency is required.

---

# Content Rules

Treat every content item as a Knowledge Node.

Preserve relationships including:

* prerequisites
* related content
* technologies
* tags
* series

Never reduce the platform to a simple blog.

---

# Accessibility Rules

Every implementation should support:

* keyboard navigation
* semantic HTML
* screen readers
* focus management
* reduced motion
* sufficient color contrast

Accessibility is mandatory.

---

# Performance Rules

Prefer:

* Server Components
* Static Generation
* lazy loading
* optimized assets
* efficient rendering

Avoid unnecessary client-side JavaScript.

---

# Code Quality

Every contribution should:

* pass linting
* pass type checking
* compile successfully
* avoid dead code
* avoid duplication
* use descriptive naming

Readable code is preferred over clever code.

---

# Error Handling

Never fail silently.

Provide:

* useful logs
* graceful fallbacks
* descriptive errors
* recovery paths

---

# Documentation

Whenever architecture changes:

Update documentation first.

Then update implementation.

Documentation should never become stale.

---

# Pull Request Checklist

Before considering work complete, verify:

* Implementation matches roadmap.
* Design System followed.
* UX Guidelines respected.
* Components reused.
* Accessibility maintained.
* Performance preserved.
* Types are correct.
* No unnecessary dependencies added.
* Documentation updated where required.

---

# Communication Style

When collaborating:

Explain reasoning before implementation.

State assumptions explicitly.

Highlight trade-offs.

Recommend alternatives when appropriate.

Ask questions instead of making uncertain architectural decisions.

---

# Things to Avoid

Do not:

* over-engineer
* prematurely optimize
* introduce abstractions without repetition
* create generic utilities without a clear need
* ignore documentation
* make breaking architectural changes without approval

---

# Definition of Success

Success is not measured by lines of code.

Success is measured by how faithfully the implementation reflects the engineering philosophy documented in this repository.

Every commit should make the platform more maintainable, more understandable, and more valuable to future readers.

