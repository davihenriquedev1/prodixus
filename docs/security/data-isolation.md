# Data Isolation

This document defines the data-isolation requirements for the Taskify application.

Application data must be treated as potentially private. A user's resources must not become accessible to another user merely because the other user knows or manipulates a resource identifier.

## Core Principle

The fundamental data-isolation rule is:

> A user must only be able to access, modify, or delete resources that belong to them or that they are explicitly authorized to access.

Resource identifiers are references, not authorization credentials.

Knowing a valid:

- User ID
- Project ID
- Task ID
- Tag ID
- Folder ID
- Relationship ID

must never be sufficient to access or manipulate the corresponding resource.

## User Data Boundary

The application's data model establishes relationships between users and their resources.

The ownership model is:

```text
User
 │
 ├── UserSettings
 │
 ├── Projects
 │     │
 │     ├── Tasks
 │     │     └── Subtasks
 │     │
 │     └── Folder (optional)
 │
 ├── Tags
 │
 └── Folders
       │
       └── Subfolders
```

Ownership must propagate through related resources.

For example:

```text
User A
 │
 ├── Project A
 │     ├── Task A1
 │     └── Task A2
 │
 ├── Tag A
 │
 └── Folder A
       └── Subfolder A1
```

User A is authorized to operate on these resources according to the application's permissions.

Another user must not gain access to them simply by obtaining their IDs.

## Ownership Must Be Server-Side

Ownership must be determined by the backend.

The backend must not trust ownership information supplied by the client.

An unsafe request could attempt to create or modify ownership using:

```json
{
  "userId": "another-user-id"
}
```

or:

```json
{
  "ownerId": "another-user-id"
}
```

The server must not allow such fields to override the authenticated user's identity.

For user-owned resources, ownership should normally be derived from:

```text
req.userId
```

which is established by the authentication middleware.

Client-controlled ownership information must never take precedence over the authenticated identity.

## Resource Reads

Every read operation involving a user-owned resource must respect the ownership boundary.

For example:

```http
GET /api/projects/:projectId
```

must not simply retrieve a project by ID.

The authorization boundary must conceptually be:

```text
project.id = requestedProjectId

AND

project.userId = authenticatedUserId
```

If the project belongs to another user, its data must not be returned.

This applies to individual resources as well as collections.

## Collection Queries

Collection endpoints must also be isolated by user.

For example:

```http
GET /api/projects
```

must return only projects that the authenticated user is authorized to see.

It must not return every project in the database and rely on the frontend to filter the results.

The filtering must occur on the backend.

Conceptually:

```text
Authenticated User

        │

        ▼

GET /projects

        │

        ▼

Database query

        │

        └── userId = authenticatedUserId
```

The same principle applies to tasks, tags, folders, and other user-owned collections.

For resources with indirect ownership, the query must enforce the complete ownership relationship.

For example, tasks belong to users through their project:

```text
Task
 │
 └── Project
       │
       └── User
```

Therefore, a task query must ensure that the task's project belongs to the authenticated user.

## Resource Creation

When a user creates a resource, the server must establish ownership using the authenticated identity.

For example:

```text
POST /api/projects

        │

        ▼

Authenticated User ID

        │

        ▼

Project.userId
```

The client should not be responsible for choosing the owner of a user-owned resource.

The same principle applies to:

- Projects
- Tags
- Folders
- User-specific settings

For resources with indirect ownership, the server must verify that referenced resources also belong to the authenticated user.

For example, when creating a project inside a folder:

```text
Authenticated User
       │
       ├── owns Project
       │
       └── owns Folder
              │
              ▼
       Create relationship
```

A project must not be created using a folder belonging to another user.

## Resource Updates

Updates must verify ownership before modifying the resource.

For example:

```http
PATCH /api/projects/:projectId
```

must verify that the project belongs to the authenticated user before performing the update.

A secure authorization flow is:

```text
Receive projectId

       │

       ▼

Identify authenticated user

       │

       ▼

Find resource within user's ownership boundary

       │

       ├── Found → perform update
       │
       └── Not found/unauthorized → reject
```

The update must not modify the resource before the ownership check succeeds.

The same principle applies when an update changes relationships.

For example, moving a project to a different folder requires verification that the target folder belongs to the same authenticated user.

## Resource Deletion

