Aqui tem alguns códigos que precisam ser alinhados com o `errorTypes`, principalmente `PARENT_NOT_FOUND` → `PARENT_TASK_NOT_FOUND`. Também acrescentaria `VALIDATION_ERROR` e os erros de autenticação nos endpoints.

Segue o arquivo completo:

# Tasks

Task endpoints are nested under projects. Tasks belong to a project owned by the authenticated user.

All endpoints require a valid JWT access token.

## Endpoints

| Method   | Endpoint                                             | Description        |
| -------- | ---------------------------------------------------- | ------------------ |
| `POST`   | `/api/projects/:projectId/tasks`                     | Create a task      |
| `GET`    | `/api/projects/:projectId/tasks`                     | List project tasks |
| `GET`    | `/api/projects/:projectId/tasks/:taskId`             | Retrieve a task    |
| `PATCH`  | `/api/projects/:projectId/tasks/:taskId`             | Update a task      |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId`             | Delete a task      |
| `POST`   | `/api/projects/:projectId/tasks/:taskId/tags/:tagId` | Associate a tag    |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId/tags/:tagId` | Remove a tag       |

---

## Create Task

Create a task inside a project.

### Request

```http id="x9k2ra"
POST /api/projects/:projectId/tasks

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json id="6f4qwp"
{
  "title": "My task",
  "notes": "Task notes",
  "priority": 1,
  "estimatedDuration": 60,
  "startAt": "2026-09-15T10:00:00.000Z",
  "dueAt": "2026-09-15T18:00:00.000Z",
  "completed": false,
  "archived": false,
  "parentId": "uuid"
}
```

| Field               | Type     | Required | Description                    |
| ------------------- | -------- | -------- | ------------------------------ |
| `title`             | string   | Yes      | Task title.                    |
| `notes`             | string   | No       | Task notes.                    |
| `priority`          | integer  | No       | Task priority.                 |
| `estimatedDuration` | integer  | No       | Estimated task duration.       |
| `startAt`           | datetime | No       | Task start date.               |
| `dueAt`             | datetime | No       | Task due date.                 |
| `completed`         | boolean  | No       | Whether the task is completed. |
| `archived`          | boolean  | No       | Whether the task is archived.  |
| `parentId`          | UUID     | No       | Parent task ID.                |

### Success Response

**201 Created**

Returns the created task.

### Parent Task Rules

When `parentId` is provided:

- The parent task must belong to the same project.
- The parent task must belong to the authenticated user.
- A task that is already a subtask cannot be used as a parent.

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json id="b8q4nd"
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="p6m2tz"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="v7c1sx"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="r3k8yf"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `PARENT_TASK_NOT_FOUND`**

```json id="n5q2jw"
{
  "code": "PARENT_TASK_NOT_FOUND",
  "message": "Parent task not found or does not belong to user"
}
```

**409 Conflict — `TASK_IS_SUBTASK`**

```json id="c4x9mp"
{
  "code": "TASK_IS_SUBTASK",
  "message": "Task already is a subtask"
}
```

---

## List Tasks

Retrieve all tasks belonging to a project.

### Request

```http id="t6w3qa"
GET /api/projects/:projectId/tasks

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the project's tasks.

Tasks include their parent relationship when applicable.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="z2m7ke"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="h5q1vc"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="k8s4yp"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

---

## Get Task

Retrieve a specific task from a project.

### Request

```http id="m3v8rx"
GET /api/projects/:projectId/tasks/:taskId

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested task.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="q7n2fd"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="s4x9kp"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="w6c3mj"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `TASK_NOT_FOUND`**

```json id="e2q8va"
{
  "code": "TASK_NOT_FOUND",
  "message": "Task not found"
}
```

A task belonging to another user or another project is treated as not found.

---

## Update Task

Update an existing task.

### Request

