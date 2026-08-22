# ADR-006: Environment Configuration

## Status

Accepted

## Context

The system requires environment-specific configuration for local development, testing, and deployment.

Frontend and backend applications have different configuration requirements, and sensitive credentials must not be exposed to the client-side application.

The configuration strategy must therefore provide clear separation between frontend and backend variables while keeping local development simple.

## Decision

The system will use separate environment files for the frontend and backend.

Each application will maintain its own environment configuration:

```text
repository/
├── frontend/
│   └── .env
├── backend/
│   └── .env
└── docs/
```

The backend is responsible for all sensitive environment variables.

## Backend Environment

The backend will contain sensitive configuration such as database credentials, authentication secrets, and server configuration.

Example:

```env
DATABASE_URL="postgresql://..."

JWT_SECRET=""

JWT_REFRESH_SECRET=""

PORT=3001
```

### Responsibilities

- `DATABASE_URL` — connection string used to access PostgreSQL.
- `JWT_SECRET` — secret used for access token signing and validation.
- `JWT_REFRESH_SECRET` — secret used for refresh token signing and validation.
- `PORT` — port used by the backend API.

Backend environment variables must never be exposed to the frontend.

## Frontend Environment

The frontend will contain only configuration that is safe to expose to the client.

Example:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

The `NEXT_PUBLIC_` prefix is used for values that must be available to the browser through Next.js.

No database credentials, authentication secrets, or other sensitive values should be placed in the frontend environment.

## Environment Files and Version Control

Environment files containing secrets must not be committed to the repository.

The repository will provide example environment configuration when necessary without including actual credentials.

For example:

```text
.env
.env.local
.env.production
```

Sensitive values should be provided through the local development environment or the deployment platform's environment configuration.

## Configuration Responsibility

Configuration ownership follows the application's responsibility.

```text
Frontend
   │
   └── Public client configuration
           │
           └── API URL

Backend
   │
   ├── Database configuration
   ├── Authentication secrets
   └── Server configuration
```

The frontend communicates with the backend through the configured API URL rather than accessing the database directly.

## Rationale

Separating environment configuration by application provides a clear boundary between client-side and server-side configuration.

Keeping sensitive configuration exclusively in the backend prevents secrets such as database credentials and JWT signing keys from being exposed to the browser.

The approach is also simple enough for the current monorepo structure without introducing a centralized configuration system that would add unnecessary complexity.

## Alternatives Considered

### Single root `.env` file

Rejected because frontend and backend have different configuration responsibilities and a shared environment file could make the separation of sensitive and public variables less clear.

### Frontend accessing the database directly

Rejected because database access must remain under the backend's control.

### Centralized configuration package

Rejected for the current system because it would introduce additional abstraction without a current requirement for shared configuration logic.

## Consequences

### Positive

- Clear separation between public and sensitive configuration.
- Reduced risk of exposing backend secrets.
- Frontend and backend remain independently configurable.
- Simple local development setup.
- Compatible with deployment platforms that provide environment variables.

### Negative

- Developers must maintain separate environment files.
- Configuration values may need to be defined independently for different environments.
- Deployment environments must be configured correctly for both applications.

## Related Decisions

- [ADR-001: Technologies Chosen](./001-technologies.md)
- [ADR-002: Monorepo Architecture](./002-monorepo-architecture.md)
- [ADR-003: Application Architectures](./003-application-architectures.md)
