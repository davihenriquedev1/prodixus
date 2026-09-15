# Database Documentation

Documentation for the application's database structure, relationships, and migrations.

## Overview

The application uses PostgreSQL as its relational database and Prisma as the ORM.

The database stores application data such as users, projects, tasks, tags, folders, and authentication tokens.

## Database

### PostgreSQL

PostgreSQL is used as the application's primary relational database.

The database connection is configured through the `DATABASE_URL` environment variable.

### Prisma

Prisma is used to:

- Define the database schema.
- Generate the database client.
- Create and apply migrations.
- Access database data through the application.

The Prisma schema is located at:

```text
backend/prisma/schema.prisma
```

## Database Structure

The main database entities are:

- `User` — application users.
- `UserSettings` — user-specific settings.
- `Project` — projects owned by users.
- `Task` — tasks belonging to projects.
- `Tag` — tags owned by users.
- `TaskTag` — relationship between tasks and tags.
- `Folder` — folders owned by users and their hierarchy.
- `RefreshToken` — stored refresh tokens used for authentication.

More details about the models and their fields are available in [Schema](./schema.md).

## Relationships

The database uses relationships to maintain associations between users and their resources.

Examples include:

- Users have projects and tags.
- Projects contain tasks.
- Tasks can have subtasks.
- Tasks can be associated with tags.
- Folders can contain subfolders.
- Projects can belong to folders.
- Users can have refresh tokens.

See [Relationships](./relationships.md) for the complete relationship structure.

## Migrations

Database structure changes are managed through Prisma migrations.

Migrations are stored in:

```text
backend/prisma/migrations/
```

See [Migrations](./migrations.md) for migration commands and workflow.

## Related Documentation

- [Schema](./schema.md)
- [Relationships](./relationships.md)
- [Migrations](./migrations.md)
- [API Documentation](../api/README.md)
- [Architecture Documentation](../architecture/README.md)
- [Security Documentation](../security/README.md)
