# Backend Architecture

This document describes the architecture of the backend application, its main technologies, internal organization, and architectural responsibilities.

## Overview

The backend is a server-side application responsible for exposing the REST API and implementing the application's authentication, authorization, validation, business logic, and data access.

It is maintained as a separate application within the monorepo, with clear boundaries between HTTP handling, application logic, validation, and database access.

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

It provides a typed interface for database operations and connects the application to PostgreSQL.

### PostgreSQL

PostgreSQL is the relational database used for persistent application data.

### Zod

Zod is used for request validation.

Validation schemas define the expected structure and constraints of incoming data before it is processed by the application logic.

### JWT

JSON Web Tokens are used for authentication.

The application uses RS256-signed access and refresh tokens to authenticate users and maintain authenticated sessions.

### bcrypt

bcrypt is used for password hashing and password verification.

Plain-text passwords are never stored in the database.

## Architectural Organization

The backend is organized by responsibility and application resource.

The main backend components include:

- **Routes** — Define API endpoints and connect incoming requests to controllers.
- **Controllers** — Handle HTTP-specific concerns and coordinate application operations.
- **Services** — Contain application and business logic.
- **Repositories** — Encapsulate database operations performed through Prisma.
- **Validators** — Define and validate the expected structure of incoming data.
- **Middleware** — Handles cross-cutting request concerns such as authentication.
- **Configuration** — Provides application configuration and infrastructure setup.
- **Utilities** — Provide reusable functionality that does not belong to a specific application resource.

The backend functionality is organized around application resources such as:

- Authentication
- Users
- Projects
- Tasks
- Tags
- Folders

This organization keeps related functionality together while maintaining clear responsibilities between layers.

## Architectural Layers

The backend follows a layered organization:

```text
┌─────────────────────────────┐
│         HTTP / API          │
│    Routes + Controllers     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Validation / Auth      │
│       Zod + Middleware      │
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
│        Repositories         │
│           Prisma            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Relational Data       │
│         PostgreSQL          │
└─────────────────────────────┘
```

Each layer has a specific responsibility:

- The HTTP layer handles API communication.
- Middleware handles request-level concerns such as authentication.
- Validators validate incoming data.
- Services implement application and business rules.
- Repositories perform database operations.
- Prisma provides typed database access.
- PostgreSQL provides persistent data storage.

## Controllers

Controllers are responsible for HTTP-specific behavior.

They receive requests from routes, obtain the required request data, call the appropriate service, and return the corresponding HTTP response.

Controllers should not contain the application's main business rules or perform database operations directly.

## Services

Services contain the application's business logic.

They are responsible for operations such as:

- Applying business rules.
- Checking resource ownership.
- Coordinating related operations.
- Preparing data for persistence.
- Handling application-specific errors.

Services receive the authenticated user identity from the request context rather than trusting a client-provided user identifier.

This is an important part of the application's data-isolation model.

## Repositories

Repositories encapsulate database operations.

They use Prisma to interact with PostgreSQL and keep database-specific operations separate from application and HTTP logic.

Repositories are intentionally kept simple and focused on data access.

Business rules and ownership checks remain in the service layer.

## Authentication and Authorization

Authentication is implemented through JWT access and refresh tokens.

Authentication middleware validates access tokens and provides the authenticated user's identity to the request context.

Authorization is enforced by the backend through resource ownership checks.

For user-owned resources, services verify that the requested resource belongs to the authenticated user before allowing access or modification.

The client cannot establish ownership simply by providing another user's identifier.

## Validation

Incoming request data is validated using Zod schemas.

Validation is performed before application logic processes the corresponding data.

This provides a consistent boundary between external input and internal application logic.

Validation is applied to operations such as:

- User registration and authentication.
- Project creation and updates.
- Task creation and updates.
- Tag creation and updates.
- Folder creation and updates.
- Password changes.

## Error Handling

Application errors are represented using the backend's error-handling mechanism and returned through consistent HTTP responses.

Errors contain an application-specific error code and a message appropriate for the client.

The backend avoids exposing internal implementation details or sensitive information in API responses.

## Cross-Cutting Concerns

The backend contains concerns that apply across multiple resources, including:

- Authentication.
- Authorization.
- Validation.
- Error handling.
- Configuration.
- Logging.

These concerns are handled through dedicated middleware, modules, or utilities where appropriate to avoid unnecessary duplication.

## Architectural Boundaries

The backend maintains the following boundaries:

- HTTP-specific concerns remain in routes and controllers.
- Business logic remains in services.
- Database operations remain in repositories.
- Prisma is accessed by the backend rather than the frontend.
- Request validation is handled through dedicated schemas.
- Authentication is handled through middleware and JWTs.
- Resource ownership is enforced by the backend.
- Sensitive application data is not exposed through unnecessary logs or error responses.

These boundaries keep the backend organized and provide a clear separation between transport, application logic, validation, and persistence.

## Related Documentation

- [System Overview](./system-overview.md) — High-level system architecture.
- [Communication](./communication.md) — Communication patterns between system components.
- [API Documentation](../api/README.md) — API structure, conventions, and endpoints.
- [Database Documentation](../database/) — Database structure and persistence.
- [Security Documentation](../security/) — Authentication, authorization, and security practices.
