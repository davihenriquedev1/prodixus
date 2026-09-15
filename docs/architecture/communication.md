# Communication

This document describes how the main application components communicate, including communication protocols, data formats, authentication, request handling, and error responses.

## Communication Model

The system uses a request-response communication model between the frontend and backend.

```text
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       │ HTTP / JSON
       ▼
┌─────────────┐
│ Backend API │
└──────┬──────┘
       │
       │ Prisma
       ▼
┌─────────────┐
│ PostgreSQL  │
└─────────────┘
```

The frontend communicates with the backend through HTTP requests.

The backend handles request processing, authentication, authorization, validation, business logic, and database access.

The database is not exposed directly to the frontend.

## Frontend ↔ Backend

Communication between the frontend and backend is performed through the REST API.

The frontend sends HTTP requests to API endpoints and receives HTTP responses from the backend.

The API provides the communication boundary between the client application and the server application.

The specific endpoints and their request and response contracts are documented under [`api/`](../api/README.md).

## HTTP

HTTP is used as the transport protocol for API communication.

The backend uses standard HTTP methods according to the operation being performed:

- `GET` — Retrieve resources.
- `POST` — Create resources or perform operations.
- `PATCH` — Partially update resources.
- `DELETE` — Remove resources.

The API currently does not use `PUT` endpoints.

## Data Format

JSON is the standard data format exchanged between the frontend and backend.

A typical request may contain a JSON body:

```json
{
  "name": "Example project",
  "notes": "Example notes"
}
```

Responses use JSON for structured data and error responses.

Request data is validated by the backend using Zod schemas.

The exact request and response structures are defined in the API documentation.

## Authentication

Protected API requests require a valid JWT access token.

The frontend includes the access token in the `Authorization` header:

```text
Authorization: Bearer <access-token>
```

The backend validates the token and obtains the authenticated user's identity from its claims.

The application uses RS256-signed JWT access and refresh tokens.

Authentication does not rely on a user identifier supplied by the client.

## Authorization and Ownership

Authentication and authorization are enforced by the backend.

After authenticating the request, the backend uses the authenticated user's identity to determine whether the requested resource can be accessed or modified.

User-owned resources are checked against the authenticated user before the operation is performed.

The client cannot establish ownership by providing another user's identifier.

For resources that are not accessible to the authenticated user, the API may return a not-found response rather than exposing whether the resource exists.

## Request Flow

A typical API interaction follows this flow:

```text
User
 │
 ▼
Frontend
 │
 │ HTTP Request
 │ + Authorization
 ▼
Backend API
 │
 ├── Authenticate request
 ├── Validate request data
 ├── Authorize resource access
 ├── Execute application logic
 │
 ▼
Prisma
 │
 ▼
PostgreSQL
 │
 ▼
Prisma
 │
 ▼
Backend API
 │
 │ HTTP Response
 ▼
Frontend
 │
 ▼
User
```

The frontend is responsible for initiating the request and presenting the result.

The backend is responsible for processing the request and returning the appropriate response.

## Error Handling

API errors are communicated through HTTP status codes and structured JSON response bodies.

Responses use an application-specific error code together with a human-readable message.

Common error categories include:

- Invalid request data.
- Authentication failures.
- Resource not found.
- Business rule violations.
- Conflict errors.
- Unexpected server errors.

For example:

```json
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

The frontend should use the HTTP status and error code to determine the appropriate response without relying on backend implementation details.

The complete error conventions are documented in the [API Documentation](../api/README.md).

## Communication Boundaries

The communication architecture maintains the following boundaries:

- The frontend communicates with the backend through the HTTP API.
- The backend controls access to application data and business operations.
- The database is not directly accessible by the frontend.
- Authentication and authorization are enforced by the backend.
- The authenticated user identity is obtained from the validated JWT.
- Request data is validated by the backend.
- API request and response contracts are documented independently from the frontend implementation.
- Database access is performed by the backend through Prisma.

These boundaries provide a clear communication contract between the frontend and backend while keeping persistence concerns isolated from the client application.

## Related Documentation

- [System Overview](./system-overview.md) — High-level architecture and component relationships.
- [Frontend Architecture](./frontend.md) — Frontend architecture and responsibilities.
- [Backend Architecture](./backend.md) — Backend architecture and responsibilities.
- [API Documentation](../api/README.md) — API endpoints, conventions, and contracts.
- [Security Documentation](../security/README.md) — Authentication, authorization, and security requirements.
