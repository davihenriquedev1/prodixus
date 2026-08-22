# ADR-001: Technologies Chosen

## Status

Accepted

## Context

The system requires a modern, maintainable technology stack capable of supporting a full-stack web application while remaining practical for the project's current development stage.

The technologies should provide strong TypeScript support, good developer experience, maintainability, and appropriate capabilities for the application's frontend, backend, authentication, validation, and data persistence requirements.

## Decision

The following technologies were selected for the project.

## Frontend

### Next.js

Chosen as the main frontend framework for providing a robust structure for React applications, including routing, rendering capabilities, optimizations, and an architecture suitable for modern web applications.

### React

Used as the foundation for the user interface, enabling the application to be built using reusable components and facilitating the development of complex interfaces.

### TypeScript

Chosen to provide static typing, reduce development-time errors, and make the codebase more predictable and maintainable.

### Tailwind CSS

Used for interface styling because it enables fast and consistent component development while keeping styling closely associated with the interface structure.

## Backend

### Node.js

Chosen as the backend runtime because it allows JavaScript/TypeScript to be used on the server and provides a broad ecosystem for API development.

### Express

Chosen to structure the REST API because it is simple, mature, and flexible, allowing direct control over the backend architecture without unnecessary abstractions.

### Prisma

Chosen as the ORM to simplify communication with PostgreSQL, provide type-safe database queries, and centralize the definition and evolution of the data model.

### PostgreSQL

Chosen as the database management system because it is a robust relational database well suited to the relationships between users, folders, projects, tasks, and tags.

### Neon

Chosen to host PostgreSQL because it provides a managed PostgreSQL environment, simple project integration, and resources appropriate for the project's initial development stage.

### Zod

Used to validate data received by the API, ensuring that external inputs are validated before being processed by the application.

### JWT + bcrypt

Used for authentication.

**JWT** is used to represent authenticated sessions and authorization, while **bcrypt** is used to securely store user passwords as hashes.

## Rationale

The selected stack provides a consistent TypeScript-based development environment across the frontend and backend while using established technologies for web applications, relational data persistence, validation, and authentication.

The combination also provides sufficient flexibility for the project's current scope without introducing unnecessary infrastructure or architectural complexity.

## Alternatives Considered

Specific alternatives were considered during the project's planning and technology selection process. The selected technologies were preferred based on project requirements, familiarity, ecosystem maturity, maintainability, and development complexity.

## Consequences

### Positive

- Consistent TypeScript usage across the application.
- Strong typing throughout the main development stack.
- Mature and widely adopted technologies.
- Clear separation between frontend, backend, and persistence concerns.
- PostgreSQL provides strong support for the project's relational data model.
- Prisma simplifies database access and schema management.
- Neon reduces infrastructure complexity during the initial development stage.

### Negative

- The stack introduces multiple technologies that must be maintained and understood.
- Prisma adds an abstraction layer over PostgreSQL.
- Next.js and Express require separate application structures within the monorepo.
- Neon introduces dependency on a managed external database service.

## Related Decisions

- [ADR-002: Monorepo Architecture](./002-monorepo-architecture.md)
- [ADR-003: Layered Application Architecture](./003-application-architectures.md)
