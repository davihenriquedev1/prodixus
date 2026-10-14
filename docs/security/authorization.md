# Authorization

This document describes the authorization model of the application.

Authentication determines the identity of a user. Authorization determines whether that authenticated user is allowed to perform a specific operation on a specific resource.

## Authorization Principle

The fundamental authorization rule is:

> An authenticated user must only be able to access, modify, or delete resources that they are authorized to access.

For user-owned resources, authorization is based on the ownership relationship between the resource and the authenticated user.

A resource ID supplied by the client must never be treated as proof of ownership.

For example, if a request contains:

```http
GET /api/projects/project-b
```

the existence of `project-b` must not be sufficient to return the project.

The backend must verify that `project-b` belongs to the authenticated user.

## Authentication Context

The authentication middleware establishes the identity of the current user.

After successfully validating the access token, the middleware assigns the authenticated user's ID to:

```ts
req.userId;
```

This value represents the identity established by the server.

Application code must use this authentication context when making authorization decisions.

The application must not trust a client-provided field such as:

```json
{
  "userId": "some-user-id"
}
```

to determine which user owns a resource.

## Protected Routes

Routes that require an authenticated user execute the authentication middleware before reaching the protected controller.

Protected resources include:

```text
/api/users/*
/api/projects/*
/api/tags/*
/api/folders/*
/api/projects/:projectId/tasks/*
```

The general request flow is:

```text
Request
  │
  ▼
Authentication Middleware
  │
  ├── Validate access token
  ├── Extract userId
  └── Set req.userId
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
```

A request without valid authentication must not reach protected application logic.

## Authorization Checks

Authentication middleware alone does not establish permission to access a specific resource.

For resource-based operations, authorization is performed after authentication.

For example:

```text
Request
  │
  ▼
Authenticate User
  │
  ▼
Identify Resource
  │
  ▼
Check Ownership
  │
  ├── Authorized ──► Continue
  │
  └── Unauthorized ──► Reject
```

Ownership checks are enforced by the backend, primarily within the service layer.

## Resource Ownership

For directly user-owned resources, the authorization decision is based on the authenticated user's ID.

Conceptually:

```text
authenticatedUserId === resource.userId
```

The client must not be able to change the ownership boundary by modifying:

- `userId`
- Resource IDs
- URL parameters
- Request body fields
- Query parameters
- HTTP methods

The authenticated user's ID is obtained from the verified JWT rather than from client input.

## Read Operations

Reading a resource requires authorization.

For example:

```http
GET /api/projects/:projectId
```

must not return a project merely because the project ID exists.

The backend verifies that the requested project belongs to the authenticated user.

Conceptually:

```text
Authenticated User A

        │
        │ requests Project B
        ▼

Backend

        │
        ├── Project B exists?
        │
        └── Project B belongs to User A?
                │
                ├── Yes → return resource
                │
                └── No → reject request
```

The same principle applies to projects, tasks, tags, and folders.

## Create Operations

Creating a user-owned resource associates it with the authenticated user.

The ownership relationship is derived from the authentication context whenever applicable.

For example, when creating a project:

```text
Authenticated User
        │
        ▼
Create Project
        │
        ▼
userId = req.userId
```

The server does not rely on a client-provided `userId` to establish ownership.

## Update Operations

Updating a resource requires authorization before the mutation occurs.

The backend must:

1. Identify the requested resource.
2. Determine its ownership.
3. Compare the ownership with `req.userId`.
4. Reject the request if the authenticated user is not authorized.
5. Perform the update only after authorization succeeds.

For example:

```http
PATCH /api/projects/:projectId
```

must not allow User A to modify a project owned by User B.

## Delete Operations

Deletion follows the same authorization rule as updates.

Before deleting a resource, the backend verifies that the authenticated user is authorized to delete it.

The existence of a valid resource ID does not grant deletion permission.

For example:

```http
DELETE /api/projects/:projectId
```

must verify ownership before executing the database deletion.

## Related Resources

Authorization also applies to relationships between resources.

The current model contains relationships such as:

```text
User
 │
 ├── Project
 │     │
 │     └── Task
 │
 ├── Tag
 │
 └── Folder
```

A user must not gain access to a task merely because they know its ID.

Task authorization is based on the task's project ownership:

```text
Authenticated User
        │
        ▼
Project ownership
        │
        ▼
Task access
```

Therefore, a task belonging to another user's project must remain inaccessible.

The same principle applies to folders and tags.

## Task and Tag Authorization

Task/tag associations require authorization on both sides of the relationship.

When creating or removing a task/tag association, the backend must verify:

```text
Authenticated User
        │
        ├── owns Task
        │
        └── owns Tag
```

Both conditions must be satisfied before the association is modified.

Conceptually:

```text
User A
 │
 ├── Task A
 └── Tag A

User B
 │
 ├── Task B
 └── Tag B
```

User A must not be able to create or remove an association involving:

```text
Task B
Tag B
```

by manually changing resource identifiers.

## Folder and Project Authorization

Projects and folders are both user-owned resources.

When associating a project with a folder, the backend must verify that the referenced folder belongs to the authenticated user.

Conceptually:

```text
Authenticated User
        │
        ├── Project
        │
        └── Folder
```

A project must not be associated with another user's folder.

## IDOR and BOLA Prevention

The application protects against insecure direct object reference (IDOR) and broken object-level authorization (BOLA).

These vulnerabilities occur when an application accepts a resource identifier from the client but fails to verify whether the authenticated user is authorized to access that resource.

An unsafe implementation could conceptually behave like:

```ts
const project = await ProjectRepository.findById(projectId);

return project;
```

This is insufficient when projects belong to individual users.

The secure behavior must enforce the ownership boundary before returning or modifying the resource:

```text
resource ID
    │
    ▼
Find resource
    │
    ▼
Verify ownership
    │
    ├── Authorized ──► Continue
    │
    └── Not authorized ──► Reject
```

The exact implementation varies by resource and operation, but the authorization requirement remains the same.

## Ownership Enforcement by Resource

The current authorization model follows these ownership boundaries:

| Resource | Ownership boundary                                          |
| -------- | ----------------------------------------------------------- |
| User     | Authenticated `userId`                                      |
| Project  | `project.userId`                                            |
| Task     | Ownership through its project                               |
| Tag      | `tag.userId`                                                |
| Folder   | `folder.userId`                                             |
| TaskTag  | Both the Task and Tag must belong to the authenticated user |

This ensures that indirect relationships do not bypass tenant isolation.

## Error Handling

Authorization failures must not expose unnecessary information about resources belonging to other users.

The API commonly uses `404 Not Found` for resources that do not exist or do not belong to the authenticated user.

This behavior prevents the API from unnecessarily revealing whether another user's resource exists.

Error responses must not expose:

- Private resource contents.
- Another user's identifiers unnecessarily.
- Database details.
- Internal authorization logic.
- Sensitive application information.

## Current Implementation

The current backend establishes the authenticated user identity through `req.userId`.

Resource services use this identity when performing ownership checks.

The implemented authorization model includes:

- User ownership checks for projects.
- Project ownership checks for tasks.
- User ownership checks for tags.
- User ownership checks for folders.
- Ownership validation for project/folder relationships.
- Ownership validation for task parent relationships.
- Ownership validation for task/tag associations.
- Server-side ownership assignment during resource creation.
- Ownership checks before resource updates.
- Ownership checks before resource deletion.

The `/users/me` endpoints operate directly on the authenticated user's ID rather than accepting an arbitrary user ID.

For example:

```http
GET /api/users/me
```

uses the identity established by the authentication middleware.

## Tenant Isolation

Tenant isolation means that one authenticated user must not be able to access or manipulate another user's private resources.

The backend therefore treats the authenticated `userId` as the security boundary.

Resource identifiers alone do not establish authorization.

For direct ownership:

```text
JWT userId
    │
    ▼
Resource.userId
    │
    ├── Match → authorized
    │
    └── Different → reject
```

For indirectly owned resources:

```text
JWT userId
    │
    ▼
Project ownership
    │
    ▼
Task access
```

For task/tag relationships:

```text
JWT userId
    │
    ├── Task ownership ──► valid
    │
    └── Tag ownership  ──► valid
```

Both ownership boundaries must be satisfied.

## Security Goal

The authorization model must guarantee the following:

> Knowing a resource ID must never be enough to access or manipulate that resource.

The backend independently determines whether the authenticated user is authorized to perform the requested operation.

The client controls the request.

The server controls authorization.
