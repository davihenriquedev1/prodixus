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

```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
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

- `404 Not Found` — `USER_NOT_FOUND`
- `404 Not Found` — `FOLDER_NOT_FOUND`

If `folderId` is provided, the folder must belong to the authenticated user.

---

## List Projects

Retrieve all projects belonging to the authenticated user.

### Request

```http
GET /api/projects
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the user's projects.

Only projects belonging to the authenticated user are returned.

---

## Get Project

Retrieve a specific project.

### Request

```http
GET /api/projects/:id
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested project.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`

```json
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

```http
PATCH /api/projects/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

All project fields are optional.

```json
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

- `404 Not Found` — `PROJECT_NOT_FOUND`
- `404 Not Found` — `FOLDER_NOT_FOUND`

---

## Delete Project

Delete a project belonging to the authenticated user.

### Request

```http
DELETE /api/projects/:id
Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

- `404 Not Found` — `PROJECT_NOT_FOUND`

```json
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
