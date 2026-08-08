# 22 — Component Architecture

---

## Purpose

This document defines the architectural patterns, rendering strategy, component relationships, and engineering principles that underpin the Engineering Workspace.

Unlike implementation plans, this document does not describe individual features or tasks. Instead, it explains how the system is designed, why specific architectural decisions were made, and how future development should extend the existing architecture.

Its purpose is to preserve architectural consistency as the Engineering Workspace evolves.

---

# Architectural Philosophy

The Engineering Workspace is designed as a documentation-first engineering platform rather than a traditional developer portfolio.

The architecture prioritizes:

- Documentation before implementation
- Explicit engineering decisions
- Long-term maintainability
- Server-first rendering
- Composition over duplication
- Clear separation of responsibilities
- Knowledge as the primary product

Every implementation should strengthen the architecture rather than introduce parallel solutions.

The goal is not simply to build pages, but to build an engineering system capable of supporting years of technical writing and continuous evolution.

---

# Architectural Layers

The Engineering Workspace is organized into four architectural layers.

```
Engineering Workspace

├── Content Layer
├── Resolution Layer
├── Presentation Layer
└── Interaction Layer
```

Each layer has a single responsibility.

Responsibilities should never overlap.

---

# Content Layer

## Responsibility

The Content Layer owns engineering knowledge.

It defines:

- MDX documents
- Frontmatter
- Collections
- Schemas
- Metadata
- Knowledge relationships

This layer defines **what** information exists.

It never decides how information should be rendered.

### Owns

- Content
- Metadata
- Relationships
- Validation

### Does Not Own

- Layout
- Styling
- Navigation
- Interaction

---

# Resolution Layer

## Responsibility

The Resolution Layer transforms raw content into structured information ready for presentation.

Examples include:

- Metadata resolution
- Topic resolution
- Relationship resolution
- Heading extraction
- Syntax highlighting

Presentation components consume resolved data rather than interpreting raw content.

This creates a single source of truth for every piece of derived information.

---

## Principle

Resolve once.

Reuse everywhere.

No presentation component should perform its own metadata or relationship resolution.

---

# Presentation Layer

## Responsibility

The Presentation Layer renders information.

It receives resolved data and displays it using the design system.

Examples include:

- Document Layout
- Document Header
- Breadcrumb
- Code Block
- Callout
- Related Learning
- Previous / Next

Presentation components never read MDX directly and never perform business logic.

---

# Interaction Layer

## Responsibility

The Interaction Layer exists only when browser capabilities are required.

The default rendering model is the Server Component.

Client Components are introduced only when browser APIs cannot be accessed on the server.

Current client boundaries:

- Copy Button (Clipboard API)
- Active Section Tracker (Intersection Observer)

All remaining article functionality is server-rendered.

---

# Rendering Pipeline

Every Engineering Article follows the same rendering pipeline.

```
MDX Document
        │
        ▼
Schema Validation
        │
        ▼
Metadata Resolution
        │
        ▼
Relationship Resolution
        │
        ▼
Heading Extraction
        │
        ▼
Syntax Highlighting
        │
        ▼
MDX Component Mapping
        │
        ▼
Document Layout
        │
        ▼
Reader
```

Each stage performs one responsibility before handing control to the next.

---

# Component Composition

Components are intentionally designed around composition rather than specialization.

Preferred pattern:

```
Component

↓

Configuration

↓

Presentation
```

Examples include:

- Callout
- Document Layout
- Code Block

Avoid creating multiple components that differ only by styling or configuration.

Configuration should determine behaviour wherever practical.

---

# Navigation Architecture

The Engineering Workspace intentionally separates navigation into two independent systems.

## Reading Navigation

Purpose:

Help readers navigate within a document.

Examples:

- Table of Contents
- Heading IDs
- Active Section Tracking

Reading Navigation is page-local.

---

## Knowledge Navigation

Purpose:

Help readers navigate between engineering concepts.

Examples:

- Related Learning
- Previous / Next

Knowledge Navigation is document-level.

These two systems intentionally solve different problems and should remain independent.

---

# Knowledge Architecture

Knowledge relationships are explicitly authored.

The system does not infer relationships through recommendation algorithms.

Supported relationships include:

- Topic
- Series
- Prerequisites
- Related Concepts

This explicit model enables predictable learning paths while remaining extensible for future typed knowledge graph relationships.

---

# Design System Integration

Architecture and presentation remain independent.

The Design System owns:

- Typography
- Color
- Spacing
- Borders
- Visual hierarchy

The Content Layer owns:

- Semantics
- Relationships
- Metadata
- Knowledge structure

Neither layer should assume responsibilities belonging to the other.

---

# Reusable Architectural Patterns

Several architectural patterns emerged during implementation and should guide future development.

## Single Source of Truth

Derived information should have one authoritative resolver.

Multiple consumers may reuse the resolved output.

---

## Resolve Once, Render Many

Metadata and relationships are resolved once and shared throughout the rendering pipeline.

Repeated resolution introduces inconsistency and unnecessary complexity.

---

## Configuration Over Duplication

Reusable components should be configured through variants rather than duplicated.

Examples include:

- Callouts
- Code Blocks
- Document Layout

---

## Server-First Rendering

Server Components are the default.

Client Components require explicit justification.

---

## Explicit Knowledge Relationships

Engineering concepts are connected intentionally rather than inferred automatically.

Learning paths are authored, not generated.

---

# Architectural Anti-patterns

Future development should avoid introducing:

- Duplicate metadata resolution
- Duplicate relationship resolution
- Duplicate document parsing
- Client-first rendering
- Presentation components reading raw content
- Multiple sources of truth
- Feature-specific abstractions
- UI driving architecture

Architectural consistency takes precedence over local convenience.

---

# Extension Guidelines

Future features should integrate through existing architectural seams wherever possible.

Examples include:

- New MDX components
- Additional relationship types
- Reading progress
- Search
- Annotations
- AI-assisted navigation

Existing architecture should be extended before new abstractions are introduced.

---

# Architecture Summary

The Engineering Workspace is a documentation-first, server-first engineering platform.

Content owns semantics.

Resolvers own interpretation.

Presentation owns rendering.

Interaction is introduced only when browser capabilities require it.

This separation enables a maintainable, extensible architecture capable of supporting long-term engineering documentation.

```
Knowledge
      │
      ▼
Content
      │
      ▼
Resolution
      │
      ▼
Presentation
      │
      ▼
Interaction
      │
      ▼
Reader
```

---

# Appendix — Architectural Decisions Validated During Milestone 4

| Decision | Validated Through |
|----------|-------------------|
| Documentation-first workflow | Entire Milestone 4 implementation process |
| Server-first rendering | Engineering Article Experience |
| Single source of truth | Metadata, TOC, and Relationship resolution |
| Resolve once, render many | Document Header, Related Learning, Previous / Next |
| Configuration over duplication | Callouts, Code Blocks, Document Layout |
| Minimal client boundaries | Copy Button and Active Section Tracker |
| Explicit knowledge relationships | Related Learning and Previous / Next |
| Composition over specialization | MDX component architecture |

Milestone 4 demonstrated that these architectural decisions scale across a complete documentation system and should remain the foundation for future development.