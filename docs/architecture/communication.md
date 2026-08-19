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

The frontend communicates with the backend through HTTP requests. The backend handles application processing and communicates with the database through Prisma.

The database is not exposed directly to the frontend.

## Frontend ↔ Backend

Communication between the frontend and backend is performed through an HTTP-based API.

The frontend sends requests to API endpoints and receives responses from the backend.

The communication layer is designed to keep the two applications independently deployable and maintain a clear boundary between client-side and server-side responsibilities.

### HTTP

HTTP is used as the transport protocol for API communication.

Requests use standard HTTP methods according to the operation being performed:

- `GET` Retrieve data.
- `POST` Create resources or perform operations.
- `PUT` Replace an existing resource.
- `PATCH` Partially update a resource.
- `DELETE` Remove a resource.

The specific endpoints and their contracts are documented under [`api/`](../api/README.md).

## Data Format

JSON is the standard data format exchanged between the frontend and backend.

A typical request may contain a JSON body:

```json
{
  "name": "Example",
  "description": "Example description"
}
```

Responses also use JSON when returning structured data.

The exact request and response schemas are defined by the API documentation and validated by the appropriate application layer.

## Authentication

Protected API requests require authentication.

The frontend is responsible for including the required authentication information when communicating with protected endpoints.

The backend validates the authentication information and determines whether the request is authorized to access the requested resource.

Authentication mechanisms and security requirements are documented in [`security/`](../security/README.md).

## Request Flow

A typical API interaction follows this sequence:

```text
User
 │
 ▼
Frontend
 │
 │ HTTP Request
 │ + Authentication
 ▼
Backend API
 │
 ├── Validate request
 ├── Authenticate / authorize
 ├── Execute application logic
 │
 ▼
Database
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

API errors are communicated through HTTP status codes and structured response bodies.

The backend should return responses that allow the frontend to distinguish between common categories of failure, such as:

- Invalid request data.
- Authentication failures.
- Authorization failures.
- Resource not found.
- Business rule violations.
- Unexpected server errors.

The frontend should use these responses to provide appropriate feedback to the user without relying on backend implementation details.

The specific error response format is defined in the API documentation.

## Communication Boundaries

The communication architecture maintains the following boundaries:

- The frontend communicates with the backend through the HTTP API.
- The backend controls access to application data and business operations.
- The database is not directly accessible by the frontend.
- Authentication and authorization are enforced by the backend.
- API request and response contracts are defined independently from the frontend implementation.

These boundaries allow the frontend and backend to evolve independently while maintaining a stable communication contract.

## Related Documentation

- [System Overview](./system-overview.md): High-level architecture and component relationships.
- [Frontend Architecture](./frontend.md): Frontend architecture and responsibilities.
- [Backend Architecture](./backend.md): Backend architecture and responsibilities.
- [API Documentation](../api/README.md): API endpoints, conventions, and contracts.
- [Security Documentation](../security/README.md): Authentication and security requirements.
