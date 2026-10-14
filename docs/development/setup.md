# Development Setup

This document describes how to prepare the local development environment for the project.

## Prerequisites

The following tools are required:

- Node.js 22 or later.
- npm.
- Git.
- PostgreSQL-compatible database.
- A configured development environment for the frontend and backend.

The project currently uses PostgreSQL through Neon for the database.

## Clone the Repository

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd prodixus
```

## Install Dependencies

Install the project dependencies according to the workspace configuration:

```bash
npm install
```

Frontend and backend dependencies are maintained within their respective applications.

## Environment Variables

The backend requires environment variables for:

- Database connection.
- JWT private key.
- JWT public key.
- Server port.

The frontend requires the backend API URL.

The main variables are:

```text
DATABASE_URL
JWT_PRIVATE_KEY
JWT_PUBLIC_KEY
PORT
NEXT_PUBLIC_API_URL
```

Environment files must not be committed to the repository.

Sensitive credentials and private keys must remain outside version control.

## Database Setup

The backend uses Prisma to access PostgreSQL.

After configuring the database connection, apply the existing migrations:

```bash
npx prisma migrate deploy
```

During development, when creating and testing new schema changes, Prisma migrations can be created with:

```bash
npx prisma migrate dev
```

The Prisma schema is located at:

```text
backend/prisma/schema.prisma
```

## Generate Prisma Client

When required after schema changes, generate the Prisma Client:

```bash
npx prisma generate
```

## Running the Backend

The backend development server runs on port `3001` by default.

The development command is:

```bash
npm run dev
```

Run it from the backend application directory.

The API base URL is:

```text
http://localhost:3001/api
```

The health endpoint is available at:

```text
http://localhost:3001/health
```

## Running the Frontend

Run the frontend development server using its development script:

```bash
npm run dev
```

Run it from the frontend application directory.

The frontend uses `NEXT_PUBLIC_API_URL` to determine the backend API URL.

## Development Environment

The project is organized as a monorepo:

```text
prodixus/
├── frontend/
├── backend/
├── docs/
└── .github/
```

Frontend and backend applications are developed independently while remaining part of the same repository.

## Verification

Before starting development, verify that:

- Dependencies are installed.
- Required environment variables are configured.
- The database is accessible.
- Prisma migrations are applied.
- The backend starts successfully.
- The frontend starts successfully.

The backend health endpoint can be used to verify that the API is running:

```http
GET /health
```

## Related Documentation

- [Development Workflow](./workflow.md) — Development and Git workflow.
- [Code Quality](./code-quality.md) — Code quality tools and practices.
- [Database Documentation](../database/README.md) — Database structure and migrations.
- [Architecture Documentation](../architecture/README.md) — System architecture.
- [API Documentation](../api/README.md) — API endpoints and conventions.
- [Security Documentation](../security/README.md) — Security practices and authentication.
