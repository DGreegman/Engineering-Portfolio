# 11 — Content Model

> Defining the knowledge graph that powers the Engineering Portfolio.

---

# Purpose

This document defines the logical content model for the Engineering Portfolio.

It is independent of implementation details such as MDX, databases, or file storage.

Its purpose is to establish a consistent structure for representing engineering knowledge and the relationships between different pieces of content.

---

# Design Philosophy

The portfolio is not a collection of blog posts.

It is a connected engineering knowledge base.

Every piece of content is treated as a **Knowledge Node**.

Different content types exist to communicate information differently, but they all participate in the same knowledge graph.

---

# Core Model

```text
Knowledge Node

├── Identity
│   ├── id
│   ├── slug
│   ├── title
│   └── description
│
├── Classification
│   ├── type
│   ├── status
│   ├── visibility
│   └── featured
│
├── Content
│   ├── body
│   ├── summary
│   └── excerpt
│
├── Metadata
│   ├── author
│   ├── publishedAt
│   ├── updatedAt
│   ├── readingTime
│   ├── difficulty
│   └── coverImage
│
├── Organization
│   ├── technologies
│   ├── tags
│   ├── series
│   └── categories
│
├── Relationships
│   ├── prerequisites
│   ├── related
│   ├── references
│   ├── inspiredBy
│   └── usedIn
│
└── SEO
    ├── title
    ├── description
    └── keywords
```

---

# Knowledge Types

Every node belongs to one content type.

---

## Evergreen Knowledge

Purpose:

Teach engineering concepts that remain useful over time.

Examples:

* API Idempotency
* Database Pooling
* Saga Pattern
* Rate Limiting
* CQRS
* Event Sourcing

Characteristics:

* Frequently updated
* Long lifespan
* Educational
* Reference material

---

## Engineering Log

Purpose:

Document personal engineering discoveries.

Examples:

* Migrating from Node.js to Go
* Lessons from implementing retries
* Performance experiments
* Debugging production issues

Characteristics:

* Chronological
* Personal
* Reflective
* Practical

---

## Case Study

Purpose:

Explain how a real engineering problem was solved.

Structure:

Problem

↓

Constraints

↓

Decision

↓

Implementation

↓

Trade-offs

↓

Outcome

Case studies focus on engineering thinking rather than showcasing screenshots.

---

## Series

Purpose:

Group multiple related nodes.

Examples:

* Backend Fundamentals
* System Design
* Security Engineering

Series define structured learning journeys.

---

## Resource

Purpose:

Collect useful external references.

Examples:

* Books
* RFCs
* Documentation
* Research Papers
* Videos

Resources complement first-party content without duplicating it.

---

# Relationships

Relationships are the foundation of discovery.

Every node may connect to other nodes.

---

## Prerequisites

Concepts readers should understand beforehand.

Example:

Distributed Transactions

↓

Requires

↓

Database Transactions

↓

Distributed Systems

---

## Related

Conceptually similar topics.

Example:

Redis

↓

Caching

↓

Pub/Sub

↓

Distributed Locks

---

## Used In

Shows where a concept is applied.

Example:

Redis

Used In:

* Rate Limiting
* Session Storage
* Queues
* Leader Election

---

## References

Links to authoritative external material.

Examples:

* RFCs
* Official Documentation
* Academic Papers

---

## Inspired By

Acknowledges influential sources or ideas where appropriate.

---

# Technology Model

Technologies are reusable entities rather than plain text.

Example:

```text
Technology

Name

Slug

Description

Category

Official Website

Logo

Color (optional)

Related Nodes
```

Example technologies:

* Go
* TypeScript
* PostgreSQL
* Docker
* Redis
* Kubernetes

---

# Tag Model

Tags represent concepts rather than technologies.

Examples:

* Performance
* Security
* Architecture
* APIs
* Databases
* Scalability

Tags power filtering and discovery.

---

# Category Model

Categories provide broad organizational structure.

Examples:

* Backend
* System Design
* Security
* Cloud
* DevOps
* Databases

Categories should remain stable over time.

---

# Series Model

A series is an ordered collection of knowledge nodes.

Fields:

* title
* description
* slug
* order
* cover
* related technologies

Series provide guided learning paths.

---

# Author Model

Initially supports a single author.

Future expansion should allow multiple authors without redesigning the schema.

Fields:

* name
* role
* bio
* avatar
* social links

---

# Navigation Model

Navigation is generated from the content graph rather than maintained manually.

Examples:

Knowledge

↓

Backend

↓

API Design

↓

Idempotency

↓

Related Topics

This ensures the site grows organically.

---

# Search Model

Search indexes:

* titles
* summaries
* body
* technologies
* tags
* categories
* series

Results should prioritize relevance over recency.

---

# Reading Paths

A Reading Path is a curated sequence of knowledge nodes.

Example:

Backend Fundamentals

↓

HTTP

↓

REST

↓

Authentication

↓

Authorization

↓

Rate Limiting

↓

Caching

↓

Queues

↓

Distributed Systems

Readers can move from beginner to advanced concepts naturally.

---

# Metadata Standards

Every node should include:

* title
* slug
* description
* type
* status
* published date
* updated date
* reading time
* difficulty
* technologies
* tags

Metadata powers automation across the platform.

---

# URL Philosophy

URLs should remain permanent.

Examples:

/knowledge/api-idempotency

/work/vaultpay

/engineering-log/learning-go-concurrency

Changing URLs should be avoided to preserve references and SEO.

---

# Future Extensions

The model should support:

* multilingual content
* bookmarks
* comments
* version history
* interactive tutorials
* AI-generated summaries
* graph visualization
* public API
* offline reading

Future features should extend the model rather than replace it.

---

# Content Model North Star

Knowledge should behave like a connected system rather than isolated articles.

Every new node should strengthen the network by creating meaningful relationships that help engineers discover, understand, and apply ideas.

