# ADR-005: Git and GitHub Workflow

## Status

Accepted

## Context

The system is developed collaboratively through Git and GitHub, requiring a consistent workflow for version control, feature development, code review, and integration.

The workflow must keep the `main` branch stable, provide a controlled environment for integrating changes, and allow features, fixes, refactors, and documentation changes to be developed independently.

## Decision

The system will use Git for version control and GitHub as the primary platform for repository management, pull requests, issue tracking, and project collaboration.

The repository will use the following primary branches:

```text
main
└── develop
    ├── feature/*
    ├── fix/*
    ├── refactor/*
    └── docs/*
```

### Main

The `main` branch represents the stable version of the system.

Changes should reach `main` through controlled merges from `develop` and should represent versions that are considered ready for release.

Direct development on `main` is not permitted.

### Develop

The `develop` branch is the main integration branch for ongoing development.

Completed work from feature, fix, refactor, and documentation branches is integrated into `develop` through pull requests.

### Feature Branches

Feature branches are used to develop new functionality.

Naming convention:

```text
feature/<description>
```

Example:

```text
feature/refresh-token-model
```

### Fix Branches

Fix branches are used to correct defects or unexpected behavior.

Naming convention:

```text
fix/<description>
```

### Refactor Branches

Refactor branches are used for structural or code-quality improvements that do not primarily introduce new functionality.

Naming convention:

```text
refactor/<description>
```

### Documentation Branches

Documentation branches are used for documentation changes that are developed independently from application functionality.

Naming convention:

```text
docs/<description>
```

## Pull Requests

Changes should be integrated through pull requests rather than direct pushes to protected branches.

Pull requests should:

- Have a clear title describing the change.
- Explain the purpose and scope of the changes.
- Reference the related issue.
- Use the appropriate labels.
- Be reviewed before merging when applicable.
- Pass the required automated checks.

When a pull request completes an issue, the description should reference the issue using GitHub's closing syntax:

```text
Closes #<issue-number>
```

The corresponding issue should also be linked through the pull request's **Development** section.

## Commits

Commit messages should follow a consistent conventional format.

The general structure is:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(auth): add refresh token model
fix(auth): validate refresh token expiration
refactor(api): reorganize service layer
docs: add system diagrams
chore: update dependencies
```

Common commit types include:

- `feat` — new functionality.
- `fix` — bug fixes.
- `refactor` — code restructuring without changing behavior.
- `docs` — documentation changes.
- `test` — test-related changes.
- `chore` — maintenance and tooling changes.

Commit messages should describe the actual purpose of the change and avoid unnecessary detail.

## Workflow

The standard development workflow is:

```text
Issue
  ↓
Project / Sprint
  ↓
Create branch from develop
  ↓
Develop
  ↓
Commit changes
  ↓
Push branch
  ↓
Open Pull Request
  ↓
CI checks
  ↓
Review
  ↓
Merge into develop
  ↓
Issue → Done
```

Release work follows the established project release process, with `main` representing the stable release state.

## Rationale

This workflow provides a clear separation between stable code, ongoing integration, and isolated development work.

Feature-based branches reduce the risk of unrelated changes being mixed together, while pull requests provide a controlled integration point and connect implementation work with project management.

Using consistent commit and branch naming also makes the repository history easier to understand and maintain.

## Alternatives Considered

### Direct development on develop

Rejected because it would make it easier to introduce incomplete or unrelated changes into the integration branch.

### Direct development on main

Rejected because `main` must remain stable and represent the released state of the system.

### Git Flow with additional release and hotfix branches

Considered but rejected for the current project because the additional branch types would introduce process complexity without providing sufficient benefit at the current scale.

## Consequences

### Positive

- Clear separation between stable and ongoing development.
- Isolated development of individual changes.
- Traceability between issues, branches, commits, and pull requests.
- More predictable integration process.
- Cleaner Git history.
- Easier collaboration and code review.

### Negative

- Requires additional branch and pull request management.
- Small changes may require more steps than direct development.
- Developers must follow the established naming and workflow conventions.

## Related Decisions

- [ADR-002: Monorepo Architecture](./002-monorepo-architecture.md)
- [ADR-008: Branch Protection](./008-branch-protection.md)
- [ADR-009: Continuous Integration with GitHub Actions](./009-continuous-integration-with-github-actions.md)
