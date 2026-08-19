# Frontend Architecture

This document describes the frontend application's architecture, internal organization, and the responsibilities of its main technologies and components.

## Overview

The frontend is a web application responsible for the presentation layer and client-side application behavior.

It is maintained as an independent application within the monorepo, with its internal structure organized around clearly defined responsibilities.

## Technology Stack

### Next.js

Next.js is the main framework used to build the frontend application.

It provides the foundation for:

- Application routing.
- Page and layout management.
- Rendering strategies.
- Application structure and build tooling.

### React

React is used as the primary UI library for building reusable interface components and managing client-side interactions.

### TypeScript

TypeScript is used throughout the frontend to provide static typing and improve reliability and maintainability.

It is used for components, application logic, data structures, forms, and shared frontend types.

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

Axios is used as the HTTP client for API requests.

It provides a centralized mechanism for configuring and executing HTTP requests and handling their responses.

### React Hook Form

React Hook Form is used for managing form state, input registration, and form submission.

### Zod

Zod is used for schema-based validation of frontend data.

It is integrated with React Hook Form where appropriate to validate form input against defined schemas.

## Architectural Organization

The frontend is organized by responsibility to maintain separation of concerns and make the application easier to maintain.

The architecture is structured around concerns such as:

- **UI Components** Reusable visual and interactive components.
- **Pages and Layouts** Application routes, page composition, and shared layouts.
- **Features** Functionality grouped by application domain or user-facing capability.
- **API Layer** Centralized interaction with backend services.
- **Forms and Validation** Form state management and client-side validation.
- **State Management** Management of client-side and server-side state according to their respective responsibilities.
- **Types and Schemas** Shared frontend types and data validation schemas.
- **Utilities** Reusable functionality that does not belong to a specific feature.

The exact directory structure may evolve as the application grows while maintaining these responsibility boundaries.

## State Management

The frontend distinguishes between different types of application state.

### Server State

Server state represents data retrieved from or synchronized with the backend.

TanStack Query is responsible for managing this state, including caching, synchronization, loading states, and refetching.

### Client State

Client state represents UI-specific or local application state that does not originate from the backend.

This state is managed within the frontend according to the needs of each feature or component.

Keeping server state and client state conceptually separate prevents unnecessary coupling between UI behavior and remote data.

## Forms and Validation

Forms are handled using React Hook Form, while Zod provides schema-based validation.

This separation allows form state management and data validation to remain distinct responsibilities.

Client-side validation is primarily intended to improve the user experience and provide immediate feedback.

Server-side validation remains authoritative for data received by the API.

## Architectural Boundaries

The frontend maintains clear boundaries between presentation, application features, state management, and external communication.

The main principles are:

- UI components should remain focused on presentation and interaction.
- Feature-specific logic should remain close to its corresponding feature.
- API communication should be centralized rather than distributed throughout UI components.
- Server state should be managed separately from local client state.
- Validation schemas should be reusable where appropriate.
- Application components should not contain direct database or infrastructure logic.

These boundaries help keep the frontend modular, maintainable, and adaptable as the application evolves.

## Related Documentation

- [System Overview](./system-overview.md): High-level system architecture.
- [Communication](./communication.md): Communication patterns between system components.
- [API Documentation](../api/README.md): API structure, conventions, and endpoints.
- [Security Documentation](../security/README.md): Authentication, authorization, and security practices.
