# Folders

Folder endpoints are used to create and manage folders belonging to the authenticated user.

All endpoints require a valid JWT access token.

## Endpoints

| Method   | Endpoint                 | Description             |
| -------- | ------------------------ | ----------------------- |
| `POST`   | `/api/folders`           | Create a folder         |
| `GET`    | `/api/folders`           | List the user's folders |
| `GET`    | `/api/folders/:folderId` | Retrieve a folder       |
| `PATCH`  | `/api/folders/:folderId` | Update a folder         |
| `DELETE` | `/api/folders/:folderId` | Delete a folder         |

---

## Create Folder

Create a folder for the authenticated user.

### Request

```http
POST /api/folders

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "name": "Work",
  "parentId": "uuid"
}
```

| Field      | Type   | Required | Description       |
| ---------- | ------ | -------- | ----------------- |
| `name`     | string | Yes      | Folder name.      |
| `parentId` | UUID   | No       | Parent folder ID. |

### Success Response

**201 Created**

Returns the created folder.

### Parent Folder Rules

When `parentId` is provided:

- The parent folder must exist.
- The parent folder must belong to the authenticated user.

### Errors

- `400 Bad Request` — `VALIDATION_ERROR`
- `401 Unauthorized` — `AUTHENTICATION_TOKEN_REQUIRED`
- `401 Unauthorized` — `INVALID_AUTHENTICATION_TOKEN`
- `404 Not Found` — `USER_NOT_FOUND`
- `404 Not Found` — `FOLDER_NOT_FOUND`

---

## List Folders

Retrieve all folders belonging to the authenticated user.

### Request

```http
GET /api/folders

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the user's folders.

### Errors

- `401 Unauthorized` — `AUTHENTICATION_TOKEN_REQUIRED`
- `401 Unauthorized` — `INVALID_AUTHENTICATION_TOKEN`

---

## Get Folder

Retrieve a specific folder.

### Request

```http
GET /api/folders/:folderId

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested folder.

### Errors

- `401 Unauthorized` — `AUTHENTICATION_TOKEN_REQUIRED`
- `401 Unauthorized` — `INVALID_AUTHENTICATION_TOKEN`
- `404 Not Found` — `FOLDER_NOT_FOUND`

A folder belonging to another user is treated as not found.

---

## Update Folder

Update an existing folder.

### Request

```http
PATCH /api/folders/:folderId

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

All fields are optional.

```json
{
  "name": "Updated Folder",
  "parentId": "uuid"
}
```

### Success Response

**200 OK**

Returns the updated folder.

### Parent Folder Rules

When changing the parent:

- The parent folder must belong to the authenticated user.
- A folder cannot be its own parent.
- A folder cannot be moved into one of its descendants.

These checks prevent circular folder hierarchies.

### Errors

- `400 Bad Request` — `VALIDATION_ERROR`
- `401 Unauthorized` — `AUTHENTICATION_TOKEN_REQUIRED`
- `401 Unauthorized` — `INVALID_AUTHENTICATION_TOKEN`
- `404 Not Found` — `FOLDER_NOT_FOUND`
- `409 Conflict` — `FOLDER_CYCLE`

---

## Delete Folder

Delete a folder belonging to the authenticated user.

### Request

```http
DELETE /api/folders/:folderId

Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

- `401 Unauthorized` — `AUTHENTICATION_TOKEN_REQUIRED`
- `401 Unauthorized` — `INVALID_AUTHENTICATION_TOKEN`
- `404 Not Found` — `FOLDER_NOT_FOUND`

---

## Standard Error Response

API errors use a consistent response structure:

```json
{
  "code": "FOLDER_NOT_FOUND",
  "message": "Folder not found"
}
```

The `code` identifies the specific error, while `message` provides a human-readable description.

---

## Security

- The authenticated user's ID is obtained from the JWT access token.
- Folders are accessed only within the authenticated user's scope.
- A user cannot access or modify another user's folders.
- Parent-folder ownership is verified before creating or updating folder relationships.
- Client-provided user IDs are not trusted for ownership checks.
