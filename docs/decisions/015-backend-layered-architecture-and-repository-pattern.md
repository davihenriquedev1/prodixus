# ADR 015: Backend Layered Architecture and Repository Pattern

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

As the backend grew to include authentication, users, projects, tasks, tags, and folders, application responsibilities needed to remain separated.

The backend performs different types of work:

- Handling HTTP requests and responses.
- Validating incoming data.
- Authenticating users.
- Applying business rules.
- Checking resource ownership.
- Accessing the database.

Keeping these responsibilities in the same layer would make the code harder to maintain and increase coupling between HTTP handling, business logic, and database access.

## Decision

The backend follows a layered architecture with the following main flow:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Prisma
  ↓
PostgreSQL
```

Validation and authentication middleware operate alongside these layers where appropriate.

### Routes

Routes are responsible for:

- Defining API endpoints.
- Selecting the HTTP method.
- Applying required middleware.
- Connecting endpoints to controllers.

Routes do not contain application business logic.

### Controllers

Controllers are responsible for the HTTP boundary.

They:

- Receive the request.
- Extract request data.
- Call the appropriate service.
- Return the HTTP response.
- Forward errors to the application's error handling mechanism.

Controllers do not contain database access or business rules that belong to the service layer.

### Services

Services contain the application's business logic.

They are responsible for operations such as:

- Validating required identifiers.
- Applying business rules.
- Checking resource ownership.
- Verifying relationships between resources.
- Building the data required for persistence.
- Calling repositories.

Services are therefore the main application layer between HTTP handling and persistence.

### Repositories

Repositories are responsible for database access.

They:

- Use Prisma to execute database operations.
- Receive the data required for persistence.
- Return database results.

Repositories intentionally remain simple.

Business logic and complex data preparation are not moved into repositories when they belong to the service layer.

For example, the service may construct the Prisma data required for a create or update operation, while the repository performs the corresponding Prisma operation.

This avoids unnecessary abstraction and keeps repositories focused on persistence.

### Prisma

Prisma is the database access layer used by the repositories.

It provides:

- Database queries.
- Record creation and updates.
- Record deletion.
- Relationship handling.
- Type-safe database operations.

The application does not access PostgreSQL directly from controllers or services.

### PostgreSQL

PostgreSQL is the persistent database used by the backend.

Database access is centralized through Prisma and the repository layer.

## Consequences

### Positive

- HTTP concerns remain separated from application logic.
- Business rules have a clear location.
- Database access is centralized.
- Repositories remain small and easy to understand.
- Services can enforce ownership and relationship rules before persistence.
- Prisma-specific persistence logic does not need to be exposed to controllers.
- The architecture remains simple without unnecessary abstractions.

### Negative

- A request may pass through several layers before reaching the database.
- Simple operations can require multiple files.
- Developers must maintain clear boundaries between responsibilities.

## Architectural Principle

The repository pattern is used as a **persistence boundary**, not as a place for business logic.

The service layer remains responsible for application rules, while repositories remain focused on database operations.

This keeps the backend layered without introducing unnecessary complexity.

## Related Documentation

- [System Overview](../architecture/system-overview.md)
- [Backend Architecture](../architecture/backend.md)
- [API Documentation](../api/README.md)
- [Database Documentation](../database/README.md)
