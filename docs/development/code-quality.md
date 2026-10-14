# Code Quality

This document describes the tools and practices used to maintain code quality and consistency across the project.

## Formatting

The project uses **Prettier** for consistent code formatting.

Formatting configuration is maintained at the repository level so that frontend and backend code follow the same general formatting standards.

Code should be formatted before being committed.

## Linting

The project uses **ESLint** to identify potential problems and enforce code-quality rules.

Frontend and backend applications maintain their own ESLint configuration according to their respective technologies.

Linting should be executed before submitting changes for review.

## Type Checking

TypeScript is used throughout the frontend and backend.

Type checking is part of the project's validation process and helps detect type-related problems before changes are integrated.

## Git Hooks

The project uses **Husky** to run automated checks during Git operations.

The repository also uses **lint-staged** to apply configured checks to files staged for commit.

This provides an additional quality gate before changes are committed.

## Continuous Integration

GitHub Actions runs automated validation for pushes and pull requests targeting the main development branches.

The CI pipeline includes:

```text
Lint
  ↓
Type Check
  ↓
Build
```

Changes should pass the CI pipeline before being integrated.

## Code Quality Principles

The project follows a few practical principles:

- Keep implementations simple and focused.
- Avoid unnecessary abstractions.
- Keep responsibilities separated.
- Prefer clear and maintainable code over unnecessary complexity.
- Validate data at the appropriate application boundaries.
- Keep business logic in the service layer.
- Keep database access in the repository layer.
- Do not bypass established security and ownership boundaries.
- Do not commit secrets or sensitive configuration.

## Local Validation

Before opening a pull request, the developer should run the appropriate checks locally.

Typical validation includes:

```bash
npm run lint
npm run typecheck
npm run build
```

The exact command should be executed from the appropriate application or repository context according to the project's scripts.

## Related Documentation

- [Development Workflow](./workflow.md) — Development and pull request workflow.
- [Development Setup](./setup.md) — Local environment setup.
- [Architecture Documentation](../architecture/README.md) — Application architecture.
- [Security Documentation](../security/README.md) — Security practices.
- [CI Decision](../decisions/009-continuous-integration-with-github-actions.md) — Continuous integration decision.
- [Code Quality Decision](../decisions/007-code-quality-and-git-hooks.md) — Code quality and Git hook decisions.
