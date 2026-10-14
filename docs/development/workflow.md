# Development Workflow

This document describes the development workflow used to implement and integrate changes into the project.

## Development Flow

Development work generally follows this sequence:

```text
Issue
  ↓
Feature Branch
  ↓
Implementation
  ↓
Validation
  ↓
Pull Request
  ↓
Code Review
  ↓
develop
```

Changes are developed incrementally and integrated through pull requests.

## Issues

Each significant piece of work should be represented by a GitHub Issue.

Issues should describe:

- The functionality or change to be implemented.
- The expected behavior.
- Acceptance criteria.
- Relevant technical considerations when necessary.

Issues should remain focused on a specific piece of work rather than combining unrelated changes.

## Branches

The project uses the following branch types:

```text
main
develop
feature/*
fix/*
hotfix/*
release/*
```

### Main Branches

`main` represents the stable project branch.

`develop` is the main integration branch for ongoing development.

Feature work should normally be integrated into `develop` before eventually reaching `main`.

### Feature Branches

New functionality is developed in branches using the `feature/*` convention.

Example:

```bash
git switch develop
git pull
git switch -c feature/project-list
```

### Fix Branches

`fix/*` branches are used for corrections to existing functionality.

Example:

```text
fix/refresh-token-validation
```

### Hotfix Branches

`hotfix/*` branches are intended for urgent corrections to stable functionality.

Example:

```text
hotfix/authentication-error
```

### Release Branches

`release/*` branches can be used when preparing a release.

Example:

```text
release/1.0.0
```

## Pull Requests

Completed work is integrated through a pull request.

Feature pull requests normally target `develop`.

A pull request should:

- Clearly describe the implemented change.
- Reference the related GitHub Issue.
- Include `Closes #<issue-number>` when the pull request completes the issue.
- Describe relevant validation or testing performed.
- Keep the scope focused on the associated issue.

## Validation

Before opening a pull request, the implementation should be validated locally.

Depending on the change, this may include:

- Running the application.
- Testing API endpoints.
- Running linting.
- Running type checking.
- Running the build.
- Verifying the acceptance criteria.

The validation performed should be appropriate to the change being submitted.

## Integration

After review and approval, the pull request can be merged into `develop`.

The integration branch should remain in a working state so that subsequent feature work can be based on a stable development baseline.

## Related Documentation

- [Code Quality](./code-quality.md) — Code quality and Git hook practices.
- [Architecture Decisions](../decisions/005-git-and-github-workflow.md) — Git and GitHub workflow decisions.
- [Issue Management](../decisions/011-issue-management.md) — Issue management decisions.
- [Sprint Management](../decisions/012-sprint-management.md) — Sprint organization decisions.
