# Backend Architecture

This document describes the architecture of the backend application, its main technologies, internal organization, and architectural responsibilities.

## Overview

The backend is a server-side application responsible for implementing the application's business logic and exposing the HTTP API.

It is maintained as an independent application within the monorepo, with clear boundaries between HTTP handling, application logic, data access, and cross-cutting concerns.

## Technology Stack

### Node.js

Node.js provides the runtime environment for the backend application.

### Express

Express is used as the web framework for the HTTP API.

It provides the foundation for routing, middleware, request handling, and response handling.

### TypeScript

TypeScript is used throughout the backend to provide static typing and improve reliability and maintainability.

### Prisma

Prisma is used as the database access layer.

It provides a typed interface for database operations and manages the interaction between the application and the relational database.

## Architectural Organization

The backend is organized by responsibility to maintain separation of concerns and keep application logic independent from infrastructure and transport concerns.

The architecture is structured around the following responsibilities:

- **Routes** Define the API endpoints and map incoming requests to the appropriate application logic.
- **Controllers** Handle HTTP-specific concerns and coordinate the execution of application operations.
- **Services** Contain application and business logic.
- **Data Access** Encapsulates interaction with persistent data through Prisma.
- **Middleware** Provides cross-cutting request processing such as authentication, authorization, and other request-level concerns.
- **Validation** Defines and enforces the expected structure of incoming data.
- **Types and Schemas** Provide shared type definitions and validation schemas within the backend.
- **Utilities** Provide reusable functionality that does not belong to a specific application domain.

The exact directory structure may evolve as the implementation grows, while preserving these architectural responsibilities.

## Architectural Layers

The backend follows a layered organization in which each layer has a defined responsibility:

```text
┌─────────────────────────────┐
│        HTTP / API           │
│     Routes + Controllers    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Application Layer      │
│          Services           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Data Access Layer     │
│           Prisma            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Relational Data       │
│         PostgreSQL          │
└─────────────────────────────┘
```

The HTTP layer is responsible for communication concerns, the application layer contains business behavior, and the data access layer isolates persistence-related operations.

This separation allows changes in one layer to have minimal impact on the others.

## Domain Organization

As the application grows, backend functionality should be organized around application domains rather than concentrating unrelated functionality in shared modules.

Each domain may contain the components required to implement its functionality, such as:

- Routes.
- Controllers.
- Services.
- Validation schemas.
- Domain-specific types.
- Data access logic.

This approach keeps related functionality close together while preserving the separation of responsibilities between architectural layers.

## Cross-Cutting Concerns

Certain concerns apply across multiple parts of the backend rather than belonging to a single domain.

These include:

- Authentication.
- Authorization.
- Validation.
- Error handling.
- Logging.
- Configuration.

These concerns should be implemented in dedicated mechanisms or modules where appropriate, avoiding unnecessary duplication across domains.

## Architectural Boundaries

The backend maintains the following architectural boundaries:

- HTTP-specific concerns remain isolated from business logic.
- Business logic does not depend directly on HTTP implementation details.
- Database access is isolated behind the data access layer.
- Domain functionality remains organized around clear application responsibilities.
- Cross-cutting concerns are handled through dedicated mechanisms rather than being duplicated throughout the application.

These boundaries are intended to keep the backend maintainable, testable, and adaptable as the system evolves.

## Related Documentation

- [System Overview](./system-overview.md): High-level system architecture.
- [Communication](./communication.md): Communication patterns between system components.
- [API Documentation](../api/README.md): API structure, conventions, and endpoints.
- [Database Documentation](../database/): Database structure and persistence.
- [Security Documentation](../security/): Authentication, authorization, and security practices.
