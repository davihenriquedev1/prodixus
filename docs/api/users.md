# Users

User endpoints are used to retrieve and manage the authenticated user's account.

All endpoints require a valid JWT access token.

## Endpoints

| Method   | Endpoint                 | Description                               |
| -------- | ------------------------ | ----------------------------------------- |
| `GET`    | `/api/users/me`          | Retrieve the authenticated user's profile |
| `PATCH`  | `/api/users/me`          | Update the authenticated user's profile   |
| `PATCH`  | `/api/users/me/password` | Change the authenticated user's password  |
| `DELETE` | `/api/users/me`          | Delete the authenticated user's account   |

---

## Get Current User

Retrieve the profile of the authenticated user.

### Request

```http
GET /api/users/me

Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-15T12:00:00.000Z",
    "updatedAt": "2026-09-15T12:00:00.000Z"
  }
}
```

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `USER_NOT_FOUND`**

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

---

## Update Profile

Update the authenticated user's name and/or e-mail.

### Request

```http
PATCH /api/users/me

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

Both fields are optional, but at least one must be provided.

| Field   | Type   | Required | Description           |
| ------- | ------ | -------- | --------------------- |
| `name`  | string | No       | User name.            |
| `email` | string | No       | Valid e-mail address. |

### Success Response

**200 OK**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "createdAt": "2026-09-15T12:00:00.000Z",
    "updatedAt": "2026-09-15T12:10:00.000Z"
  }
}
```

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `USER_NOT_FOUND`**

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

**409 Conflict — `UPDATE_DATA_NOT_RECEIVED`**

```json
{
  "code": "UPDATE_DATA_NOT_RECEIVED",
  "message": "Some data is required for update"
}
```

---

## Change Password

Change the authenticated user's password.

All refresh tokens belonging to the user are revoked after the password is successfully changed.

### Request

```http
PATCH /api/users/me/password

Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "curPassword": "CurrentPassword123",
  "newPassword": "NewPassword123"
}
```

| Field         | Type   | Required | Description                                                                                                   |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `curPassword` | string | Yes      | Current account password.                                                                                     |
| `newPassword` | string | Yes      | New password. Must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number. |

### Success Response

**204 No Content**

No response body is returned.

### Errors

**400 Bad Request — `VALIDATION_ERROR`**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**401 Unauthorized — `INVALID_CURRENT_PASSWORD`**

```json
{
  "code": "INVALID_CURRENT_PASSWORD",
  "message": "Incorrect password"
}
```

**404 Not Found — `USER_NOT_FOUND`**

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

---

## Delete Account

Delete the authenticated user's account.

### Request

```http
DELETE /api/users/me

Authorization: Bearer <access_token>
```

### Success Response

**204 No Content**

No response body is returned.

### Errors

**401 Unauthorized — `AUTHENTICATION_TOKEN_REQUIRED`**

```json
{
  "code": "AUTHENTICATION_TOKEN_REQUIRED",
  "message": "Authentication token is required"
}
```

**401 Unauthorized — `INVALID_AUTHENTICATION_TOKEN`**

```json
{
  "code": "INVALID_AUTHENTICATION_TOKEN",
  "message": "Invalid authentication token"
}
```

**404 Not Found — `USER_NOT_FOUND`**

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

---

## Security

- The authenticated user's ID is obtained from the access token.
- User endpoints operate only on the authenticated user's account.
- Clients cannot specify another user's ID to access or modify an account.
- Passwords are never returned in API responses.
- Refresh tokens are revoked after a successful password change.

## Error Responses

User endpoints use the standard API error response format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

The error code identifies the specific error, while the message provides a human-readable description.
