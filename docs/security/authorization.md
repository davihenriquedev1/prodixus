# Authentication

This document describes the authentication mechanisms currently implemented in the application.

Authentication is responsible for verifying the identity of a user. Authorization is handled separately and determines which resources an authenticated user is allowed to access or modify.

## Authentication Model

The our system uses token-based authentication with:

- Password hashing using bcrypt.
- JWT access tokens.
- JWT refresh tokens.
- RS256 asymmetric signing.
- Short-lived access tokens.
- Long-lived refresh tokens.
- Refresh token rotation.
- Refresh token revocation.
- SHA-256 hashing of refresh tokens before database storage.

The backend is responsible for issuing, validating, and revoking authentication tokens.

## Registration

User registration is handled by the authentication service.

The registration flow is:

```text
Client
  │
  │ name, email, password
  ▼
Register Controller
  │
  ▼
Auth Service
  │
  ├── Check whether email already exists
  ├── Hash password with bcrypt
  ├── Create user
  ├── Generate access token
  ├── Generate refresh token
  └── Store hashed refresh token
  │
  ▼
Client
```

Passwords are never stored in plaintext.

Before the user is created, the password is hashed using bcrypt with a cost factor of `10`.

The database stores the resulting password hash in the user's `passwordHash` field.

If the email is already registered, the API returns a conflict error instead of creating another account.

## Login

Login requires the user's email and password.

The authentication flow is:

```text
Client
  │
  │ email + password
  ▼
Login Controller
  │
  ▼
Auth Service
  │
  ├── Find user by email
  ├── Compare password with bcrypt
  ├── Generate access token
  ├── Generate refresh token
  └── Store hashed refresh token
  │
  ▼
Client
```

Invalid credentials result in an authentication error.

The application does not return the user's password hash to the client.

A successful login returns:

- User information considered safe for client exposure.
- An access token.
- A refresh token.

## Access Tokens

Access tokens are JWTs signed using RS256.

The current access-token lifetime is:

```text
30 minutes
```

Access tokens contain the authenticated user's identifier and a token type:

```json
{
  "userId": "<user-id>",
  "type": "access"
}
```

Protected routes receive the access token through the HTTP `Authorization` header:

```http
Authorization: Bearer <access-token>
```

The authentication middleware validates the token before allowing access to protected routes.

The middleware also validates the JWT payload and extracts `userId`.

That value is assigned to:

```ts
req.userId;
```

Application code should use this authenticated identity rather than accepting a user identity from the client.

## Refresh Tokens

Refresh tokens are also JWTs signed using RS256.

The current refresh-token lifetime is:

```text
4 days
```

Refresh tokens contain the user's identifier and identify themselves as refresh tokens:

```json
{
  "userId": "<user-id>",
  "type": "refresh"
}
```

Refresh tokens are persisted in the database so that the server can track their lifecycle and revoke them.

The raw refresh token is never stored directly in the database.

Instead, calculates a SHA-256 hash:

```text
Refresh Token
      │
      ▼
   SHA-256
      │
      ▼
Token Hash
      │
      ▼
Database
```

When a refresh request is received, the same hashing process is applied to the supplied token and the resulting hash is looked up in the database.

## Why Refresh Tokens Use SHA-256

Refresh tokens are cryptographically generated JWTs and can exceed bcrypt's effective input length.

bcrypt only considers the first 72 bytes of its input. Using bcrypt directly to compare long JWT refresh tokens can therefore result in different tokens producing the same comparison result when their first 72 bytes are identical.

The application avoids this problem by hashing refresh tokens with SHA-256 before storing them.

The database therefore stores a fixed-length cryptographic digest rather than the raw token.

## Refresh Token Rotation

Refresh tokens are rotated whenever they are successfully used.

The flow is:

```text
Client
  │
  │ Refresh Token A
  ▼
Refresh Endpoint
  │
  ├── Verify JWT
  ├── Hash supplied token
  ├── Find stored token
  ├── Check revocation
  ├── Check expiration
  ├── Verify user
  │
  ├── Revoke Token A
  │
  ├── Generate Access Token B
  ├── Generate Refresh Token B
  └── Store Token B hash
  │
  ▼
Client
```

