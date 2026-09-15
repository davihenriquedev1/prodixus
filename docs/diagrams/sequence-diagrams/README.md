# Sequence Diagrams

This section contains the sequence diagrams that document the main application flows of Prodixus.

Sequence diagrams describe how the system components interact during specific use cases, from the user interface through the API and application layers to data persistence.

## Organization

The diagrams are organized by functional domain:

### Auth

Authentication and session management flows.

- [Login](./auth/login.md)
- [Logout](./auth/logout.md)
- [Refresh Token](./auth/refresh-token.md)
- [Register User](./auth/register-user.md)

### Folder

Folder management and project organization.

- [Create Folder](./folder/create.md)
- [Get Folder](./folder/retrieval.md)
- [Update Folder](./folder/update.md)
- [Delete Folder](./folder/delete.md)

### Project

Project management and project-specific actions.

- [Create Project](./project/create.md)
- [Get Project](./project/retrieval.md)
- [Update Project](./project/update.md)
- [Delete Project](./project/delete.md)

### Tag

Tag management.

- [Create Tag](./tag/create.md)
- [Get Tag](./tag/retrieval.md)
- [Update Tag](./tag/update.md)
- [Delete Tag](./tag/delete.md)

### Task

Task management and task-specific actions.

- [Create Task](./task/create.md)
- [Get Task](./task/retrieval.md)
- [Update Task](./task/update.md)
- [Delete Task](./task/delete.md)

### Task Tags

Relationships between tasks and tags.

- [Assign Tag](./task-tags/assign.md)
- [Remove Tag](./task-tags/remove.md)

### User

User profile and settings management.

- [Change Password](./user/change-password.md)
- [Delete Account](./user/delete-account.md)
- [Get Profile](./user/get-profile.md)
- [Get Settings](./user/get-settings.md)
- [Update Profile](./user/update-profile.md)
- [Update Settings](./user/update-settings.md)

## Diagram Structure

The diagrams generally represent the following application flow:

**User → Frontend → API → Controller → Service → Repository → Prisma → PostgreSQL**

Not every flow necessarily uses every component. Additional repositories or services may appear when a use case involves multiple domain entities.

## Naming Convention

Files use concise names that identify the operation being represented.

Examples:

- `create.md` — Create a resource.
- `retrieval.md` — Retrieve one or multiple resources.
- `update.md` — Update a resource.
- `delete.md` — Delete a resource.
- `assign.md` — Create a task-tag association.
- `remove.md` — Remove a task-tag association.

The `retrieval.md` diagrams cover both single-resource and collection retrieval flows when the underlying interaction pattern is sufficiently similar.

## Conventions

- Diagrams should remain consistent with the current application architecture.
- Sequence diagrams represent intended system behavior, not necessarily the current implementation.
- Business rules and validation should be represented at the appropriate application/domain layer.
- Persistence operations should be represented through the repository and Prisma layers.
- PostgreSQL represents the persistence layer and should not be accessed directly by application services.

Additional sequence diagrams may be added as new system flows or significant business rules are introduced.
