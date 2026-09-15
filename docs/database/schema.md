# Database Schema

The application uses PostgreSQL as its relational database and Prisma as the ORM.

The schema is defined in:

```text
backend/prisma/schema.prisma
```

## Models

### User

Stores application user accounts.

| Field          | Type          | Required | Description             |
| -------------- | ------------- | -------- | ----------------------- |
| `id`           | String (UUID) | Yes      | Unique user identifier. |
| `name`         | String        | Yes      | User name.              |
| `email`        | String        | Yes      | Unique user email.      |
| `passwordHash` | String        | Yes      | Hashed user password.   |
| `createdAt`    | DateTime      | Yes      | Creation timestamp.     |
| `updatedAt`    | DateTime      | Yes      | Last update timestamp.  |

Database table: `users`

Relationships:

- One optional `UserSettings`.
- Many `Project`.
- Many `Tag`.
- Many `Folder`.
- Many `RefreshToken`.

---

### UserSettings

Stores settings associated with a user.

| Field       | Type          | Required | Default   | Description                 |
| ----------- | ------------- | -------- | --------- | --------------------------- |
| `id`        | String (UUID) | Yes      | UUID      | Unique settings identifier. |
| `userId`    | String (UUID) | Yes      | —         | Associated user ID.         |
| `theme`     | String        | Yes      | `system`  | User interface theme.       |
| `language`  | String        | Yes      | `en-US`   | User language.              |
| `updatedAt` | DateTime      | Yes      | Automatic | Last update timestamp.      |

Database table: `user_settings`

`userId` is unique, enforcing a one-to-one relationship with `User`.

Deleting the associated user also deletes the settings.

---

### RefreshToken

Stores refresh tokens used by the authentication system.

| Field       | Type          | Required | Description                       |
| ----------- | ------------- | -------- | --------------------------------- |
| `id`        | String (UUID) | Yes      | Unique token identifier.          |
| `tokenHash` | String        | Yes      | Unique hash of the refresh token. |
| `userId`    | String (UUID) | Yes      | Associated user ID.               |
| `expiresAt` | DateTime      | Yes      | Token expiration timestamp.       |
| `revokedAt` | DateTime      | No       | Token revocation timestamp.       |
| `createdAt` | DateTime      | Yes      | Creation timestamp.               |

Database table: `refresh_tokens`

An index is defined on `userId`.

Deleting the associated user also deletes their refresh tokens.

---

### Project

Stores projects owned by users.

| Field               | Type          | Required | Description                |
| ------------------- | ------------- | -------- | -------------------------- |
| `id`                | String (UUID) | Yes      | Unique project identifier. |
| `name`              | String        | Yes      | Project name.              |
| `notes`             | String        | No       | Project notes.             |
| `completed`         | Boolean       | Yes      | Completion status.         |
| `archived`          | Boolean       | Yes      | Archive status.            |
| `estimatedDuration` | Int           | No       | Estimated duration.        |
| `dueAt`             | DateTime      | No       | Project due date.          |
| `primaryColor`      | String        | No       | Primary project color.     |
| `accentColor`       | String        | No       | Accent project color.      |
| `errorColor`        | String        | No       | Error project color.       |
| `userId`            | String (UUID) | Yes      | Owner user ID.             |
| `createdAt`         | DateTime      | Yes      | Creation timestamp.        |
| `updatedAt`         | DateTime      | Yes      | Last update timestamp.     |
| `folderId`          | String (UUID) | No       | Associated folder ID.      |

Database table: `projects`

Relationships:

- Belongs to one `User`.
- Optionally belongs to one `Folder`.
- Has many `Task`.

Deleting the associated user deletes the project.

Deleting an associated folder sets `folderId` to `NULL`.

---

### Task

Stores tasks belonging to projects.

| Field               | Type          | Required | Description             |
| ------------------- | ------------- | -------- | ----------------------- |
| `id`                | String (UUID) | Yes      | Unique task identifier. |
| `title`             | String        | Yes      | Task title.             |
| `notes`             | String        | No       | Task notes.             |
| `priority`          | Int           | Yes      | Task priority.          |
| `estimatedDuration` | Int           | No       | Estimated duration.     |
| `startAt`           | DateTime      | No       | Task start date.        |
| `dueAt`             | DateTime      | No       | Task due date.          |
| `completed`         | Boolean       | Yes      | Completion status.      |
| `archived`          | Boolean       | Yes      | Archive status.         |
| `projectId`         | String (UUID) | Yes      | Project ID.             |
| `parentId`          | String (UUID) | No       | Parent task ID.         |
| `createdAt`         | DateTime      | Yes      | Creation timestamp.     |
| `updatedAt`         | DateTime      | Yes      | Last update timestamp.  |

Database table: `tasks`

Relationships:

- Belongs to one `Project`.
- Optionally belongs to one parent `Task`.
- Can have many subtasks.
- Can have many `TaskTag` associations.

Deleting the associated project deletes its tasks.

Deleting a parent task also deletes its subtasks.

---

### Tag

Stores tags owned by users.

| Field       | Type          | Required | Description            |
| ----------- | ------------- | -------- | ---------------------- |
| `id`        | String (UUID) | Yes      | Unique tag identifier. |
| `name`      | String        | Yes      | Tag name.              |
| `color`     | String        | Yes      | Tag color.             |
| `userId`    | String (UUID) | Yes      | Owner user ID.         |
| `createdAt` | DateTime      | Yes      | Creation timestamp.    |
| `updatedAt` | DateTime      | Yes      | Last update timestamp. |

Database table: `tags`

The combination of `userId` and `name` must be unique.

Deleting the associated user also deletes their tags.

---

### TaskTag

Associates tasks with tags.

| Field    | Type          | Description         |
| -------- | ------------- | ------------------- |
| `taskId` | String (UUID) | Associated task ID. |
| `tagId`  | String (UUID) | Associated tag ID.  |

Database table: `task_tags`

The combination of `taskId` and `tagId` forms the composite primary key.

Relationships:

- Belongs to one `Task`.
- Belongs to one `Tag`.

Deleting the associated task or tag also deletes the association.

---

### Folder

Stores folders owned by users.

| Field       | Type          | Required | Description               |
| ----------- | ------------- | -------- | ------------------------- |
| `id`        | String (UUID) | Yes      | Unique folder identifier. |
| `name`      | String        | Yes      | Folder name.              |
| `userId`    | String (UUID) | Yes      | Owner user ID.            |
| `parentId`  | String (UUID) | No       | Parent folder ID.         |
| `createdAt` | DateTime      | Yes      | Creation timestamp.       |
| `updatedAt` | DateTime      | Yes      | Last update timestamp.    |

Database table: `folders`

Relationships:

- Belongs to one `User`.
- Optionally belongs to one parent `Folder`.
- Can have many subfolders.
- Can have many `Project`.

Deleting the associated user also deletes their folders.

Deleting a parent folder also deletes its subfolders.

---

## Database Mapping

The Prisma models use explicit database table and column mappings where required.

Examples:

```text
User          → users
passwordHash  → password_hash
createdAt     → created_at
userId        → user_id
parentId      → parent_id
```

The Prisma field names are used by the application, while mapped names are used in PostgreSQL.

## Data Isolation

User-owned resources are associated with a `userId` directly or through a related resource.

The backend is responsible for verifying ownership before accessing or modifying protected resources.

See [Relationships](./relationships.md) for the complete relationship structure and [Security Documentation](../security/README.md) for the application's data isolation rules.
