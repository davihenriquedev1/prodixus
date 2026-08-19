# System Architecture

This section documents the overall architecture of the system, including its main components, application boundaries, communication patterns, and structural organization.

## Purpose

The purpose of this documentation is to provide a clear technical overview of how the system is structured and how its main components interact.

It serves as a reference for understanding the system architecture and maintaining consistency as the project evolves.

## Architecture Overview

The system follows a client-server architecture organized as a monorepo.

It is composed primarily of a frontend application, a backend application, and a relational database.

```text
┌─────────────────────┐
│       Frontend      │
│   Next.js + React   │
│     TypeScript      │
└──────────┬──────────┘
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│       Backend       │
│   Node.js + Express │
│     TypeScript      │
└──────────┬──────────┘
           │ Prisma
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│        Neon         │
└─────────────────────┘
```

The frontend is responsible for the user interface and client-side application behavior. The backend provides the API, business logic, authentication, validation, and data access. PostgreSQL is responsible for persistent data storage, accessed through Prisma.

## Documentation

- [System Overview](./system-overview.md): Overall system structure and main architectural components.
- [Repository Structure](./repo-structure.md): Monorepo structure and responsibilities of its main applications.
- [Frontend](./frontend.md): Frontend architecture, technologies, and responsibilities.
- [Backend](./backend.md): Backend architecture, technologies, and responsibilities.
- [Communication](./communication.md): Communication between the frontend, backend, and database.

## Architectural Principles

The system architecture follows these general principles:

- **Separation of concerns** Each application and component has a clearly defined responsibility.
- **Frontend/backend separation** The frontend communicates with the backend through an HTTP API and does not access the database directly.
- **Centralized data access** Database access is handled by the backend through Prisma.
- **Independent application boundaries** Frontend and backend remain logically independent while being maintained within the same repository.
- **Type safety** TypeScript is used across the application layers to improve reliability and maintainability.
- **Incremental architecture** The architecture is kept simple at the current stage and can evolve as the system grows.