The previously used refresh token is marked as revoked before the new refresh token is persisted.

A revoked refresh token cannot be reused successfully.

This provides token rotation and limits the usefulness of a previously issued refresh token after it has been consumed.

## Refresh Token Expiration

Each stored refresh token has an `expiresAt` value.

During refresh, the server checks whether:

```text
expiresAt <= current time
```

If the token has expired, the refresh operation is rejected.

Expiration therefore exists both at the JWT level and in the server-side refresh-token record.

## Refresh Token Revocation

Refresh tokens contain server-side revocation state.

A token can be revoked by setting its `revokedAt` timestamp.

The refresh flow rejects tokens for which:

```text
revokedAt != null
```

Revocation is also used during logout and password changes.

## Logout

Logout requires the refresh token.

The server:

1. Verifies the refresh token.
2. Hashes the supplied token.
3. Finds the corresponding database record.
4. Verifies that the token is not already revoked.
5. Verifies that the token has not expired.
6. Verifies that the token belongs to the authenticated user represented by the token.
7. Revokes the refresh token.

Logout therefore invalidates the corresponding refresh-token session on the server.

## Password Changes

Changing a password requires:

- An authenticated access token.
- The current password.
- A new password satisfying the configured password validation rules.

The server first verifies the current password using bcrypt.

The new password is then hashed with bcrypt before being persisted.

After a successful password change, all active refresh tokens belonging to the user are revoked.

```text
Password Change
      │
      ├── Verify current password
      │
      ├── Hash new password
      │
      ├── Update password
      │
      └── Revoke all active refresh tokens
```

This is important because changing a password should invalidate existing long-lived authentication sessions.

Previously issued access tokens are not immediately revoked by this mechanism because access-token revocation is not currently implemented. Their short lifetime limits the remaining validity period.

## Protected Route Authentication

Protected routes use the authentication middleware.

Current protected user routes include:

```text
GET   /api/users/me
PATCH /api/users/me
PATCH /api/users/me/password
```

The middleware:

1. Reads the `Authorization` header.
2. Requires the `Bearer` authentication scheme.
3. Verifies the access token.
4. Validates the token payload.
5. Extracts the `userId`.
6. Stores the authenticated identity in `req.userId`.
7. Passes execution to the protected route.

Requests with missing or invalid authentication tokens are rejected with HTTP `401 Unauthorized`.

## Authentication vs Authorization

Authentication and authorization are separate security controls.

**Authentication** answers:

> Who is this user?

In this system, this is established through a valid access token.

**Authorization** answers:

> What is this authenticated user allowed to access or modify?

Authorization must be performed by the backend for protected resources.

A valid JWT alone must not grant unrestricted access to application resources.

Resource ownership and authorization requirements are documented in `authorization.md` and `data-isolation.md`.

## Security Requirements

The following requirements apply to authentication:

- Passwords must never be stored in plaintext.
- Password hashes must never be returned to clients.
- JWT signing secrets or private keys must remain server-side.
- Refresh tokens must not be stored as plaintext in the database.
- Revoked refresh tokens must not be accepted.
- Expired refresh tokens must not be accepted.
- Refresh tokens must be rotated after successful use.
- Protected routes must require valid access tokens.
- The authenticated user's identity must come from validated authentication context.
- Authentication failures must not expose sensitive credential information.

## Current Limitations and Future Hardening

The current authentication implementation does not provide immediate server-side revocation for already-issued access tokens.

Additional hardening may be considered separately, including:

- Rate limiting authentication endpoints.
- Protection against credential-stuffing and brute-force attacks.
- Secure client-side refresh-token storage strategy.
- Security headers.
- Additional authentication monitoring and alerting.
- Automated security tests covering token abuse and authentication edge cases.

These controls should not be considered implemented until they are actually introduced into the application.
