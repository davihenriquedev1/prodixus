# Repository Structure

This document describes the organization of the repository and the responsibilities of its main directories and applications.

## Overview

The project uses a monorepo structure to maintain the frontend, backend, documentation, and repository configuration within a single Git repository.

```text
project-root/

├── frontend/
├── backend/
├── docs/
├── .github/
├── .gitignore
├── package.json
└── ...
```

![Repository Structure](./images/repo-structure.png)

The frontend and backend are maintained as separate applications while sharing the same repository and version control history.

## Directory Structure

### `frontend/`

Contains the frontend application.

The frontend is responsible for the user interface, client-side behavior, navigation, form handling, and communication with the backend API.

The frontend has its own dependencies, configuration, and application source code.

### `backend/`

Contains the backend application.

The backend is responsible for the REST API, authentication, authorization, validation, business logic, and access to persistent data.

The backend has its own dependencies, configuration, application source code, and Prisma database configuration.

The main backend database-related files and directories include:

```text
backend/

├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
└── ...
```

### `docs/`

Contains the project's technical documentation.

Documentation is organized by technical domain:

```text
docs/

├── api/
├── architecture/
├── database/
├── decisions/
├── development/
├── diagrams/
└── security/
```

Each directory contains documentation related to a specific area of the system.

### `.github/`

Contains repository-level GitHub configuration and automation.

The directory currently contains the project's GitHub Actions CI workflow and may also contain other GitHub-specific configuration such as issue or pull request templates.

## Application Separation

The frontend and backend are logically separate applications within the same repository.

Each application:

- Has its own source code.
- Manages its own dependencies.
- Has its own application-specific configuration.
- Has a clearly defined responsibility.
- Can be developed independently at the implementation level.

The applications communicate through the backend API rather than directly accessing each other's internal implementation.

The monorepo provides a shared version control boundary while preserving clear application boundaries.

## Shared Configuration

Repository-level configuration is maintained at the root when it applies to the project as a whole.

Application-specific configuration remains within the corresponding application directory.

This distinction prevents application-specific settings from being unnecessarily shared between the frontend and backend.

## Documentation and Development Resources

Project-wide technical documentation is maintained under `docs/`.

Repository-level automation and GitHub configuration are maintained under `.github/`.

Application-specific source code and configuration remain within their respective application directories.

## Repository-Level Files

Files located at the repository root are used for project-wide configuration and metadata.

Examples include:

- `package.json`
- `.gitignore`
- Repository-level configuration files

Root-level configuration should only contain settings that apply to the repository as a whole.

## Related Documentation

- [System Overview](./system-overview.md) — High-level system architecture and component relationships.
- [Frontend](./frontend.md) — Frontend architecture and responsibilities.
- [Backend](./backend.md) — Backend architecture and responsibilities.
