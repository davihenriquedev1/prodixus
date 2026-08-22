# ADR-003: Application Architectures

## Status

Accepted

## Context

The system is composed of multiple applications with different responsibilities, primarily a frontend application and a backend API.

Because these applications have different concerns and runtime responsibilities, a single architectural pattern would not be appropriate for the entire system.

The system therefore requires architectural approaches that provide clear separation of responsibilities while remaining simple and proportional to its current scope.

## Decision

The system will use different architectural approaches for the frontend and backend according to the responsibilities of each application.

The monorepo will maintain the following high-level organization:

```text
repository/
├── frontend/
├── backend/
└── docs/
```

The frontend will use a **Feature-Based Architecture**, while the backend will use a **Layered Architecture**.

Documentation will remain separated from application code under `docs/`.

## Frontend Architecture

The frontend will use a **Feature-Based Architecture**, grouping code related to each system functionality under `features/`.

```text
frontend/
├── app/
├── features/
├── components/
├── hooks/
├── services/
├── types/
└── utils/
```

### Responsibilities

- `app/` — Next.js routes, pages, layouts, and application-level configuration.
- `features/` — functionality-specific code, such as `auth`, `projects`, `tasks`, `tags`, and `folders`.
- `components/` — reusable components shared across different features.
- `hooks/` — reusable React hooks.
- `services/` — communication with the backend API.
- `types/` — shared TypeScript type definitions.
- `utils/` — general-purpose helper functions and utilities.

This structure keeps functionality-related code close together without introducing unnecessary fragmentation.

## Backend Architecture

The backend will use a **Layered Architecture** with clear separation between HTTP handling, business logic, persistence, and supporting concerns.

```text
backend/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── validators/
├── routes/
├── config/
└── utils/
```

### Responsibilities

- `controllers/` — receive HTTP requests and return HTTP responses.
- `services/` — contain application business rules and use-case logic.
- `repositories/` — centralize database access and persistence operations.
- `middlewares/` — process requests before they reach controllers, including authentication and error handling.
- `validators/` — validate and sanitize data received by the API.
- `routes/` — define and organize API endpoints.
- `config/` — centralize application configuration, including environment, database, and authentication settings.
- `utils/` — contain reusable helper functions that do not belong to a specific business rule.

The main request flow is:

```text
Request → Middleware → Validator → Controller → Service → Repository → Prisma → PostgreSQL
```

This separation keeps responsibilities well defined and facilitates testing, maintenance, security, and future evolution.

## Documentation Architecture

Project documentation will remain separated from application code under `docs/`.

The documentation is organized according to its purpose, including:

- Architecture documentation.
- UML diagrams.
- Database ER diagrams.
- Sequence diagrams.
- API documentation.
- Architectural decisions.

The documentation structure should remain simple and proportional to the system's current needs.

## Rationale

Using different architectural approaches for the frontend and backend allows each application to follow a structure appropriate to its responsibilities.

Feature-Based Architecture keeps frontend functionality organized around system features, while Layered Architecture provides clear separation between HTTP handling, business logic, and persistence in the backend.

This approach provides architectural structure without introducing unnecessary abstractions or complexity.

## Alternatives Considered

### Single architectural pattern for frontend and backend

Rejected because the frontend and backend have fundamentally different responsibilities and development concerns.

### Fully layered frontend architecture

Considered but rejected for the current system because applying extensive layers to the frontend would introduce unnecessary structural complexity.

### More complex backend architecture

Architectures with additional abstractions and layers were considered but rejected because the current system scope does not justify their complexity.

## Consequences

### Positive

- Clear separation of responsibilities.
- Frontend organization remains centered around features.
- Backend business logic is separated from HTTP and persistence concerns.
- Easier testing and maintenance.
- Architecture can evolve as the system grows.
- Documentation remains independent from application implementation.
- Avoids unnecessary abstractions at the current system stage.

### Negative

- Frontend and backend follow different organizational patterns.
- Developers must understand the architectural conventions of each application.
- Additional structure may need to be introduced as the system grows.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies.md)
- [ADR-002: Monorepo Architecture](./002-monorepo-architecture.md)