Deletion must use the same ownership boundary as reads and updates.

For example:

```http
DELETE /api/projects/:projectId
```

must not delete a project solely because the supplied ID exists.

The backend must verify that the authenticated user is authorized to delete the project.

The authorization condition must be enforced before the destructive database operation.

Cascading database deletes do not replace authorization.

For example, deleting a project may also delete its tasks because of the database relationship, but the initial project deletion must first be authorized.

## Related Resource Isolation

Related resources require additional care because ownership may be direct or indirect.

### Tasks

A task does not directly contain a user ID.

Its ownership is established through its project:

```text
Task
 │
 └── Project
       │
       └── User
```

Therefore, access to a task must verify that the task belongs to a project owned by the authenticated user.

A user must not be able to access another user's task by supplying the task ID directly.

### Subtasks

Tasks can also have parent-child relationships:

```text
Task A
 │
 ├── Task B
 │
 └── Task C
```

When creating, updating, moving, or deleting subtasks, the backend must ensure that the relevant tasks belong to the same user's ownership boundary.

A user must not be able to associate their task with another user's task as its parent.

### Folders

Folders belong directly to a user:

```text
User
 │
 └── Folder
       │
       └── Subfolder
```

When creating or modifying a folder hierarchy, the backend must verify that the parent folder belongs to the authenticated user.

A user must not be able to use another user's folder as a parent.

### Projects and Folders

Projects may optionally belong to folders:

```text
User
 │
 ├── Project
 │
 └── Folder
       │
       └── Project
```

When assigning a project to a folder, the backend must verify ownership of both the project and the folder.

The application must never allow a project belonging to User A to be associated with a folder belonging to User B.

## Cross-Resource Authorization

Operations involving multiple resources must verify the ownership of all relevant resources.

For example, if an endpoint associates a task with a tag:

```text
Task A

   +

Tag B

   │

   ▼

Association
```

the backend must verify that the authenticated user is authorized to operate on both resources.

It is not sufficient to verify only the task.

Otherwise, a malicious user could potentially combine resources belonging to different users.

Conceptually:

```text
Authenticated User

       │

       ├── owns Task?
       │
       └── owns Tag?
              │
              ▼
        Create relationship
```

If either authorization check fails, the operation must be rejected.

The same principle applies to any operation involving multiple user-owned resources.

## IDOR

Insecure Direct Object Reference (IDOR) occurs when an application exposes an object identifier and fails to verify whether the requesting user is authorized to access that object.

For example, suppose User A owns:

```text
Project ID: <project-A-id>
```

User B discovers the identifier and sends:

```http
GET /api/projects/<project-A-id>
```

The application must not return User A's project simply because the project exists.

The server must evaluate the relationship between:

```text
authenticatedUserId

        +

projectId

        +

project.userId
```

before returning the resource.

## BOLA

Broken Object Level Authorization (BOLA) is the broader API security problem where an authenticated user can interact with an object they are not authorized to access.

The system must consider BOLA for every endpoint that accepts a resource identifier.

Potentially vulnerable patterns include:

```http
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/tags/:id
PATCH  /api/tags/:id
DELETE /api/tags/:id

GET    /api/folders/:id
PATCH  /api/folders/:id
DELETE /api/folders/:id
```

The exact endpoints may evolve as the API is implemented, but the authorization requirement remains the same.

## Query-Level Isolation

Where possible, ownership restrictions should be included directly in database queries.

Instead of:

```text
Find resource by ID

       │

       ▼

Check ownership later
```

prefer the conceptual query:

```text
Find resource where:

    id = requestedId

    AND

    ownership relationship = authenticatedUserId
```

For directly owned resources such as projects:

```text
Project:

    id = requestedProjectId

    AND

    userId = authenticatedUserId
```

For indirectly owned resources such as tasks:

```text
Task:

    id = requestedTaskId

    AND

    project.userId = authenticatedUserId
```

For tags:

```text
Tag:

    id = requestedTagId

    AND

    userId = authenticatedUserId
```

For folders:

```text
Folder:

    id = requestedFolderId

    AND

    userId = authenticatedUserId
```

The exact Prisma query depends on the repository implementation, but the authorization condition must remain enforced at the database access boundary.

## Database Constraints

Application-level authorization should be supported by appropriate database constraints.

