# Prodixus

A modern productivity app for managing projects, tasks, and personal workflows.

## Overview

Prodixus is a full-stack productivity application designed to help users organize their projects and tasks in one place. It combines a responsive interface with a REST API, authentication, and persistent data storage.

## Features

- **Authentication** — User registration, login, protected routes, and token-based authentication.
- **Project management** — Create, edit, complete, archive, and delete projects.
- **Task management** — Create, edit, complete, archive, delete, and move tasks between projects.
- **Subtasks** — Organize tasks into parent-child hierarchies.
- **Task details** — Manage notes, priorities, estimated duration, start dates, and due dates.
- **Tags** — Create and manage tags, associate them with tasks, and remove associations.
- **Folder management** — Organize projects into folders and manage folder hierarchies.
- **Task organization** — Filter and organize information through project and task views.
- **User settings** — Manage user-related settings.
- **Responsive interface** — Navigate the application through a consistent interface across screen sizes.
- **API security** — Server-side authentication, resource ownership validation, and protected user data.
- **Automated CI** — GitHub Actions workflow for linting, type checking, and builds.
- **Error handling** — Consistent API error handling and user-facing feedback.

## Tech Stack

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form and Zod

**Backend**

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication

## Project Structure

```text
prodixus/
├── frontend/
├── backend/
├── docs/
└── .github/
```

## Live Demo

**Application:** [Prodixus](https://prodixus.vercel.app)

**API:** [Prodixus API](https://prodixus-api.onrender.com)

## Documentation

Technical documentation covering the architecture, API, security, and other implementation details is available in the [`docs/`](./docs) directory.

## Author

Developed by [Davi Henrique](https://github.com/davihenriquedev1).

```

```
