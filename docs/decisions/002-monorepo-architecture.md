# ADR-002: Monorepo Architecture

## Status

Accepted

## Context

The system consists of a frontend application and a backend API that are developed as part of the same product.

Keeping these applications in separate repositories would require additional repository management and make it more difficult to maintain consistency between frontend and backend changes.

The project also requires independent application structures while sharing the same development workflow, version control, documentation, and CI/CD configuration.

## Decision

The system will use a **monorepo architecture**, with the frontend and backend maintained within the same Git repository.

The repository will organize the applications separately:

```text
repository/
├── frontend/
├── backend/
├── docs/
└── ...
```

The frontend and backend remain independent applications with their own dependencies, configuration, and runtime responsibilities.

The monorepo does not imply that the frontend and backend must share implementation details or become tightly coupled.

## Rationale

A monorepo provides a single source of truth for the project while allowing the frontend and backend to remain independently structured.

It simplifies:

- Version control.
- Development workflow.
- Documentation management.
- Issue and pull request management.
- CI/CD configuration.
- Coordination between frontend and backend changes.

It also makes it easier to keep API contracts, database changes, and frontend integrations synchronized.

## Alternatives Considered

### Separate repositories

Maintaining frontend and backend in separate repositories was considered.

This approach provides stronger repository-level isolation, but would introduce additional management overhead for a project where both applications are part of the same product.

### Single application repository without separation

Keeping all frontend and backend code in the same application structure was also considered.

This was rejected because the frontend and backend have different responsibilities, dependencies, runtime environments, and architectural concerns.

## Consequences

### Positive

- Single repository for the entire product.
- Easier coordination between frontend and backend development.
- Centralized documentation and project configuration.
- Simplified CI/CD management.
- Atomic commits can contain coordinated changes across applications when necessary.
- Clear separation between frontend and backend remains possible.

### Negative

- The repository contains multiple applications and their dependencies.
- CI/CD configuration may become more complex as the project grows.
- Poor boundaries could lead to unnecessary coupling between applications.
- Repository tooling must account for multiple application contexts.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies.md)
- [ADR-003: Layered Application Architecture](./003-application-architectures.md)
