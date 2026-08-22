# ADR-008: Branch Protection

## Status

Accepted

## Context

The system uses `main` and `develop` as the primary integration branches. Both branches have different responsibilities and should not be modified through uncontrolled direct pushes.

The repository therefore requires protection rules to prevent accidental changes, ensure that automated checks are respected, and maintain a controlled pull request workflow.

## Decision

The `main` and `develop` branches will be protected through GitHub branch protection rules.

Changes to these branches must be integrated through pull requests rather than direct pushes.

### Main

The `main` branch represents the stable version of the system and will have the strictest protection rules.

The following requirements apply:

- Direct pushes are prohibited.
- Changes must be introduced through pull requests.
- Required CI checks must pass before merging.
- Branches must be up to date with the target branch when required by repository settings.
- Force pushes are prohibited.
- Branch deletion is prohibited.

### Develop

The `develop` branch is the main integration branch for ongoing development.

The following requirements apply:

- Direct pushes are prohibited.
- Changes must be introduced through pull requests.
- Required CI checks must pass before merging.
- Force pushes are prohibited.
- Branch deletion is prohibited.

## Pull Request Workflow

The protection rules enforce the following general workflow:

```text id="1s1s5g"
Feature / Fix / Refactor / Docs
              │
              ▼
        Pull Request
              │
              ▼
        GitHub Actions
              │
              ▼
       Required checks
              │
              ▼
            Merge
              │
              ▼
       develop / main
```

Pull requests are therefore the controlled integration mechanism for protected branches.

## Rationale

Branch protection reduces the risk of accidentally introducing broken, incomplete, or unreviewed changes into the main integration branches.

Requiring CI checks before merging also ensures that the automated validation defined by the project is part of the integration process rather than an optional step.

Protecting both `main` and `develop` provides different levels of stability while preserving the branch strategy defined by the project.

## Alternatives Considered

### Allowing direct pushes to develop

Rejected because `develop` is the integration branch and should only receive changes that have passed the project's validation workflow.

### Protecting only main

Rejected because changes merged directly into `develop` could bypass the same quality controls before reaching the release branch.

### Allowing force pushes

Rejected because rewriting the history of shared integration branches can remove commits and make collaboration more difficult.

## Consequences

### Positive

- Protected integration branches.
- Reduced risk of accidental changes.
- CI becomes part of the merge process.
- Consistent pull request workflow.
- More reliable repository history.
- Stable `main` branch.

### Negative

- Even small changes require the pull request workflow.
- CI failures can block merges until they are resolved.
- Additional repository configuration must be maintained.

## Related Decisions

- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-007: Code Quality and Git Hooks](./007-code-quality-and-git-hooks.md)
- [ADR-009: Continuous Integration with GitHub Actions](./009-continuous-integration-with-github-actions.md)
