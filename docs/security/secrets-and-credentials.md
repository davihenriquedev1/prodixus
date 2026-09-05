# Secrets and Credentials

This document defines how application secrets, credentials, and other sensitive configuration values must be managed in Taskify.

Secrets are server-side configuration and must never be exposed to clients or committed to source control.

## Sensitive Configuration

Taskify uses sensitive configuration values for authentication and database access.

Examples include:

- Database connection strings.
- JWT private keys.
- JWT public keys.
- Refresh-token signing keys.
- Database credentials.
- Environment-specific configuration.
- Other credentials introduced as the application grows.

These values must be provided through the server environment rather than hardcoded in application source code.

## Environment Variables

Sensitive configuration should be loaded from environment variables.

The backend uses environment-specific configuration for values required to connect to external services and sign authentication tokens.

Environment files containing secrets must not be committed to source control.

A local development environment may use a `.env` file, but the file must be excluded from Git through `.gitignore`.

Example:

```text
.env
.env.local
.env.*.local
```

The exact ignore rules should match the project's environment-file strategy.

## JWT Signing Keys

Taskify uses asymmetric JWT signing with RS256.

This involves a private key and a public key.

The private key is security-sensitive and must remain exclusively on the server.

```text
Private Key
    │
    └── Server only

Public Key
    │
    └── Verification
```

The private signing key must never be:

- Sent to the frontend.
- Included in API responses.
- Committed to Git.
- Embedded directly in source code.
- Printed in logs.
- Included in client-side bundles.

The public key does not provide the same level of secrecy as the private key, but it should still be managed through the application's configuration rather than unnecessarily duplicated throughout the codebase.

## Database Credentials

The database connection string may contain:

- Database username.
- Database password.
- Database host.
- Database name.
- Connection parameters.

The complete connection string must be treated as a secret when it contains credentials.

Database credentials must remain server-side.

They must never be:

- Returned by an API endpoint.
- Included in frontend environment variables.
- Logged.
- Committed to source control.
- Exposed in error responses.

The backend connects to PostgreSQL through Prisma.

```text
Client
  │
  │ API request
  ▼
Backend
  │
  │ Database credentials
  ▼
Prisma
  │
  ▼
PostgreSQL
```

The client communicates with the API and does not require direct database credentials.

## Frontend Environment Variables

Environment variables exposed to the frontend must be considered public.

In frameworks such as Next.js, variables intentionally exposed to client-side code can become visible to users.

Therefore, secrets must never be placed in variables intended for client exposure.

A frontend variable such as:

```text
NEXT_PUBLIC_API_URL
```

may contain the public API URL.

It must not contain:

- JWT private keys.
- Database credentials.
- Database connection strings.
- Passwords.
- Signing secrets.
- Other server-side secrets.

## Passwords

User passwords are credentials and require special handling.

Passwords must never be stored in plaintext.

Taskify hashes passwords with bcrypt before storing them in the database.

The authentication system therefore stores:

```text
User Password
      │
      ▼
   bcrypt
      │
      ▼
Password Hash
      │
      ▼
Database
```

The original password cannot be recovered from the stored hash through the application's normal authentication flow.

Password hashes must also never be returned through API responses.

## Refresh Tokens

Refresh tokens are authentication credentials and must be treated as sensitive.

Taskify does not store raw refresh tokens in the database.

Instead:

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

When a refresh token is presented to the API, the server hashes the supplied value and compares the resulting digest with the stored database record.

This means a database record does not directly contain the original refresh token.

## Access Tokens

Access tokens are also credentials.

They must not be:

- Logged.
- Included in URLs.
- Stored in application logs.
- Returned as part of unrelated API responses.
- Exposed to third parties.

The client should send the access token through the intended authentication mechanism:

```http
Authorization: Bearer <access-token>
```

Production deployments must use HTTPS so authentication credentials are protected while being transmitted.

## Secret Rotation

Secrets should be rotatable without requiring source-code changes.

Secret rotation may include:

- JWT signing keys.
- Database passwords.
- API keys.
- Third-party service credentials.

When a sensitive credential is suspected to have been exposed, it should be replaced immediately.

If a JWT signing key is compromised, all tokens that depend on the compromised signing key must be considered potentially compromised and an appropriate token invalidation strategy must be applied.

## Secret Exposure

Sensitive values must not appear in:

- Source code.
- Git commits.
- Pull requests.
- Issue descriptions.
- Documentation examples containing real credentials.
- Screenshots.
- Logs.
- Error responses.
- Client-side bundles.

Examples in documentation must use placeholders:

```text
DATABASE_URL=<database-connection-string>
JWT_PRIVATE_KEY=<private-key>
JWT_PUBLIC_KEY=<public-key>
JWT_REFRESH_SECRET=<refresh-secret>
```

Real credentials must never be used in examples.

## Git Security

Before committing changes, developers should verify that sensitive files and values are not included in the commit.

Useful checks include:

```bash
git status
git diff --cached
```

Developers should inspect staged changes before pushing them to a remote repository.

If a secret is accidentally committed, simply deleting it in a later commit is not sufficient because the value may remain in Git history.

The exposed credential must be considered compromised and rotated.

## Production Configuration

Production secrets should be managed through the deployment environment or a dedicated secret-management system.

Secrets should not be manually embedded into the application source code.

Production configuration should follow the principle of least privilege.

For example:

```text
Application
    │
    ├── Only required secrets
    │
    ├── Only required database permissions
    │
    └── Only required external-service permissions
```

A production application should not have broader credentials than necessary for its operation.

## Database Access

The application database credentials should provide only the permissions required by the application.

Database access should follow least privilege.

Where supported by the infrastructure, separate credentials or roles should be considered for different environments and operational purposes.

Development credentials must not be reused unnecessarily in production.

Production credentials must not be shared casually between developers or stored in personal files without appropriate protection.

## Logs

Sensitive credentials must never be written to logs.

This includes:

- Passwords.
- Password hashes.
- Access tokens.
- Refresh tokens.
- JWT private keys.
- Database passwords.
- Complete database connection strings.
- API keys.

Logs should contain enough information to diagnose application behavior without exposing authentication credentials or private user data.

## Error Messages

API errors must not expose secrets or internal configuration.

Error responses should not reveal:

- Environment variables.
- Database connection strings.
- Private keys.
- Password hashes.
- Authentication tokens.
- Internal infrastructure credentials.

Detailed internal errors may be logged securely on the server when necessary, but sensitive values must still be excluded.

## Current Implementation

The current application already follows several important practices:

- Passwords are hashed with bcrypt.
- Refresh tokens are hashed with SHA-256 before database storage.
- JWT signing configuration is handled by the backend.
- Database access is performed by the backend through Prisma.
- Password hashes are not included in safe user responses.
- Authentication credentials are not part of the user profile response.

## Future Hardening

The following practices should be reviewed as the application moves toward production:

- Verify that all secret-bearing environment files are excluded from Git.
- Review production secret storage.
- Establish a documented secret-rotation procedure.
- Review database roles and permissions.
- Review deployment-provider secret configuration.
- Add automated secret scanning where appropriate.
- Review logs for accidental credential exposure.
- Review frontend bundles for accidentally exposed secrets.
- Establish an incident procedure for compromised credentials.

These controls should only be considered implemented after they have been configured and verified.

## Security Principle

The core rule for secrets is:

> If the client does not need a value to perform its intended function, the value must remain on the server.

Credentials should be minimized, protected, rotated when necessary, and excluded from source control and logs.
