# System Overview

This document provides a high-level overview of the system architecture, its main components, their responsibilities, and the relationships between them.

## Project Architecture Overview

The system follows a client-server architecture organized as a monorepo.

The main components are the frontend application, backend application, and PostgreSQL database. Prisma is used by the backend as the database access layer, while Neon provides the PostgreSQL database infrastructure.

![System Architecture](./images/system-overview.png)

## Main Components

### User

The user interacts with the system through the frontend application.

The user does not communicate directly with the backend infrastructure or database. Application interactions are handled through the frontend.

### Frontend

The frontend is responsible for the client-side application and user interface.

**Technology:**

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- TanStack Query

**Responsibilities:**

- Render the user interface.
- Handle user interactions.
- Manage client-side application behavior.
- Validate user input.
- Communicate with the backend API.
- Manage API requests and server state.
- Display data and application responses to the user.

The frontend does not access the database directly.

### Backend

The backend provides the REST API consumed by the frontend and contains the main application logic.

**Technology:**

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT
- bcrypt

**Responsibilities:**

- Expose the application API.
- Process incoming requests.
- Validate request data.
- Authenticate users.
- Authorize access to resources.
- Enforce resource ownership.
- Execute business logic.
- Manage database access.
- Return appropriate HTTP responses.

The backend acts as the main boundary between the client application and the persistence layer.

### Prisma

Prisma is used by the backend as the database access layer.

**Responsibilities:**

- Provide typed access to PostgreSQL.
- Map application models to database entities.
- Execute database queries.
- Provide the Prisma schema used to define the database structure.
- Support the database migration workflow.

The frontend does not interact with Prisma directly.

### PostgreSQL

PostgreSQL is the relational database used for persistent data storage.

**Responsibilities:**

- Store application data.
- Maintain relationships between entities.
- Enforce database constraints.
- Provide persistent and consistent data storage.

The database is accessed by the backend through Prisma.

### Neon

Neon provides the PostgreSQL database infrastructure used by the system.

It hosts the project's PostgreSQL database consumed by the backend through Prisma.

## Component Relationships

The main components interact through clearly defined boundaries:

```text
User
  │
  ▼
Frontend
  │
  │ HTTP / JSON
  ▼
Backend
  │
  │ Prisma
  ▼
PostgreSQL
  │
  │ Hosted by
  ▼
Neon
```

The frontend communicates with the backend through HTTP requests using JSON.

The backend handles authentication, authorization, validation, business logic, and database access before returning the appropriate response.

## Backend Structure

The backend separates application responsibilities into distinct layers.

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
 Controllers
     │
     ▼
  Services
     │
     ▼
Repositories
     │
     ▼
   Prisma
     │
     ▼
 PostgreSQL
```

Validators are used to validate request data at the application boundary.

Authentication middleware is responsible for validating access tokens and providing the authenticated user's identity to the request context.

Services contain business rules and ownership checks, while repositories are responsible for database operations.

This separation keeps HTTP handling, business logic, validation, and data access from being unnecessarily coupled.

## Application Boundaries

The system follows a clear separation of responsibilities between its main layers.

### Presentation Layer

The frontend represents the presentation layer and is responsible for the user interface and client-side behavior.

### Application Layer

The backend represents the application layer and is responsible for API handling, authentication, authorization, validation, business logic, and resource ownership.

### Persistence Layer

Prisma and PostgreSQL form the persistence layer responsible for database access and persistent data storage.

These boundaries help maintain separation of concerns and prevent the frontend from accessing persistence infrastructure directly.

## Security Boundary

The backend is the authoritative security boundary of the application.

Authentication is handled through JWT access tokens.

Authorization and resource ownership are enforced by the backend rather than trusted from client-provided identifiers.

The authenticated user's identity is obtained from the validated JWT, and services verify that resources belong to that user before allowing access or modification.

This ensures that client requests cannot determine ownership simply by providing another user's resource identifier.

## General Data Flow

A typical interaction follows this general flow:

1. The user performs an action through the frontend.
2. The frontend processes the interaction and sends an HTTP request to the backend.
3. The backend authenticates the request when authentication is required.
4. Request data is validated.
5. The backend executes the required application logic and ownership checks.
6. If persistent data is required, the backend uses Prisma to interact with PostgreSQL.
7. PostgreSQL returns the requested data or operation result.
8. The backend processes the result and returns an HTTP response.
9. The frontend receives the response and updates the user interface.

The main request flow is:

**User → Frontend → Backend → Prisma → PostgreSQL**

The response follows the reverse direction:

**PostgreSQL → Prisma → Backend → Frontend → User**

## Architectural Boundaries

The following boundaries are maintained throughout the system:

- The user interacts with the frontend.
- The frontend communicates with the backend through the API.
- The frontend does not access the database directly.
- The backend is responsible for authentication and authorization.
- The backend is responsible for business logic and ownership checks.
- Prisma is used by the backend as the database access layer.
- PostgreSQL is responsible for persistent data storage.
- Infrastructure concerns remain separate from application responsibilities.

These boundaries provide a clear structure for the current system while keeping the architecture simple enough to evolve as the application grows.
