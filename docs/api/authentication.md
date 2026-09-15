# Authentication

Authentication endpoints are used to create user accounts, authenticate users, refresh access tokens, and invalidate refresh tokens.

## Endpoints

| Method | Endpoint             | Authentication |
| ------ | -------------------- | -------------- |
| `POST` | `/api/auth/register` | Not required   |
| `POST` | `/api/auth/login`    | Not required   |
| `POST` | `/api/auth/refresh`  | Not required   |
| `POST` | `/api/auth/logout`   | Not required   |

---

## Register

Create a new user account and return authentication tokens.

### Request

```http
POST /api/auth/register
Content-Type: application/json
```

### Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

| Field      | Type   | Required | Description                                                                                     |
| ---------- | ------ | -------- | ----------------------------------------------------------------------------------------------- |
| `name`     | string | Yes      | User name. Must contain at least 2 characters.                                                  |
| `email`    | string | Yes      | Valid e-mail address.                                                                           |
| `password` | string | Yes      | Must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number. |

### Success Response

**201 Created**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

### Errors

- `409 Conflict` — `USER_ALREADY_EXISTS`

```json
{
  "code": "USER_ALREADY_EXISTS",
  "message": "User with this email already exists"
}
```

---

## Login

Authenticate an existing user and return authentication tokens.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

### Body

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

| Field      | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| `email`    | string | Yes      | Valid e-mail address. |
| `password` | string | Yes      | User password.        |

### Success Response

**200 OK**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

### Errors

- `401 Unauthorized` — `INVALID_CREDENTIALS`

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid e-mail or password"
}
```

The same response is returned when the e-mail does not exist or the password is incorrect.

---

## Refresh Token

Generate a new access token and refresh token using a valid refresh token.

The current refresh token is revoked when a new token pair is successfully generated.

### Request

```http
POST /api/auth/refresh
Content-Type: application/json
```

### Body

```json
{
  "refreshToken": "<refresh_token>"
}
```

| Field          | Type   | Required | Description          |
| -------------- | ------ | -------- | -------------------- |
| `refreshToken` | string | Yes      | Valid refresh token. |

### Success Response

**200 OK**

```json
{
  "accessToken": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

### Errors

#### Invalid refresh token

**401 Unauthorized**

```json
{
  "code": "INVALID_REFRESH_TOKEN",
  "message": "Invalid refresh token"
}
```

#### Revoked refresh token

**401 Unauthorized**

```json
{
  "code": "REFRESH_TOKEN_REVOKED",
  "message": "Refresh token has been revoked"
}
```

#### Expired refresh token

**401 Unauthorized**

```json
{
  "code": "REFRESH_TOKEN_EXPIRED",
  "message": "Refresh token has expired"
}
```

---

## Logout

Invalidate the provided refresh token.

### Request

```http
POST /api/auth/logout
Content-Type: application/json
```

### Body

```json
{
  "refreshToken": "<refresh_token>"
}
```

| Field          | Type   | Required | Description                  |
| -------------- | ------ | -------- | ---------------------------- |
| `refreshToken` | string | Yes      | Refresh token to invalidate. |

### Success Response

**204 No Content**

No response body is returned.

### Errors

#### Invalid refresh token

**401 Unauthorized**

```json
{
  "code": "INVALID_REFRESH_TOKEN",
  "message": "Invalid refresh token"
}
```

#### Revoked refresh token

**401 Unauthorized**

```json
{
  "code": "REFRESH_TOKEN_REVOKED",
  "message": "Refresh token has been revoked"
}
```

#### Expired refresh token

**401 Unauthorized**

```json
{
  "code": "REFRESH_TOKEN_EXPIRED",
  "message": "Refresh token has expired"
}
```

## Token Usage

The access token is used to authenticate protected API requests.

Send it using the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Access tokens expire after 30 minutes.

Refresh tokens expire after 4 days and are rotated when used successfully.
