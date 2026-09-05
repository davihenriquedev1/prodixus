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
  │ Authorization: Bearer <access token>
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
  ▼
Repository
  │
  ▼
PostgreSQL
```

The authenticated user's ID is extracted from the access token and assigned to `req.userId`. Protected operations use this identity instead of trusting a user ID supplied by the client.

## Authentication

The application uses:

- Password hashing with bcrypt.
- JWT access tokens.
- JWT refresh tokens.
- RS256 signing for JWTs.
- Refresh token rotation.
- Refresh token revocation.
- SHA-256 hashing for refresh tokens stored in the database.

Authentication flows are documented in [authentication.md](./authentication.md).

## Authorization

Authentication establishes **who the user is**. Authorization determines **what that authenticated user is allowed to access or modify**.

Protected user routes use the authentication middleware before reaching their controllers.

Current protected routes include:

```text
GET   /api/users/me
PATCH /api/users/me
PATCH /api/users/me/password
```

Authorization and protected routes are documented in [authorization.md](./authorization.md).

## Data Isolation

User data must remain isolated from other users.

The backend must not rely on client-provided identifiers to determine resource ownership. Ownership must be derived from the authenticated user and the application's data relationships.

For example:

```text
Authenticated User
       │
       ├── Projects
       │     └── Tasks
       │
       └── Tags
```

A resource ID alone must never be considered sufficient authorization to access, modify, or delete a resource.

Data isolation and protection against IDOR/BOLA-style access are documented in [data-isolation.md](./data-isolation.md).

## Secrets and Credentials

Application secrets and credentials are server-side concerns.

Examples include:

- Database connection credentials.
- JWT signing keys.
- Refresh token signing keys.
- Environment-specific secrets.

Secrets must not be exposed through the frontend or committed to source control.

Credential and secret management are documented in [secrets-and-credentials.md](./secrets-and-credentials.md).

## Security Practices

The application uses several security practices, including:

- Input validation with Zod.
- Password hashing with bcrypt.
- Cryptographic hashing of stored refresh tokens.
- JWT validation.
- Refresh token expiration and revocation.
- Protected backend routes.
- Separation between controllers, services, and repositories.
- Safe user responses that do not expose password hashes.

Additional security practices and recommendations are documented in [security-practices.md](./security-practices.md).

## Current Security Scope

This documentation describes the security controls currently implemented by the application.

Security controls that are not yet implemented must not be represented as existing protections. They should instead be tracked separately as future security hardening work.

## Security Goal

The primary security goal is:

> A user must only be able to access, modify, or delete resources that belong to them, even when manually manipulating resource IDs, endpoints, or HTTP requests.

The application should also assume that data stored in the database may contain private information and must therefore be protected accordingly.
