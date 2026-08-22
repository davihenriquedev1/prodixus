# ADR-009: Continuous Integration with GitHub Actions

## Status

Accepted

## Context

The system uses pull requests as the primary mechanism for integrating changes into the protected `develop` and `main` branches.

A continuous integration process is required to automatically validate changes before they are merged, reducing the risk of introducing code that does not meet the project's technical requirements.

The CI process should provide fast and consistent feedback while remaining proportional to the current project scope.

## Decision

The system will use **GitHub Actions** as its continuous integration platform.

CI workflows will automatically validate changes submitted through the repository's development workflow.

The CI workflow is triggered by pushes and pull requests targeting the primary integration branches:

```text
Push / Pull Request
        ↓
GitHub Actions
        │
        ├── Frontend
        │     ├── Install dependencies
        │     ├── Lint
        │     ├── TypeCheck
        │     └── Build
        │
        └── Backend
              ├── Install dependencies
              ├── Lint
              ├── TypeCheck
              └── Build
```

The exact checks may evolve as the system grows, but the CI workflow must remain focused on validating the integrity of the applications rather than performing deployment responsibilities.

## Pull Request Validation

Pull requests targeting protected branches must pass the required CI checks before they can be merged.

The primary integration branches are:

```text
develop
main
```

CI therefore acts as an automated quality gate between development branches and protected branches.

## Scope

The CI workflow is responsible for automated validation such as:

- Installing dependencies using `npm ci`.
- Running ESLint.
- Running TypeScript type checking.
- Building the frontend application.
- Building the backend application.

Automated tests are not currently part of the CI workflow and may be introduced as the project's test suite evolves.

Deployment is considered a separate concern and is not part of the initial CI decision.

## Rationale

GitHub Actions was chosen because it is directly integrated with the repository hosted on GitHub and provides sufficient automation capabilities for the project's current requirements.

Automating validation through CI prevents developers from relying exclusively on local tooling and ensures that changes are evaluated in a consistent environment.

Maintaining separate frontend and backend jobs allows each application to be validated according to its own dependencies and build requirements.

Separating CI from deployment also keeps the initial workflow simple and avoids introducing unnecessary release automation before it is required.

## Alternatives Considered

### Manual validation

Rejected because it depends on developers consistently performing all required checks before opening or merging pull requests.

### Local validation only

Rejected because local environments may differ and local checks can be skipped or incorrectly configured.

### External CI platform

Considered but rejected because GitHub Actions provides the required functionality without introducing another external service or configuration layer.

## Consequences

### Positive

- Automated validation of pull requests.
- Consistent checks across contributors.
- Reduced risk of broken code reaching protected branches.
- Integration with GitHub branch protection.
- Independent validation of frontend and backend applications.
- Centralized CI configuration in the repository.
- Easy visibility of validation results directly in pull requests.

### Negative

- CI execution adds time before a pull request can be merged.
- Workflow configuration must be maintained.
- CI failures may require additional debugging outside the local development environment.
- More comprehensive CI pipelines may require additional infrastructure as the system grows.

## Related Decisions

- [ADR-005: Git and GitHub Workflow](./005-git-and-github-workflow.md)
- [ADR-007: Code Quality and Git Hooks](./007-code-quality-and-git-hooks.md)
- [ADR-008: Branch Protection](./008-branch-protection.md)
