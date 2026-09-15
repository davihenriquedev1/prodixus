# ADR 016: Backend Ownership and Tenant Isolation

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

The data model defines ownership relationships between users and application resources.

However, database relationships alone do not guarantee that one user cannot access another user's resources.

The backend must therefore enforce ownership and authorization for every operation involving user-owned or indirectly owned resources.

The system follows a tenant isolation principle: a user's resources must remain isolated from resources belonging to other users.

## Decision

The backend will treat the authenticated user identity as the authoritative source for ownership checks.

The `userId` used for authorization is obtained from the verified JWT through the authentication middleware.

The backend must not trust a `userId` supplied by the client to determine ownership.

The general authorization flow is:

```text
Client
  ↓
JWT
  ↓
Authentication Middleware
  ↓
Authenticated userId
  ↓
Service
  ↓
Ownership Validation
  ↓
Repository
```

### Authenticated Identity

Protected requests use the authenticated identity established by the JWT.

The client does not control the user identity used for authorization.

Services receive the authenticated user's identity and use it when validating access to resources.

### Direct Ownership

For resources that contain a direct `userId` relationship, the backend validates that the resource belongs to the authenticated user.

Examples include:

- Projects
- Tags
- Folders
- User-specific resources

A resource belonging to another user must not be accessed or modified through a different user's authenticated session.

### Indirect Ownership

Some resources do not contain their own `userId`.

Their ownership is determined through another resource.

For example:

```text
User
  ↓
Project
  ↓
Task
```

A task can only be accessed when its associated project belongs to the authenticated user.

The service layer is responsible for validating this ownership chain before allowing the operation.

### Related Resource Validation

When an operation involves multiple resources, ownership must be validated for every resource that participates in the operation.

For example, assigning a tag to a task requires validation of both:

```text
Authenticated User
       │
       ├── Task
       │
       └── Tag
```

The backend must not allow a user to associate their task with another user's tag, or another user's task with their tag.

### Client-Supplied Identifiers

Resource identifiers received from the client are treated only as references to resources.

An identifier does not prove ownership.

The backend must independently verify that the referenced resource is accessible to the authenticated user before performing the requested operation.

This applies to:

- Resource retrieval.
- Updates.
- Deletions.
- Relationships between resources.
- Parent-child relationships.
- Resource movement between containers.

### Inaccessible Resources

A resource belonging to another user is treated as inaccessible.

The backend does not expose another user's resource simply because the supplied identifier exists in the database.

This keeps authorization enforcement independent from client behavior.

### Logging and Sensitive Data

Sensitive task content and other private user data must not be unnecessarily included in application logs.

Logs should contain only information necessary for debugging, monitoring, and operational purposes.

## Enforcement Location

Ownership and authorization rules are enforced in the backend service layer.

The service layer is responsible for:

- Receiving the authenticated user identity.
- Validating resource ownership.
- Validating ownership chains.
- Validating relationships between user-owned resources.
- Rejecting unauthorized operations before persistence.

Repositories remain responsible for database access and do not replace service-level authorization rules.

## Consequences

### Positive

- User resources remain isolated at the application authorization boundary.
- Client-controlled identifiers cannot be used as proof of ownership.
- Ownership rules are consistently enforced by the backend.
- Indirectly owned resources receive the same authorization protection as directly owned resources.
- Relationships between resources cannot be used to bypass ownership checks.
- Sensitive user data is less likely to appear unnecessarily in logs.

### Negative

- Services must perform ownership checks for protected operations.
- Operations involving multiple resources may require multiple ownership validations.
- Changes to resource relationships require corresponding authorization rules.
- Developers must consistently preserve the ownership boundary when adding new endpoints.

## Relationship with Data Modeling

The ownership relationships themselves are defined by [ADR-004: Data Modeling and Ownership Rules](./004-data-modeling-and-ownership.md).

This ADR defines how those ownership relationships are enforced by the backend.

The two decisions therefore have different responsibilities:

```text
ADR-004
Data model and ownership relationships
              ↓
ADR-016
Backend enforcement of ownership and isolation
```

## Related Decisions

- [ADR-003: Application Architectures](./003-application-architectures.md)
- [ADR-004: Data Modeling and Ownership Rules](./004-data-modeling-and-ownership.md)
- [ADR-015: Backend Layered Architecture and Repository Pattern](./015-backend-layered-architecture-and-repository-pattern.md)
