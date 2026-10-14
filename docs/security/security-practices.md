# Security Practices

This document describes the security practices currently used by the application and identifies additional hardening measures that may be required as the system evolves.

Security is treated as a defense-in-depth problem. No single security mechanism should be considered sufficient by itself.

## Defense in Depth

The application's security model is based on multiple layers:

```text
Client
  │
  ▼
HTTPS / Transport Security
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

All data received from clients is considered untrusted.

The backend validates request data before using it in application logic or database operations.

The application uses Zod for request validation.

Validation is applied to implemented API endpoints, including authentication, user, project, task, tag, and folder operations.

For example, password creation and password changes require the password to:

- Contain at least 8 characters.
- Contain at least one uppercase letter.
- Contain at least one lowercase letter.
- Contain at least one number.

Input validation improves data integrity but does not replace authorization.

## Authentication Validation

Protected routes validate authentication before executing protected application logic.

The authentication middleware:

- Requires a Bearer token.
- Verifies the access token.
- Validates the JWT payload.
- Extracts the authenticated user's ID.
- Places the identity in `req.userId`.

Malformed or invalid authentication tokens are rejected.

Authentication is performed by the backend and is not delegated to the frontend.

## Authorization

Authentication alone is not authorization.

A valid access token establishes the user's identity but does not automatically grant access to every resource.

The backend performs resource-level ownership checks before protected operations.

Current ownership checks include:

- Projects directly owned by users.
- Tags directly owned by users.
- Folders directly owned by users.
- Tasks through their project ownership.
- Task parent relationships.
- Task/tag relationships.
- Project/folder relationships.

For multi-resource operations, the backend validates the ownership of all relevant resources.

These controls help prevent IDOR and BOLA vulnerabilities.

Detailed requirements are documented in:

- `authorization.md`
- `data-isolation.md`

## Password Security

Passwords are sensitive credentials and must never be stored in plaintext.

The application uses bcrypt for password hashing.

During authentication, the supplied password is compared against the stored hash.

The application must never:

- Store plaintext passwords.
- Return passwords in API responses.
- Log passwords.
- Include passwords in error messages.
- Store passwords in source code.

Password hashes are also excluded from safe user responses.

## Refresh Token Security

Refresh tokens are long-lived authentication credentials and require additional protection.

The application:

- Gives refresh tokens a limited lifetime.
- Stores SHA-256 hashes rather than raw refresh tokens.
- Tracks expiration.
- Tracks revocation.
- Rotates refresh tokens after successful use.
- Revokes refresh tokens during logout.
- Revokes all active refresh tokens after password changes.

Refresh-token hashing uses SHA-256.

This is used because refresh tokens are long JWT values and bcrypt has a 72-byte input limitation.

The database therefore stores the SHA-256 digest of the refresh token rather than the raw credential.

## JWT Security

JWTs are signed using RS256.

Access tokens and refresh tokens have different purposes and lifetimes.

The access token payload contains:

```json
{
  "userId": "<user-id>",
  "type": "access"
}
```

The refresh token payload contains:

```json
{
  "userId": "<user-id>",
  "type": "refresh"
}
```

The backend verifies the token signature and expected token type before accepting a token for its intended operation.

JWT signing keys are managed by the backend and must remain server-side.

## Token Transport

Authentication tokens must be transmitted through secure channels.

Production deployments should use HTTPS.

Tokens should not be included in URLs because URLs may be exposed through:

- Browser history.
- Proxy logs.
- Server logs.
- Analytics systems.
- Referrer information.

Protected API requests use the HTTP authorization header:

```http
Authorization: Bearer <access-token>
```

## CORS

Cross-Origin Resource Sharing controls which browser origins may interact with the API.

CORS configuration must be reviewed before production deployment.

The production API should allow only the origins required by the application.

A permissive development configuration must not automatically be considered appropriate for production.

Production CORS restrictions remain part of the application's security hardening.

## HTTPS

Production authentication and application traffic must use HTTPS.

HTTPS protects data while it travels between:

```text
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

