# Contributing

Thank you for your interest in contributing.

Although this project currently has a single maintainer, contributions are welcome and should follow the same engineering standards used throughout the repository.

## Development Philosophy

Contributions should prioritize:

* Readability
* Maintainability
* Accessibility
* Performance
* Simplicity

Every change should improve the project without introducing unnecessary complexity.

## Before You Start

1. Read the documentation in `/docs`.
2. Review `AGENT.md` if you're using an AI coding assistant.
3. Understand the current milestone from the Implementation Roadmap.

## Pull Requests

Every pull request should:

* Focus on a single concern.
* Include a clear description of the change.
* Follow the documented architecture.
* Reuse existing components where possible.
* Pass linting and type checking.
* Preserve accessibility and performance.

## Documentation

If a change affects architecture, workflows, or engineering decisions, update the relevant documentation as part of the same pull request.

## Code Style

* Use TypeScript.
* Prefer descriptive names.
* Avoid premature abstraction.
* Write composable components.
* Keep files focused on a single responsibility.

## Commit Messages

Commits should follow this format:

```
type(scope): summary
```

Examples:

* `feat(content): add MDX loader`
* `docs(architecture): update content engine decision`
* `fix(search): handle missing metadata`

Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `test`.

This convention is a consistency guideline, not an enforced rule — there is
no commit linter. Use judgment; a clear, well-scoped commit message matters
more than strict adherence to the format.

## Local Quality Gates

A pre-commit hook (Husky + lint-staged) automatically runs Prettier and
ESLint (`--fix`) on staged files before each commit. It only touches files
you've staged, so it stays fast — it does not lint, format, or build the
whole project. Full-project checks (`lint`, `typecheck`, `build`) run in CI.

If a hook needs to be skipped in an emergency, `git commit --no-verify` — but
prefer fixing the underlying issue.

## Reporting Issues

When reporting bugs, include:

* Expected behavior
* Actual behavior
* Steps to reproduce
* Screenshots (if applicable)
* Environment details

Thank you for helping maintain a high-quality engineering knowledge platform.

