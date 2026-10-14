# Projects

Project endpoints are used to create and manage projects belonging to the authenticated user.

All endpoints require a valid JWT access token.

## Endpoints

| Method   | Endpoint            | Description              |
| -------- | ------------------- | ------------------------ |
| `POST`   | `/api/projects`     | Create a project         |
| `GET`    | `/api/projects`     | List the user's projects |
| `GET`    | `/api/projects/:id` | Retrieve a project       |
| `PATCH`  | `/api/projects/:id` | Update a project         |
| `DELETE` | `/api/projects/:id` | Delete a project         |

---

## Create Project

Create a project for the authenticated user.

### Request

```http id="h5tq5s"
POST /api/projects

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json id="7a0t8q"
{
  "name": "My Project",
  "notes": "Project notes",
  "completed": false,
  "archived": false,
  "estimatedDuration": 120,
  "dueAt": "2026-10-01T18:00:00.000Z",
  "primaryColor": "#000000",
  "accentColor": "#ffffff",
  "errorColor": "#ff0000",
  "folderId": "uuid"
}
```

| Field               | Type     | Required | Description                          |
| ------------------- | -------- | -------- | ------------------------------------ |
| `name`              | string   | Yes      | Project name.                        |
| `notes`             | string   | No       | Project notes.                       |
| `completed`         | boolean  | No       | Whether the project is completed.    |
| `archived`          | boolean  | No       | Whether the project is archived.     |
| `estimatedDuration` | integer  | No       | Estimated project duration.          |
| `dueAt`             | datetime | No       | Project due date.                    |
| `primaryColor`      | string   | No       | Primary project color.               |
| `accentColor`       | string   | No       | Accent project color.                |
| `errorColor`        | string   | No       | Error project color.                 |
| `folderId`          | UUID     | No       | Folder to which the project belongs. |

### Success Response

**201 Created**

Returns the created project.

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json id="s8x2s3"
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="j8h3dj"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="o4qj6f"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `USER_NOT_FOUND`**

```json id="x1qj7s"
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

**404 Not Found — `FOLDER_NOT_FOUND`**

```json id="y5v2mb"
{
  "code": "FOLDER_NOT_FOUND",
  "message": "Folder not found"
}
```

If `folderId` is provided, the folder must belong to the authenticated user.

---

## List Projects

Retrieve all projects belonging to the authenticated user.

### Request

```http id="m2z0e8"
GET /api/projects

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the user's projects.

Only projects belonging to the authenticated user are returned.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="d8y1qv"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="h3r5qz"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

---

## Get Project

Retrieve a specific project.

### Request

```http id="z8q4a1"
GET /api/projects/:id

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested project.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="6n4q7w"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="m5p8kc"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="q2z6ne"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

A project belonging to another user is treated as not found.

---

## Update Project

Update an existing project.

### Request

```http id="y6q3kw"
PATCH /api/projects/:id

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

All project fields are optional.

```json id="v1s7xf"
{
  "name": "Updated Project",
  "notes": "Updated notes",
  "completed": true,
  "archived": false,
  "estimatedDuration": 180,
  "dueAt": "2026-10-15T18:00:00.000Z",
  "primaryColor": "#111111",
  "accentColor": "#eeeeee",
  "errorColor": "#ff0000",
  "folderId": "uuid"
}
```

The same fields available when creating a project can be updated.

### Success Response

**200 OK**

Returns the updated project.

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json id="c6v1xn"
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="7p3x8b"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="n4s9qa"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="j2v6tm"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

**404 Not Found — `FOLDER_NOT_FOUND`**

```json id="p7w3kc"
{
  "code": "FOLDER_NOT_FOUND",
  "message": "Folder not found"
}
```

---

## Delete Project

Delete a project belonging to the authenticated user.

### Request

```http id="r5m8xz"
DELETE /api/projects/:id

Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json id="q8d2wm"
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json id="c3k7py"
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `PROJECT_NOT_FOUND`**

```json id="a9v4ns"
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

---

## Security

- The authenticated user's ID is obtained from the JWT access token.
- Projects are accessed only through the authenticated user's identity.
- A user cannot access or modify another user's projects.
- When assigning a project to a folder, the folder must belong to the authenticated user.
- Ownership checks are performed by the backend and must not rely on client-provided user IDs.

## Error Responses

Project endpoints use the standard API error response format:

```json id="e6q1tz"
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

The error code identifies the specific error, while the message provides a human-readable description.
