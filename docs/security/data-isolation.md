# Data Isolation

This document defines the data-isolation model of the application.

Application data must be treated as potentially private. A user's resources must not become accessible to another user merely because the other user knows or manipulates a resource identifier.

## Core Principle

The fundamental data-isolation rule is:

> A user must only be able to access or manipulate resources within their own ownership boundary.

Resource identifiers are references, not authorization credentials.

Knowing a valid:

- User ID
- Project ID
- Task ID
- Tag ID
- Folder ID
- Relationship ID

must never be sufficient to access or manipulate the corresponding resource.

The backend is responsible for enforcing the ownership boundary.

## User Data Boundary

The application's data model establishes ownership relationships between users and their resources.

The ownership model is:

```text
User
 │
 ├── UserSettings
 │
 ├── Projects
 │     │
 │     └── Tasks
 │           │
 │           └── Subtasks
 │
 ├── Tags
 │
 └── Folders
       │
       └── Subfolders
```

Directly user-owned resources contain a `userId` relationship.

Indirectly owned resources inherit their ownership through their parent resource.

For example:

```text
User
 │
 └── Project
       │
       └── Task
```

A task is therefore within the user's data boundary when its project belongs to that user.

## Server-Side Ownership

Ownership is determined by the backend.

The authenticated user's identity is established by the access token and stored in:

```ts
req.userId;
```

Client-provided ownership information must not override this identity.

The backend must not use arbitrary values supplied through:

- Request bodies.
- URL parameters.
- Query parameters.
- Form fields.
- Client-controlled ownership fields.

For user-owned resources, ownership is established from the authenticated user whenever the resource is created.

Conceptually:

```text
Verified JWT
    │
    ▼
req.userId
    │
    ▼
Resource.userId
```

## Direct Ownership

The following resources are directly associated with a user:

```text
User
 ├── Project
 ├── Tag
 └── Folder
```

Their ownership boundary is based on the corresponding `userId`.

Conceptually:

```text
resource.userId === authenticatedUserId
```

A resource belonging to another user must not be returned or modified.

## Indirect Ownership

Some resources do not contain a direct `userId`.

Tasks are owned indirectly through their project:

```text
Task
 │
 └── Project
       │
       └── User
```

Therefore, access to a task must remain inside the ownership boundary of its project.

The same principle applies to relationships involving nested resources.

## Task and Subtask Isolation

Tasks belong to projects, and projects belong to users.

Therefore:

```text
User A
 │
 └── Project A
       ├── Task A1
       └── Task A2

User B
 │
 └── Project B
       └── Task B1
```

User A must not be able to access or manipulate Task B1.

The same ownership boundary applies to parent/subtask relationships.

A user must not be able to:

- Use another user's task as a parent.
- Move a task into another user's project.
- Associate tasks across different ownership boundaries.

## Folder Isolation

Folders are directly owned by users and may contain subfolders.

```text
User A
 │
 └── Folder A
       └── Subfolder A1

User B
 │
 └── Folder B
```

User A must not be able to use User B's folder as:

- A parent folder.
- A project folder.
- A referenced resource in another operation.

Folder hierarchy operations must remain within the authenticated user's ownership boundary.

## Project and Folder Isolation

Projects may optionally belong to folders.

Both resources must belong to the authenticated user when creating or changing this relationship.

```text
Authenticated User
        │
        ├── Project
        │
        └── Folder
              │
              ▼
        Valid relationship
```

The backend must reject cross-user relationships such as:

```text
User A
 └── Project A

User B
 └── Folder B

Project A → Folder B
```

## Task and Tag Isolation

Tasks and tags have a many-to-many relationship through `TaskTag`.

Both sides of the relationship must belong to the authenticated user.

```text
Authenticated User
        │
        ├── owns Task
        │
        └── owns Tag
               │
               ▼
          TaskTag association
```

It is therefore insufficient to authorize only the task or only the tag.

An association must not be created or removed when either resource belongs to another user.

## Collection Isolation

Collection endpoints must return only resources within the authenticated user's ownership boundary.

For example:

```http
GET /api/projects
```

must return the authenticated user's projects rather than all projects in the database.

The same principle applies to:

