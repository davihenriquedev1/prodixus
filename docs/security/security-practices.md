# Security Practices

This document describes the security practices used by Taskify and identifies additional hardening measures required as the application evolves.

Security is treated as a defense-in-depth problem. No single security mechanism should be considered sufficient by itself.

## Defense in Depth

The application's security model is based on multiple layers:

```text id="7v2m4k"
Client
  │
  ▼
HTTPS / Transport Security
  │
  ▼
HTTP Security Controls
  │
  ▼
Authentication
  │
  ▼
Input Validation
  │
  ▼
Authorization / Ownership
  │
  ▼
Application Services
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

Each layer addresses different classes of security risks.

## Input Validation

All data received from clients should be considered untrusted.

The backend must validate request data before using it in application logic or database operations.

Taskify uses Zod for request validation.

For example, password changes validate the new password before it reaches the service layer.

The current password schema requires the new password to:

- Contain at least 8 characters.
- Contain at least one uppercase letter.
- Contain at least one lowercase letter.
- Contain at least one number.

Validation should be applied consistently to all API inputs as new endpoints are implemented.

## Authentication Validation

Protected routes validate authentication before executing protected application logic.

The authentication middleware:

- Requires a Bearer token.
- Verifies the access token.
- Validates the JWT payload.
- Extracts the authenticated user's ID.
- Places the identity in `req.userId`.

Malformed or invalid authentication tokens are rejected.

Authentication must always be performed by the backend.

## Authorization

Authentication alone is not authorization.

A valid access token establishes the user's identity but does not automatically grant access to every resource in the system.

Resource-level operations must verify that the authenticated user is authorized to access the requested resource.

For user-owned resources, ownership must be checked using the authenticated user's identity.

This is particularly important for preventing IDOR and BOLA vulnerabilities.

Detailed requirements are documented in:

- `authorization.md`
- `data-isolation.md`

## Password Security

Passwords are sensitive credentials and must never be stored in plaintext.

Taskify uses bcrypt for password hashing.

During authentication, the supplied password is compared against the stored hash rather than against a plaintext password.

The application must never:

- Store plaintext passwords.
- Return passwords in API responses.
- Log passwords.
- Include passwords in error messages.
- Store passwords in source code.

## Refresh Token Security

Refresh tokens are long-lived authentication credentials and require additional protection.

Taskify:

- Gives refresh tokens a limited lifetime.
- Stores refresh-token hashes rather than raw tokens.
- Tracks expiration.
- Tracks revocation.
- Rotates refresh tokens after successful use.
- Revokes refresh tokens during logout.
- Revokes active refresh tokens after password changes.

Refresh-token hashing uses SHA-256.

This is important because bcrypt is not appropriate for directly comparing the long JWT refresh tokens used by this application due to bcrypt's 72-byte input limitation.

## JWT Security

JWTs are signed using RS256.

Access tokens and refresh tokens have different purposes and lifetimes.

The token payload identifies the token type:

```json id="r9x3p1"
{
  "userId": "<user-id>",
  "type": "access"
}
```

or:

```json id="m4v8q2"
{
  "userId": "<user-id>",
  "type": "refresh"
}
```

The backend must verify both the token signature and the expected token purpose before accepting a token.

JWT signing keys must remain server-side.

## Token Transport

Authentication tokens must be transmitted through secure channels.

Production deployments should use HTTPS.

Tokens should not be included in URLs because URLs may be exposed through:

- Browser history.
- Proxy logs.
- Server logs.
- Analytics systems.
- Referrer information.

Access tokens are currently expected through the HTTP authorization header:

```http id="u6c2y8"
Authorization: Bearer <access-token>
```

## CORS

Cross-Origin Resource Sharing (CORS) controls which browser origins may interact with the API.

CORS configuration should be explicitly reviewed before production deployment.

The production API should allow only the origins required by the application.

A permissive development configuration should not automatically be considered appropriate for production.

Current CORS behavior should therefore be reviewed as part of production security hardening.

## HTTPS

Production authentication and application traffic must use HTTPS.

HTTPS protects data while it travels between:

```text id="p7n2c5"
Client
  │
  │ encrypted connection
  ▼
