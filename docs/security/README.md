# Security

This directory documents the security model and practices of the application.

The security model is based on authentication, authorization, resource ownership, secure credential handling, and protection of sensitive data.

## Security Principles

The application follows these core principles:

- Never trust client-provided authentication or ownership information.
- Authentication must be performed by the backend.
- Protected resources must be authorized by the backend.
- The authenticated user's identity must come from a validated access token.
- Resource identifiers must not grant access by themselves.
- User-owned resources must be accessed only within the authenticated user's ownership boundary.
- Passwords must never be stored in plaintext.
- Authentication secrets and credentials must never be exposed to the client.
- Refresh tokens must be securely stored and revocable.
- Data stored in the database must be treated as potentially private.

## Security Architecture

Authentication and authorization are enforced through the backend API.

```text
Client
  │
  │ Authorization: Bearer <access-token>
  ▼
Express API
  │
  ▼
Authentication Middleware
  │
  ├── Validate JWT
  ├── Validate token payload
  └── Extract userId
  │
  ▼
Protected Route
  │
  ▼
Controller
  │
  ▼
Service
  │
  ├── Authorization
  └── Ownership checks
  │
  ▼
Repository
  │
  ▼
PostgreSQL
```

The authenticated user's ID is extracted from the validated access token and assigned to `req.userId`.

Protected operations use this identity instead of trusting a user ID supplied by the client.

## Authentication

The application uses:

- Password hashing with bcrypt.
- JWT access tokens.
- JWT refresh tokens.
- RS256 signing for JWTs.
- Access-token expiration.
- Refresh-token expiration.
- Refresh-token rotation.
- Refresh-token revocation.
- SHA-256 hashing for refresh tokens stored in the database.

Authentication flows are documented in [authentication.md](./authentication.md).

## Authorization

Authentication establishes **who the user is**.

Authorization determines **what that authenticated user is allowed to access or modify**.

Protected routes use the authentication middleware before reaching their controllers.

Current protected resources include:

```text
/api/users/*
/api/projects/*
/api/tags/*
/api/folders/*
/api/projects/:projectId/tasks/*
```

Authorization is enforced at the service layer through resource ownership checks.

Directly owned resources include:

- Projects.
- Tags.
- Folders.

Tasks are authorized through their project ownership.

Operations involving multiple resources also validate the ownership of the related resources.

Authorization requirements are documented in [authorization.md](./authorization.md).

## Data Isolation

User data must remain isolated from other users.

The backend must not rely on client-provided identifiers to determine resource ownership.

Ownership is derived from the authenticated user and the application's data relationships.

For example:

```text
Authenticated User
       │
       ├── Projects
       │     └── Tasks
       │
       ├── Tags
       │
       └── Folders
```

A resource ID alone must never be considered sufficient authorization to access, modify, or delete a resource.

Cross-resource relationships must also remain within the authenticated user's ownership boundary.

Data isolation and protection against IDOR/BOLA-style access are documented in [data-isolation.md](./data-isolation.md).

## Secrets and Credentials

Application secrets and credentials are server-side concerns.

Examples include:

- Database connection credentials.
- JWT private keys.
- Environment-specific secrets.
- Other server-side credentials.

Secrets must not be exposed through the frontend or committed to source control.

Credential and secret management are documented in [secrets-and-credentials.md](./secrets-and-credentials.md).

## Security Practices

The application uses several security practices, including:

- Input validation with Zod.
- Password hashing with bcrypt.
- SHA-256 hashing of stored refresh tokens.
- JWT signature and payload validation.
- Access-token and refresh-token expiration.
- Refresh-token rotation.
- Refresh-token revocation.
- Protected backend routes.
- Server-side ownership validation.
- Separation between controllers, services, and repositories.
- Safe user responses that do not expose password hashes.
- Protection against client-controlled ownership information.

Additional security practices and recommendations are documented in [security-practices.md](./security-practices.md).

## Current Security Scope

This documentation describes the security controls currently implemented by the application.

Security controls that are not yet implemented must not be represented as existing protections.

Additional controls should instead be tracked separately as future security hardening work.

## Security Goal

The primary security goal is:

> A user must only be able to access, modify, or delete resources that belong to them, even when manually manipulating resource IDs, endpoints, or HTTP requests.

The application should also assume that data stored in the database may contain private information and must therefore be protected accordingly.
