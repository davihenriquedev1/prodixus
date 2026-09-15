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

```http
POST /api/projects/:projectId/tasks
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
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

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `PARENT_NOT_FOUND`
- `409 Conflict` — `TASK_IS_SUBTASK`

---

## List Tasks

Retrieve all tasks belonging to a project.

### Request

```http
GET /api/projects/:projectId/tasks
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the project's tasks.

Tasks include their parent relationship when applicable.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`

---

## Get Task

Retrieve a specific task from a project.

### Request

```http
GET /api/projects/:projectId/tasks/:taskId
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested task.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `TASK_NOT_FOUND`

A task belonging to another user or another project is treated as not found.

---

## Update Task

Update an existing task.

### Request

```http
PATCH /api/projects/:projectId/tasks/:taskId
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

All task fields are optional.

```json
{
  "title": "Updated task",
  "notes": "Updated notes",
  "priority": 2,
  "completed": true,
  "archived": false
}
```

`parentId` can also be updated:

```json
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

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `TASK_NOT_FOUND`
- `404 Not Found` — `PARENT_NOT_FOUND`
- `409 Conflict` — `TASK_CANNOT_BE_OWN_PARENT`
- `409 Conflict` — `TASK_IS_SUBTASK`

---

## Delete Task

Delete a task from a project.

### Request

```http
DELETE /api/projects/:projectId/tasks/:taskId
Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `TASK_NOT_FOUND`

---

## Associate Tag

Associate an existing tag with a task.

### Request

```http
POST /api/projects/:projectId/tasks/:taskId/tags/:tagId
Authorization: Bearer <access_token>
```

### Success Response

**201 Created**

Returns the created task-tag association.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `TASK_NOT_FOUND`
- `404 Not Found` — `TAG_NOT_FOUND`
- `409 Conflict` — `TASK_TAG_ASSOCIATION_ALREADY_EXISTS`

The task and tag must belong to the authenticated user.

---

## Remove Tag

Remove a tag association from a task.

### Request

```http
DELETE /api/projects/:projectId/tasks/:taskId/tags/:tagId
Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `TASK_NOT_FOUND`
- `404 Not Found` — `TAG_NOT_FOUND`
- `404 Not Found` — `TASK_TAG_NOT_FOUND`

---

## Security

- The authenticated user's ID is obtained from the JWT access token.
- The project must belong to the authenticated user.
- Tasks are accessed within their project.
- Parent tasks must belong to the same project and user.
- Tags must belong to the authenticated user.
- Task-tag associations verify ownership of both the task and the tag.
- Client-provided user IDs are not trusted for ownership checks.