API
```

This is especially important for:

- Access tokens.
- Refresh tokens.
- Passwords during authentication.
- User data.
- Private task and project information.

HTTP should not be used for production authentication traffic.

## Database Security

The database may contain potentially private application data.

Database access must therefore be restricted to authorized application components.

The application accesses PostgreSQL through Prisma.

Prisma provides parameterized database operations when used through its normal query APIs, reducing the risk of SQL injection caused by directly concatenating untrusted values into SQL statements.

Raw SQL operations, when necessary, must be handled carefully and must never construct SQL statements through unsafe string concatenation.

## Database Constraints

Database constraints provide an additional layer of protection for data integrity.

Relevant constraints may include:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Non-null constraints.
- Referential integrity.

These constraints do not replace authorization.

For example:

```text id="k3r8w5"
Database constraint
       │
       └── Protects data integrity

Authorization
       │
       └── Protects access boundaries
```

Both concerns must be addressed.

## Transactions

Operations that modify multiple related records should use database transactions when atomicity is required.

For example, an operation that:

1. Creates a resource.
2. Creates related records.
3. Updates another record.

should not leave the database in a partially modified state if one of the steps fails.

Transactions are especially important for security-sensitive multi-resource operations because partial mutations can create inconsistent ownership or relationship data.

## XSS Prevention

User-provided content must be treated as untrusted.

The frontend should render user-controlled content safely and avoid inserting untrusted HTML directly into the page.

Dangerous patterns such as:

```tsx id="c8m2v7"
dangerouslySetInnerHTML;
```

must not be used with unsanitized user content.

If rich HTML content is introduced in the future, it must be sanitized using an appropriate security strategy before rendering.

## Request and Response Data

API responses should expose only the data required by the client.

Sensitive internal fields must not be returned unnecessarily.

For example, user profile responses currently construct a safe representation containing:

- `id`
- `name`
- `email`
- `createdAt`
- `updatedAt`

The password hash is not included.

The same principle should be applied to future resources.

## Logging

Logs are useful for debugging and security monitoring, but logs must not become a source of credential leakage.

The application must not log:

- Passwords.
- Password hashes.
- Access tokens.
- Refresh tokens.
- JWT private keys.
- Database passwords.
- API keys.
- Complete database connection strings.
- Sensitive private user content.

Logs should contain enough context to diagnose problems without exposing secrets or private information.

## Error Handling

Errors returned to clients should contain useful information without exposing internal implementation details.

Responses must not expose:

- Stack traces in production.
- Database connection information.
- SQL statements containing sensitive data.
- Environment variables.
- Private keys.
- Password hashes.
- Authentication credentials.

Internal errors may be logged server-side when necessary, but sensitive values must still be excluded.

## Rate Limiting

Authentication endpoints are potential targets for:

- Brute-force attacks.
- Credential stuffing.
- Automated account creation.
- Token abuse.

Rate limiting should be applied to sensitive endpoints, particularly:

```text id="n5x8q3"
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

Rate limiting is a security hardening measure and should be implemented and configured explicitly before production if required by the application's threat model.

## Dependency Security

Application dependencies are part of the application's attack surface.

Dependencies should be kept reasonably up to date and security vulnerabilities should be monitored.

The project should periodically run dependency auditing tools such as:

```bash id="g2w9m4"
npm audit
```

Dependency updates should be reviewed rather than blindly applied, particularly when they introduce breaking changes.

Automated dependency vulnerability scanning may also be enabled through the project's CI/CD platform.

## CI/CD Security

The CI/CD pipeline must not expose secrets in build logs.

