# ADR 014: JWT Authentication and Refresh Token Strategy

- **Status:** Accepted
- **Date:** 2026-09-15

## Context

The application requires authentication for protected API resources while maintaining short-lived access credentials and a mechanism for obtaining new access tokens without requiring the user to log in again.

The backend already implements:

- JWT-based authentication.
- RS256 signing.
- Access and refresh tokens.
- Refresh token rotation.
- Persistent refresh token storage.
- Refresh token revocation.
- Password-change invalidation of existing refresh tokens.

The refresh token implementation also needs to avoid relying on bcrypt for comparing complete JWT strings, because bcrypt only processes the first 72 bytes of its input.

## Decision

The backend uses JWT with the **RS256** algorithm for authentication tokens.

### Access Token

Access tokens:

- Are JWTs signed with the private RSA key.
- Are verified using the public RSA key.
- Are used to authenticate protected API requests.
- Have a lifetime of **30 minutes**.
- Are sent through the HTTP `Authorization` header using the `Bearer` scheme.

Example:

```http
Authorization: Bearer <access-token>
```

The authenticated user's identity is obtained from the verified JWT rather than from a user identifier supplied by the client.

### Refresh Token

Refresh tokens:

- Are JWTs signed with the private RSA key.
- Have a lifetime of **4 days**.
- Are stored in the database through a secure token hash.
- Are associated with the authenticated user.
- Can be revoked.
- Are rotated when used to obtain a new access token.

The backend does not use bcrypt to compare the complete refresh JWT. Instead, a token hash is generated and stored, allowing the complete token to be identified without relying on bcrypt's 72-byte input limitation.

### Refresh Token Rotation

When a valid refresh token is used:

1. The existing refresh token is invalidated.
2. A new access token is generated.
3. A new refresh token is generated.
4. The new refresh token is stored.
5. The new token pair is returned to the client.

This prevents a previously used refresh token from remaining valid after rotation.

### Revocation

Refresh tokens can be explicitly revoked.

The backend distinguishes between different refresh-token failures, including:

- Invalid refresh token.
- Revoked refresh token.
- Expired refresh token.

Changing the user's password also revokes all refresh tokens associated with that user.

## Consequences

### Positive

- Access tokens have a limited lifetime.
- Refresh tokens allow sessions to continue without frequent login.
- Refresh token rotation reduces the lifetime of a previously used refresh token.
- Revocation provides server-side control over refresh sessions.
- RSA signing separates token signing from token verification.
- Token hashing avoids relying on bcrypt for complete JWT comparison.

### Negative

- Authentication requires management of RSA keys.
- Refresh tokens require persistent database storage.
- Refresh rotation introduces additional authentication logic.
- Revocation and rotation require database operations during authentication flows.

## Related Documentation

- [Authentication API](../api/authentication.md)
- [Security Documentation](../security/README.md)
- [Database Schema](../database/schema.md)
