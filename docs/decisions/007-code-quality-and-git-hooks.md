# ADR-007: Code Quality and Git Hooks

## Status

Accepted

## Context

The system requires consistent code quality standards across the frontend and backend applications.

As the project grows, manually maintaining formatting, linting, and validation standards becomes increasingly error-prone. The development workflow should therefore automate these checks as close as possible to the point where changes are introduced.

The solution should improve consistency without creating unnecessary development overhead.

## Decision

The system will use **ESLint**, **Prettier**, **Husky**, and **lint-staged** as the primary local code-quality and pre-commit tooling.

These tools will have separate but complementary responsibilities:

```text
Code changes
    ↓
lint-staged
    ↓
ESLint + Prettier
    ↓
Commit
```

## ESLint

ESLint will be used for static analysis and identification of potential problems in the codebase.

It will enforce project-specific JavaScript and TypeScript rules and help identify issues before code is committed or integrated.

ESLint will be configured according to the requirements of the frontend and backend applications.

## Prettier

Prettier will be used as the project's code formatter.

Its purpose is to provide consistent formatting automatically rather than relying on individual developer preferences.

Prettier will be responsible for formatting supported source and configuration files.

## Husky

Husky will be used to manage Git hooks.

The project will use Git hooks to automatically execute relevant validation before changes are committed.

The primary hook will be the `pre-commit` hook.

## lint-staged

lint-staged will be used to run formatting and linting only against files that are staged for commit.

This avoids unnecessarily processing the entire codebase for every commit while ensuring that modified files are checked before entering the repository history.

The intended flow is:

```text
git add
   ↓
git commit
   ↓
Husky pre-commit hook
   ↓
lint-staged
   ├── Prettier
   └── ESLint
   ↓
Commit accepted
```

If a required check fails, the commit should be prevented until the issue is resolved.

## Scope

These tools are intended primarily for local development and pre-commit validation.

More comprehensive validation, including type checking and CI-specific checks, will be handled by the project's GitHub Actions workflow.

## Rationale

Automating formatting and linting at commit time reduces the chance of inconsistent or invalid code entering the repository.

Using `lint-staged` keeps the pre-commit process efficient by limiting checks to files affected by the commit.

Husky provides a consistent mechanism for enforcing these checks regardless of which developer performs the commit.

Separating local checks from CI checks also keeps each layer focused on its purpose: fast feedback locally and comprehensive validation in the integration workflow.

## Alternatives Considered

### Manual linting and formatting

Rejected because it depends entirely on developer discipline and increases the likelihood of inconsistent code entering the repository.

### Running ESLint and Prettier against the entire repository on every commit

Rejected because it would unnecessarily increase commit time as the project grows.

### CI-only validation

Rejected because developers would receive feedback only after pushing their changes, making simple formatting and linting issues slower to resolve.

## Consequences

### Positive

- Consistent code formatting.
- Automated linting before commits.
- Faster feedback during development.
- Reduced formatting noise in pull requests.
- Only staged files are processed by lint-staged.
- Clear separation between local validation and CI validation.

### Negative

- Git hooks add a small amount of overhead to the commit process.
- Developers must maintain the local tooling configuration.
- Incorrect hook or lint-staged configuration can prevent commits until the configuration is corrected.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies.md)
- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-009: Continuous Integration with GitHub Actions](./009-continuous-integration-with-github-actions.md)
