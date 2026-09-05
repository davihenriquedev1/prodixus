Agora o `authorization.md`. Aqui vale ser rigoroso: **o `authMiddleware` autentica o usuário, mas não faz autorização de recursos**. A checagem de ownership deve acontecer na camada de serviço/repositório quando começarmos os CRUDs de recursos.

# Authorization

This document describes the authorization model of the application.

Authentication determines the identity of a user. Authorization determines whether that authenticated user is allowed to perform a specific operation on a specific resource.

## Authorization Principle

The fundamental authorization rule is:

> An authenticated user must only be able to access, modify, or delete resources that they are authorized to access.

For user-owned resources, authorization must be based on the ownership relationship between the resource and the authenticated user.

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

Routes that require an authenticated user must execute the authentication middleware before reaching the protected controller.

Current protected routes include:

```text
GET   /api/users/me
PATCH /api/users/me
PATCH /api/users/me/password
```

The route structure currently follows:

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

For resource-based operations, authorization must be performed after authentication.

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
Check Resource Ownership
  │
  ├── Authorized ──► Continue
  │
  └── Unauthorized ──► Reject
```

The ownership check must be performed by the backend.

## Resource Ownership

For resources that belong to users, the authorization decision should be based on the authenticated user's ID.

Conceptually:

```text
authenticatedUserId === resource.ownerId
```

If the values do not match, the operation must be rejected.

The client must not be able to change the ownership boundary by modifying:

- `userId`
- `ownerId`
- Resource IDs
- URL parameters
- Request body fields
- Query parameters
- HTTP methods

## Read Operations

Reading a resource requires authorization.

For example, a request such as:

```http
GET /api/projects/:projectId
```

must not return the project merely because the project ID exists.

The backend must verify that the requested project belongs to the authenticated user.

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

## Create Operations

Creating a resource must associate it with the authenticated user.

The ownership relationship must be derived from the authentication context whenever possible.

For example, when creating a project:

```text
Authenticated User
        │
        ▼
Create Project
        │
        ▼
ownerId = req.userId
```

The server should not rely on a client-provided `ownerId` to establish ownership.

If the request attempts to provide a different owner ID, the backend must ignore or reject that value according to the endpoint's contract.

## Update Operations

Updating a resource requires authorization before the mutation occurs.

The backend must:

1. Identify the requested resource.
2. Determine its owner.
3. Compare the owner with `req.userId`.
4. Reject the request if the authenticated user is not authorized.
5. Perform the update only after authorization succeeds.

Example:

```text
PATCH /api/projects/:projectId
```

must not allow User A to modify a project owned by User B.

## Delete Operations

Deletion follows the same authorization rule as updates.

Before deleting a resource, the backend must verify that the authenticated user is authorized to delete it.

The existence of a valid resource ID does not grant deletion permission.

Example:

```text
DELETE /api/projects/:projectId
```

must verify ownership before executing the database deletion.

## Related Resources

Authorization must also be applied to relationships between resources.

For example, our system may contain relationships such as:

```text
User
 │
 ├── Project
 │     │
 │     └── Task
 │
 └── Tag
```

A user must not gain access to a task merely because they know its ID.

The backend must establish that the task belongs to a project owned by the authenticated user.

Similarly, operations involving tags must ensure that the authenticated user is authorized to use the referenced tag.

For many-to-many relationships such as task/tag associations, both sides of the relationship must respect ownership boundaries.

Conceptually:

```text
User A
 │
 ├── Project A
 │     └── Task A
 │
 └── Tag A

User B
 │
 ├── Project B
 │     └── Task B
 │
 └── Tag B
```

User A must not be able to manipulate:

```text
Task B
Project B
Tag B
```

by manually changing resource identifiers.

## IDOR and BOLA Prevention

The application must protect against insecure direct object reference (IDOR) and broken object-level authorization (BOLA).

These vulnerabilities occur when an application accepts a resource identifier from the client but fails to verify whether the authenticated user is authorized to access that resource.

An unsafe implementation could conceptually behave like:

```ts id="n4rj2v"
const project = await ProjectRepository.findById(projectId);
return project;
```

This is insufficient when projects belong to individual users.

A secure implementation must include the authorization boundary:

```ts id="8zj5mm"
const project = await ProjectRepository.findById(projectId);

if (!project || project.ownerId !== req.userId) {
  throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found");
}

return project;
```

The exact implementation may vary by resource and repository design, but the authorization requirement remains the same.

## Avoiding Ownership Leaks

Authorization checks should ideally be incorporated into database queries where practical.

For example, instead of:

```text
find project by ID
        ↓
check owner in application code
```

a query can conceptually enforce both conditions:

```text
find project where:
    id = projectId
    AND ownerId = authenticatedUserId
```

This reduces the possibility of accidentally returning a resource before authorization is checked.

It also makes the ownership boundary explicit in the data-access operation.

## Error Handling

Authorization failures must not expose unnecessary information about resources belonging to other users.

Depending on the endpoint and security requirements, the API may return:

- `403 Forbidden` when the resource is known but the user is authenticated and lacks permission.
- `404 Not Found` when hiding the existence of another user's resource is preferable.

The selected behavior should be consistent within the API.

Error responses must not expose:

- Private resource contents.
- Another user's identifiers unnecessarily.
- Database details.
- Internal authorization logic.
- Sensitive application information.

## Current Implementation

The current authentication middleware establishes the authenticated user identity through `req.userId`.

The currently implemented `/users/me` endpoints operate on the authenticated user rather than accepting an arbitrary user ID from the request.

For example:

```text
GET /api/users/me
```

uses the user ID established by the authentication middleware.

This prevents a client from selecting another user's ID through the endpoint itself.

## Current Authorization Limitations

The current application is still developing its resource-level authorization model.

The authentication middleware currently verifies the user's access token and establishes the authenticated identity, but it does not itself perform ownership checks for arbitrary resources.

Resource ownership authorization must therefore be implemented as resource CRUD operations are introduced.

The following controls should be considered required for future resource endpoints:

- Ownership checks for resource reads.
- Ownership checks for resource updates.
- Ownership checks for resource deletion.
- Server-side ownership assignment during resource creation.
- Ownership checks for related resources.
- Tests attempting cross-user resource access.
- Tests attempting cross-user resource modification.
- Tests attempting cross-user resource deletion.
- Tests manipulating resource IDs directly.

These controls must be implemented before corresponding resources are considered securely isolated between users.

## Authorization Security Goal

The authorization model must guarantee the following:

> Knowing a resource ID must never be enough to access or manipulate that resource.

The backend must independently determine whether the authenticated user is authorized to perform the requested operation.

The client controls the request.

The server controls authorization.

O ponto principal desse documento é deixar **cravado** que `authMiddleware` ≠ autorização. O middleware sabe **quem é o usuário**; o serviço/repositório precisa verificar **se ele pode mexer naquele recurso**.

O próximo é `data-isolation.md`, que vai aprofundar justamente **User → Project → Task → Tag** e os cenários de IDOR/BOLA.
