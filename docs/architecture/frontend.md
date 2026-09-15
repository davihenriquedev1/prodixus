# Frontend Architecture

This document describes the frontend application's architecture, internal organization, and the responsibilities of its main technologies and components.

## Overview

The frontend is a web application responsible for the presentation layer and client-side application behavior.

It is maintained as a separate application within the monorepo and communicates with the backend exclusively through the HTTP API.

## Technology Stack

### Next.js

Next.js is the main framework used to build the frontend application.

It provides the foundation for:

- Application routing.
- Page and layout management.
- Rendering strategies.
- Application structure and build tooling.

The application uses the Next.js App Router.

### React

React is used as the primary UI library for building reusable interface components and managing client-side interactions.

### TypeScript

TypeScript is used throughout the frontend to provide static typing and improve reliability and maintainability.

It is used for components, application logic, data structures, forms, and frontend types.

### Tailwind CSS

Tailwind CSS is used for styling the application's user interface through a utility-based approach.

### TanStack Query

TanStack Query is used to manage server state and asynchronous data operations.

It provides mechanisms for:

- Fetching server data.
- Caching.
- Synchronizing server state.
- Managing loading and error states.
- Refetching data when required.

### Axios

Axios is used as the HTTP client for communication with the backend API.

It provides a centralized mechanism for configuring and executing HTTP requests and handling their responses.

### React Hook Form

React Hook Form is used for managing form state, input registration, and form submission.

### Zod

Zod is used for schema-based validation of frontend data.

It can be integrated with React Hook Form to validate form input and provide immediate feedback to users.

Frontend validation improves the user experience but does not replace backend validation.

### Lucide

Lucide is used to provide interface icons throughout the application.

### Sonner

Sonner is used to display application notifications and user feedback messages.

## Architectural Organization

The frontend is organized by responsibility to maintain separation of concerns and keep feature-specific behavior manageable.

The main concerns include:

- **UI Components** — Reusable visual and interactive components.
- **Pages and Layouts** — Application routes, page composition, and shared layouts.
- **Features** — Functionality grouped by application domain or user-facing capability.
- **API Layer** — Centralized communication with backend services.
- **Forms and Validation** — Form state management and client-side validation.
- **State Management** — Management of server state and client-side state according to their respective responsibilities.
- **Types and Schemas** — Frontend types and validation schemas.
- **Utilities** — Reusable functionality that does not belong to a specific feature.

The exact directory structure may evolve as the application grows while preserving these responsibility boundaries.

## API Communication

The frontend communicates with the backend through the REST API.

API communication is handled through the HTTP client and the application's API layer rather than directly inside database or infrastructure code.

The frontend is responsible for:

- Sending API requests.
- Providing authentication credentials when required.
- Processing API responses.
- Handling loading and error states.
- Updating the interface according to the returned data.

The frontend does not access PostgreSQL or Prisma directly.

## State Management

The frontend distinguishes between server state and client state.

### Server State

Server state represents data retrieved from or synchronized with the backend.

TanStack Query is responsible for managing this state, including caching, synchronization, loading states, and refetching.

### Client State

Client state represents UI-specific or local application state that does not originate from the backend.

This state is managed according to the needs of each feature or component.

Keeping server state and client state conceptually separate prevents unnecessary coupling between UI behavior and remote data.

## Forms and Validation

Forms are handled using React Hook Form, while Zod provides schema-based validation.

This separation allows form state management and data validation to remain distinct responsibilities.

Client-side validation provides immediate feedback and improves the user experience.

However, the backend remains authoritative for all data received by the API.

The frontend must not rely on client-side validation for security, authorization, or resource ownership.

## Authentication

The frontend participates in authentication by communicating with the backend authentication API and providing access credentials when making protected requests.

Authentication decisions are made by the backend.

The frontend must not determine whether a user is authorized to access another user's resources.

Resource ownership and authorization remain backend responsibilities.

## Error and User Feedback

The frontend handles API and application errors at the appropriate UI boundaries.

User-facing feedback may be presented through application notifications using Sonner.

Error messages displayed to users should be appropriate for the context and should not expose internal backend implementation details.

## Architectural Boundaries

The frontend maintains clear boundaries between presentation, application features, state management, validation, and external communication.

The main principles are:

- UI components should remain focused on presentation and interaction.
- Feature-specific logic should remain close to its corresponding feature.
- API communication should be centralized rather than distributed unnecessarily throughout UI components.
- Server state should be managed separately from local client state.
- Client-side validation should improve user experience without being treated as a security boundary.
- Authentication and authorization decisions remain the responsibility of the backend.
- Frontend components should not contain direct database or infrastructure logic.

These boundaries help keep the frontend modular, maintainable, and aligned with the backend API.

## Related Documentation

- [System Overview](./system-overview.md) — High-level system architecture.
- [Communication](./communication.md) — Communication patterns between system components.
- [API Documentation](../api/README.md) — API structure, conventions, and endpoints.
- [Security Documentation](../security/README.md) — Authentication, authorization, and security practices.