```http id="f9k2wd"
PATCH /api/projects/:projectId/tasks/:taskId

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

All task fields are optional.

```json id="u4x7mc"
{
  "title": "Updated task",
  "notes": "Updated notes",
  "priority": 2,
  "completed": true,
  "archived": false
}
```

`parentId` can also be updated:

```json id="j8q3vs"
{
  "parentId": "uuid"
}
```

Use `null` for `parentId` to remove the task's parent.

### Success Response

**200 OK**

Returns the updated task.

### Parent Task Rules

When assigning a parent:

- The parent must belong to the same project.
- The parent must belong to the authenticated user.
- A task cannot be its own parent.
- A task that is already a subtask cannot be used as a parent.

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json id="x5m9qk"
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="d3w7pa"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="n8r4yc"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="v2k6ms"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `TASK_NOT_FOUND`**

```json id="a7q3fz"
{
  "code": "TASK_NOT_FOUND",
  "message": "Task not found"
}
```

**404 Not Found — `PARENT_TASK_NOT_FOUND`**

```json id="p4x8nw"
{
  "code": "PARENT_TASK_NOT_FOUND",
  "message": "Parent task not found or does not belong to user"
}
```

**409 Conflict — `TASK_CANNOT_BE_OWN_PARENT`**

```json id="y6m2vc"
{
  "code": "TASK_CANNOT_BE_OWN_PARENT",
  "message": "Task cannot be its own parent"
}
```

**409 Conflict — `TASK_IS_SUBTASK`**

```json id="q9w5kb"
{
  "code": "TASK_IS_SUBTASK",
  "message": "Task already is a subtask"
}
```

---

## Delete Task

Delete a task from a project.

### Request

```http id="r4n8xd"
DELETE /api/projects/:projectId/tasks/:taskId

Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="m7c2qa"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="x3v9pf"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="j5k8wm"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `TASK_NOT_FOUND`**

```json id="s2q6yc"
{
  "code": "TASK_NOT_FOUND",
  "message": "Task not found"
}
```

---

## Associate Tag

Associate an existing tag with a task.

### Request

```http id="v8m3qz"
POST /api/projects/:projectId/tasks/:taskId/tags/:tagId

Authorization: Bearer <access_token>
```

### Success Response

**201 Created**

Returns the created task-tag association.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="f4x7nc"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="k2p9wd"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="c6m1qa"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `TASK_NOT_FOUND`**

```json id="r9v4xs"
{
  "code": "TASK_NOT_FOUND",
  "message": "Task not found"
}
```

**404 Not Found — `TAG_NOT_FOUND`**

```json id="n3k7yf"
{
  "code": "TAG_NOT_FOUND",
  "message": "Tag not found"
}
```

**409 Conflict — `TASK_TAG_ASSOCIATION_ALREADY_EXISTS`**

```json id="w5q2mc"
{
  "code": "TASK_TAG_ASSOCIATION_ALREADY_EXISTS",
  "message": "Task tag association already exists"
}
```

The task and tag must belong to the authenticated user.

---

## Remove Tag

Remove a tag association from a task.

### Request

```http id="q8x4mv"
DELETE /api/projects/:projectId/tasks/:taskId/tags/:tagId

Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="t6n2kp"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="y3r7wc"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="m9q4xa"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `TASK_NOT_FOUND`**

```json id="v5k8nd"
{
  "code": "TASK_NOT_FOUND",
  "message": "Task not found"
}
```

**404 Not Found — `TAG_NOT_FOUND`**

```json id="p2x6qm"
{
  "code": "TAG_NOT_FOUND",
  "message": "Tag not found"
}
```

**404 Not Found — `TASK_TAG_NOT_FOUND`**

```json id="s7c3wf"
{
  "code": "TASK_TAG_NOT_FOUND",
  "message": "Task tag association not found"
}
```

---

## Security

- The authenticated user's ID is obtained from the JWT access token.
- The project must belong to the authenticated user.
- Tasks are accessed within their project.
- Parent tasks must belong to the same project and user.
- Tags must belong to the authenticated user.
- Task-tag associations verify ownership of both the task and the tag.
- Client-provided user IDs are not trusted for ownership checks.

## Error Responses

Task endpoints use the standard API error response format:

```json id="c4m8zp"
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

The error code identifies the specific error, while the message provides a human-readable description.

**Correção mais importante:** `PARENT_NOT_FOUND` não existe no backend; o código centralizado é **`PARENT_TASK_NOT_FOUND`**. Também mantive `TASK_TAG_ASSOCIATION_ALREADY_EXISTS` exatamente como está no `errorTypes`.