Depending on the resource, these may include:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Non-null constraints.
- Referential integrity.
- Appropriate cascade behavior.
- Appropriate `SetNull` behavior for optional relationships.

For example, the schema establishes ownership relationships through foreign keys such as:

```text
Project.userId → User.id

Tag.userId → User.id

Folder.userId → User.id
```

Tasks are connected to users through their projects:

```text
Task.projectId → Project.id
Project.userId → User.id
```

Database constraints do not replace authorization.

They protect data integrity, while authorization determines whether a particular user is allowed to perform an operation.

Both layers are required.

## Preventing User ID Manipulation

The application must not use arbitrary user IDs from:

- URL parameters.
- Query parameters.
- Request bodies.
- Headers supplied by the client.
- Form fields.

For authenticated operations, the authenticated identity must come from the validated access token.

For example:

```text
Bad:

req.body.userId

      │

      ▼

Database ownership
```

versus:

```text
Good:

req.userId

      │

      ▼

Database ownership
```

Client-provided ownership fields should be rejected or ignored according to the endpoint contract.

## Preventing Cross-User Relationships

Ownership must also be preserved when one resource references another resource.

For example:

```text
User A
 │
 ├── Project A
 └── Folder A

User B
 │
 └── Folder B
```

The backend must reject an operation attempting to create:

```text
Project A → Folder B
```

because the two resources belong to different users.

The same rule applies to:

- Task → Project
- Task → Parent Task
- Task → Tag
- Project → Folder
- Folder → Parent Folder

Cross-resource references must remain inside the authenticated user's ownership boundary.

## Preventing Enumeration

Resource identifiers should not be treated as secret values.

Even though the application uses UUIDs, authorization checks remain mandatory.

Random or difficult-to-guess identifiers can reduce accidental discovery, but they do not replace authorization.

An attacker must still be unable to access a resource after obtaining its identifier.

Therefore:

```text
Unpredictable ID

       ≠

Authorization
```

## Error Responses

When a user requests another user's resource, the API must not expose the resource's private information.

Depending on the endpoint, the application may return:

```text
404 Not Found
```

to avoid revealing whether the resource exists.

Alternatively, it may return:

```text
403 Forbidden
```

when the API explicitly distinguishes between existence and authorization.

The chosen behavior should be consistent across the API.

The important requirement is that neither response should expose the protected resource or sensitive information about it.

## Security Testing Requirements

Data isolation must be tested explicitly.

At minimum, authorization tests should model multiple users.

Example:

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

Tests should verify that User A cannot:

```text
Read Project B
Modify Project B
Delete Project B

Read Task B
Modify Task B
Delete Task B

Read Tag B
Modify Tag B
Delete Tag B

Read Folder B
Modify Folder B
Delete Folder B
```

Cross-resource operations must also be tested.

Examples include attempting to:

```text
Assign User B's Tag to User A's Task

Move User A's Project into User B's Folder

Use User B's Task as User A's parent task

Use User B's Folder as User A's parent folder
```

Tests should also attempt direct identifier manipulation:

```text
Authenticated as User A

GET    /projects/{project-B-id}
PATCH  /projects/{project-B-id}
DELETE /projects/{project-B-id}
```

All unauthorized operations must be rejected.

## Current Implementation Status

The current authentication system establishes the authenticated user identity through `req.userId`.

The current `/users/me` endpoints are scoped to that authenticated identity and do not expose an arbitrary user ID parameter.

However, resource-level ownership enforcement for projects, tasks, tags, folders, and their relationships must be implemented together with their respective CRUD endpoints.

The database schema establishes ownership relationships and referential integrity, but these database relationships do not by themselves provide application-level authorization.

Therefore, the requirements in this document represent the required security boundary for those resources and must not be interpreted as already implemented functionality.

## Data Isolation Goal

The security boundary can be summarized as:

```text
Client-controlled ID

       │

       ▼

Backend

       │

       ├── Authenticate user
       │
       ├── Identify resource
       │
       ├── Resolve ownership relationships
       │
       ├── Verify authorization
       │
       └── Perform operation only if authorized
```

The desired security property is:

> Manipulating resource IDs, URLs, request bodies, or HTTP requests must never allow a user to cross another user's data boundary.

Database data should always be treated as potentially private, and every backend operation must preserve that boundary.