Database access is restricted to the backend application.

The application accesses PostgreSQL through Prisma.

Prisma's normal query APIs provide parameterized database operations, reducing the risk of SQL injection caused by directly concatenating untrusted values into SQL statements.

Raw SQL operations, when necessary, must be handled carefully and must never construct SQL statements through unsafe string concatenation.

## Database Constraints

Database constraints provide an additional layer of protection for data integrity.

Relevant constraints include:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Non-null constraints.
- Referential integrity.

These constraints do not replace authorization.

For example:

```text
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

Transactions should be used where the correctness of an operation depends on multiple database mutations succeeding together.

## XSS Prevention

User-provided content must be treated as untrusted.

The frontend should render user-controlled content safely and avoid inserting untrusted HTML directly into the page.

Dangerous patterns such as:

```tsx
dangerouslySetInnerHTML;
```

must not be used with unsanitized user content.

If rich HTML content is introduced in the future, it must be sanitized using an appropriate security strategy before rendering.

## Request and Response Data

API responses should expose only the data required by the client.

Sensitive internal fields must not be returned unnecessarily.

For example, user profile responses currently expose:

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

Sensitive task content should not be intentionally included in application logs.

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

The API uses structured error responses containing an error code and message.

Internal errors may be logged server-side when necessary, but sensitive values must still be excluded.

## Rate Limiting

Authentication endpoints are potential targets for:

- Brute-force attacks.
- Credential stuffing.
- Automated account creation.
- Token abuse.

Rate limiting should be considered for sensitive endpoints, particularly:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

Rate limiting is not currently part of the implemented security controls and should be considered before production deployment.

## Dependency Security

Application dependencies are part of the application's attack surface.

Dependencies should be kept reasonably up to date and security vulnerabilities should be monitored.

The project can periodically run dependency auditing tools such as:

```bash
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

These controls should only be considered implemented after they have been configured and verified in the deployment environment.

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
- Credential or secret rotation.

Monitoring requirements should be based on the application's production threat model.

## Security Testing

Security tests should explicitly verify authentication and authorization boundaries.

### Authentication

Tests should cover:

- Missing access token.
- Invalid access token.
- Expired access token.
- Malformed JWT.
- Invalid token payload.
- Invalid credentials.

### Refresh Tokens

Tests should cover:

- Invalid refresh token.
- Expired refresh token.
- Revoked refresh token.
- Reuse of a rotated refresh token.
- Refresh token belonging to another user.
- Password change revoking active refresh tokens.

### Authorization

Tests should cover:

- User A accessing User B's resource.
- User A modifying User B's resource.
- User A deleting User B's resource.
- Manipulation of resource IDs.
- Manipulation of ownership fields.
- Access to related resources belonging to another user.
- Cross-user task/tag relationships.
- Cross-user project/folder relationships.
- Cross-user parent/subtask relationships.

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
- Resource-level ownership checks.
- Cross-resource ownership validation.
- Safe user responses that do not expose password hashes.
- Prisma-based database access.
- Protection against client-controlled ownership identity.

## Future Hardening

The following areas should be implemented or reviewed as the application moves toward production:

- Automated IDOR/BOLA tests.
- Rate limiting.
- Production CORS restrictions.
- Security headers.
- HTTPS enforcement and deployment verification.
- Dependency vulnerability scanning.
- Secret scanning.
- Production database least-privilege configuration.
- Backup security and recovery procedures.
- Authentication monitoring.
- Security event logging.
- Periodic security review.

These items must not be represented as implemented controls until they have been configured and verified.

## Security Principle

The application should follow a defense-in-depth approach:

> Never rely on a single security control to protect sensitive data.

Authentication establishes identity.

Authorization establishes permission.

Input validation controls untrusted input.

Database constraints protect data integrity.

Secure secret management protects credentials.

HTTPS protects data in transit.

Logging and monitoring support detection and investigation.

Security testing verifies that these controls actually enforce the intended boundaries.