```text
/api/projects
/api/projects/:projectId/tasks
/api/tags
/api/folders
```

The frontend must never be responsible for filtering another user's data.

Isolation is enforced by the backend.

## Resource Identifier Protection

UUIDs are used as resource identifiers, but their unpredictability is not considered an authorization mechanism.

Therefore:

```text
Unpredictable ID
       ≠
Authorization
```

Even if a user obtains another user's resource ID, the backend must still reject unauthorized access.

This protects the application against IDOR and BOLA vulnerabilities.

## Cross-Resource Isolation

Operations involving multiple resources must verify the ownership boundary of all relevant resources.

Examples include:

```text
Task → Project
Task → Parent Task
Task → Tag
Project → Folder
Folder → Parent Folder
```

A valid relationship requires all referenced resources to be within the authenticated user's ownership boundary.

For example:

```text
User A
 │
 ├── Task A
 └── Tag A

User B
 └── Tag B
```

The backend must reject:

```text
Task A → Tag B
```

## Database Integrity

Database constraints support the application's data-isolation model but do not replace authorization.

The schema establishes ownership and referential relationships through foreign keys such as:

```text
Project.userId → User.id

Tag.userId → User.id

Folder.userId → User.id

Task.projectId → Project.id
```

The database also enforces relationships through:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Non-null constraints.
- Referential integrity.
- Cascade behavior.
- `SetNull` behavior for optional relationships.

These constraints protect data integrity.

Authorization remains responsible for determining whether the authenticated user is allowed to perform an operation.

## Query-Level Isolation

Ownership restrictions should be enforced as close to the data-access operation as practical.

Conceptually, a resource lookup should consider both the requested identifier and the ownership boundary:

```text
Find resource where:

    id = requestedId

    AND

    ownership = authenticatedUserId
```

For directly owned resources:

```text
Project:

    id = requestedProjectId
    AND
    userId = authenticatedUserId
```

For indirectly owned resources:

```text
Task:

    id = requestedTaskId
    AND
    project.userId = authenticatedUserId
```

The exact Prisma query depends on the resource and repository implementation.

The important requirement is that authorization must be enforced before protected data is returned or modified.

## Error Handling

When a user attempts to access another user's resource, the API must not expose private resource information.

The current API commonly uses:

```text
404 Not Found
```

for resources that do not exist or are not accessible to the authenticated user.

This prevents the API from unnecessarily revealing whether another user's resource exists.

Error responses must not expose:

- Private resource contents.
- Unnecessary information about another user's resources.
- Database details.
- Internal authorization logic.
- Sensitive application information.

## Current Implementation

The current authentication system establishes the authenticated user's identity through `req.userId`.

The backend currently enforces ownership boundaries for the implemented resources, including:

- Projects.
- Tasks.
- Tags.
- Folders.
- Task/tag associations.
- Task parent relationships.
- Project/folder relationships.

Ownership is checked before protected resource operations.

Resource creation derives ownership from the authenticated user rather than trusting a client-provided user ID.

Related resources are also validated before relationships are created or modified.

For example, task/tag operations verify the ownership of both the task and the tag.

## Security Testing

Data isolation should be validated with multiple users and cross-user resource identifiers.

A representative test setup is:

```text
User A
 ├── Project A
 ├── Task A
 ├── Tag A
 └── Folder A

User B
 ├── Project B
 ├── Task B
 ├── Tag B
 └── Folder B
```

The backend must prevent User A from using User B's resources through manipulated identifiers.

Tests should cover:

- Reading another user's resource.
- Updating another user's resource.
- Deleting another user's resource.
- Creating relationships with another user's resources.
- Using another user's task as a parent.
- Using another user's folder as a parent.
- Assigning another user's tag to a task.
- Manipulating resource IDs directly.

## Data Isolation Goal

The security boundary can be summarized as:

```text
Client-controlled request
        │
        ▼
Authentication
        │
        ▼
Authenticated user
        │
        ▼
Resource ownership validation
        │
        ├── Authorized ──► Perform operation
        │
        └── Unauthorized ──► Reject
```

The required security property is:

> Manipulating resource IDs, URLs, request bodies, or HTTP requests must never allow a user to cross another user's data boundary.

The client controls the request.

The server controls the ownership boundary.
