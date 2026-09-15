# Tags

Tag endpoints are used to create and manage tags belonging to the authenticated user.

All endpoints require a valid JWT access token.

## Endpoints

| Method   | Endpoint        | Description          |
| -------- | --------------- | -------------------- |
| `POST`   | `/api/tags`     | Create a tag         |
| `GET`    | `/api/tags`     | List the user's tags |
| `GET`    | `/api/tags/:id` | Retrieve a tag       |
| `PATCH`  | `/api/tags/:id` | Update a tag         |
| `DELETE` | `/api/tags/:id` | Delete a tag         |

Task-tag associations are managed through the task endpoints.

---

## Create Tag

Create a tag for the authenticated user.

### Request

```http
POST /api/tags
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "name": "Important",
  "color": "#ff0000"
}
```

| Field   | Type   | Required | Description |
| ------- | ------ | -------- | ----------- |
| `name`  | string | Yes      | Tag name.   |
| `color` | string | Yes      | Tag color.  |

### Success Response

**201 Created**

Returns the created tag.

### Errors

- `409 Conflict` — `TAG_ALREADY_EXISTS`

A user cannot create two tags with the same name.

---

## List Tags

Retrieve all tags belonging to the authenticated user.

### Request

```http
GET /api/tags
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the user's tags.

---

## Get Tag

Retrieve a specific tag.

### Request

```http
GET /api/tags/:id
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the requested tag.

### Errors

- `404 Not Found` — `TAG_NOT_FOUND`

A tag belonging to another user is treated as not found.

---

## Update Tag

Update an existing tag.

### Request

```http
PATCH /api/tags/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

At least one field must be provided.

```json
{
  "name": "Updated",
  "color": "#00ff00"
}
```

Both `name` and `color` are optional individually.

### Success Response

**200 OK**

Returns the updated tag.

### Errors

- `404 Not Found` — `TAG_NOT_FOUND`
- `409 Conflict` — `NO_DATA_RECEIVED`

---

## Delete Tag

Delete a tag belonging to the authenticated user.

### Request

```http
DELETE /api/tags/:id
Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

- `404 Not Found` — `TAG_NOT_FOUND`

---

## Security

- The authenticated user's ID is obtained from the JWT access token.
- Tags are accessed only within the authenticated user's scope.
- A user cannot access or modify another user's tags.
- Tag ownership is also verified when creating or removing task-tag associations.
- Client-provided user IDs are not trusted for ownership checks.
