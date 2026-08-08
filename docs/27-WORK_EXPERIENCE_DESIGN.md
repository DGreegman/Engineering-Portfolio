# 27 — Work Experience Design

---

## Purpose

This document defines the experience, information architecture, navigation model, and design philosophy for the Work section of the Engineering Workspace.

Unlike implementation plans, this document focuses on the reader's journey rather than technical implementation.

Its purpose is to define how engineering work should be experienced, ensuring future implementation remains consistent with the philosophy established in the Engineering Workspace.

The Work experience answers one question:

> **How does this engineer solve engineering problems?**

---

# Design Philosophy

The Work section is not a portfolio.

It is not a gallery.

It is not a product showcase.

It is an engineering case study library.

Readers should experience engineering decisions rather than project promotion.

The emphasis should remain on:

- engineering thinking
- architectural reasoning
- implementation strategy
- trade-offs
- validation
- lessons learned

Every design decision should support learning.

---

# Experience Goals

The Work experience should allow readers to:

- understand engineering problems
- follow architectural reasoning
- explore implementation decisions
- connect practical work to engineering concepts
- navigate naturally between projects and knowledge

Readers should finish each case study understanding **why** decisions were made rather than simply **what** was built.

---

# Information Architecture

The Work Landing experience follows this narrative.

```
Engineering Work

↓

Engineering Philosophy

↓

Featured Case Studies

↓

Architecture Highlights

↓

Project Library

↓

Engineering Lessons
```

Each section answers one question.

---

## Engineering Philosophy

Question answered:

> How does this engineer approach software engineering?

This section introduces engineering values rather than professional history.

---

## Featured Case Studies

Question answered:

> Which engineering work best represents this workspace?

Selection should emphasize:

- architectural depth
- engineering complexity
- educational value

---

## Architecture Highlights

Question answered:

> Which engineering themes appear across multiple projects?

Examples include:

- scalability
- distributed systems
- API design
- security
- observability
- performance

These themes provide another way to explore engineering work.

---

## Project Library

Question answered:

> What engineering work is available?

Projects should remain concise.

Detailed discussion belongs inside individual case studies.

---

## Engineering Lessons

Question answered:

> What reusable engineering knowledge emerged?

Lessons should connect naturally to the Knowledge Library.

---

# Case Study Experience

Every case study follows the same reading journey.

```
Breadcrumb

↓

Project Header

↓

Executive Summary

↓

Problem

↓

Constraints

↓

Requirements

↓

Architecture

↓

Engineering Decisions

↓

Implementation

↓

Validation

↓

Trade-offs

↓

Outcome

↓

Lessons Learned

↓

Related Knowledge

↓

Related Engineering Logs

↓

Previous / Next Case Study
```

Every section answers a specific question.

Readers should never wonder why information appears in a particular order.

---

# Navigation

Readers should be able to explore work from multiple perspectives.

Examples include:

- Engineering Domain
- Architecture
- Technology
- Project
- Related Knowledge
- Engineering Logs

Navigation should encourage exploration rather than overwhelm.

---

# Relationship with the Knowledge Library

The Knowledge Library explains engineering concepts.

The Work section demonstrates those concepts applied.

```
Knowledge

↓

Concept

↓

Application

↓

Engineering Work

↓

Experience
```

Articles and Case Studies should reference each other wherever appropriate.

---

# Relationship with Engineering Logs

Engineering Logs capture discovery.

Case Studies capture completed engineering work.

```
Engineering Log

↓

Experiment

↓

Discovery

↓

Case Study

↓

Engineering Outcome
```

Logs explain the journey.

Case Studies explain the destination.

---

# Visual Hierarchy

Visual emphasis should follow engineering importance.

Highest emphasis:

- Problem
- Architecture
- Engineering Decisions

Secondary emphasis:

- Implementation
- Validation
- Trade-offs

Supporting information:

- Metadata
- Technologies
- Timeline
- Repository

Readers should always focus on engineering reasoning before implementation details.

---

# Design Principles

The Work section should resemble:

- architecture documentation
- technical design reviews
- engineering notebooks
- system documentation

It should avoid resembling:

- startup landing pages
- marketing websites
- portfolio galleries
- product showcases

The engineering story remains the primary focus.

---

# Scalability

The experience should remain effective whether the workspace contains:

- 5 projects
- 25 projects
- 100 projects

Adding projects should never require structural redesign.

---

# Accessibility

Every experience should support:

- semantic structure
- keyboard navigation
- responsive layouts
- readable typography
- accessible diagrams
- meaningful navigation

Engineering depth should never reduce usability.

---

# Definition of Done

The Work experience is complete when it:

- demonstrates engineering thinking clearly
- prioritizes architecture over promotion
- supports long-form engineering case studies
- integrates naturally with the Knowledge Library
- connects with Engineering Logs
- scales without redesign
- remains consistent with the Engineering Workspace philosophy

Success is measured by whether readers understand **how engineering decisions were made**.

---

# Future Evolution

Future enhancements may include:

- interactive architecture diagrams
- ADR (Architecture Decision Record) views
- deployment timelines
- infrastructure visualizations
- engineering metrics
- system evolution history

Future features should extend the existing experience rather than redefine it.

---

# Summary

The Work experience transforms software projects into engineering documentation.

Rather than showcasing products, it documents engineering thinking.

Projects become evidence.

Engineering decisions become the story.

The result is an experience that teaches engineering through real-world systems while remaining consistent with the philosophy of the Engineering Workspace.