Secrets required by automated workflows should be stored through the platform's secret-management mechanism rather than committed to the repository.

CI workflows should avoid printing environment variables or sensitive configuration.

Pull requests should be reviewed for accidental inclusion of:

- `.env` files.
- Credentials.
- Private keys.
- Tokens.
- Debug logs containing sensitive values.

## Production Configuration

Development configuration should not automatically be reused in production.

Before deployment, the following should be reviewed:

- Environment variables.
- CORS configuration.
- HTTPS configuration.
- Database credentials.
- JWT signing keys.
- Logging behavior.
- Error responses.
- Rate limiting.
- Security headers.
- Database permissions.

Production configuration should follow the principle of least privilege.

## Security Headers

HTTP security headers provide additional browser-side protections.

Security headers should be reviewed and configured for production.

Potential controls include:

- Content Security Policy.
- `X-Content-Type-Options`.
- `Referrer-Policy`.
- Frame protection.
- Strict Transport Security.

These controls should be implemented according to the application's deployment architecture rather than merely documented as enabled.

## Backups

Database backups may contain the same private information as the production database.

Therefore, backups must be treated as sensitive data.

Backup security should include:

- Access control.
- Encryption where supported.
- Retention policies.
- Secure storage.
- Controlled restoration procedures.

A backup should never be considered safe simply because it is no longer part of the production database.

## Monitoring and Security Events

As the application grows, security-relevant events should be monitored.

Potential events include:

- Repeated failed login attempts.
- Unusual authentication activity.
- Repeated invalid refresh-token attempts.
- Unexpected authorization failures.
- Administrative security changes.
- Credential or secret rotation.

Monitoring requirements should be based on the application's production threat model.

## Security Testing

Security tests should explicitly verify authorization boundaries.

At minimum, tests should cover:

### Authentication

- Missing access token.
- Invalid access token.
- Expired access token.
- Malformed JWT.
- Invalid token payload.
- Invalid credentials.

### Refresh Tokens

- Invalid refresh token.
- Expired refresh token.
- Revoked refresh token.
- Reuse of a rotated refresh token.
- Refresh token belonging to another user.
- Password change revoking active refresh tokens.

### Authorization

- User A accessing User B's resource.
- User A modifying User B's resource.
- User A deleting User B's resource.
- Manipulation of resource IDs.
- Manipulation of ownership fields.
- Access to related resources belonging to another user.

## Current Security Controls

The following controls are currently implemented:

- Zod request validation for implemented endpoints.
- bcrypt password hashing.
- RS256 JWT signing.
- Access-token expiration.
- Refresh-token expiration.
- Refresh-token hashing with SHA-256.
- Refresh-token rotation.
- Refresh-token revocation.
- Logout token revocation.
- Revocation of active refresh tokens after password changes.
- Authentication middleware for protected routes.
- Server-side authentication identity through `req.userId`.
- Safe user responses that do not expose password hashes.
- Prisma-based database access.

## Future Hardening

The following areas should be implemented or reviewed as the application moves toward production:

- Resource-level ownership checks for all user-owned CRUD resources.
- Automated IDOR/BOLA tests.
- Rate limiting.
- Production CORS restrictions.
- Security headers.
- HTTPS enforcement.
- Dependency vulnerability scanning.
- Secret scanning.
- Production database least-privilege configuration.
- Backup security and recovery procedures.
- Authentication monitoring.
- Security event logging.
- Periodic security review.

These items must not be represented as implemented controls until they have been configured and verified.

## Security Principle

Taskify should follow a defense-in-depth approach:

> Never rely on a single security control to protect sensitive data.

Authentication establishes identity.

Authorization establishes permission.

Input validation controls untrusted input.

Database constraints protect data integrity.

Secure secret management protects credentials.

HTTPS protects data in transit.

Logging and monitoring support detection and investigation.

Security testing verifies that these controls actually enforce the intended boundaries.
