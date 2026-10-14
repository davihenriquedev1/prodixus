# API Documentation

REST API documentation for the application backend.

## Overview

The API provides the backend services used by the application, including authentication, user management, projects, tasks, tags, and folders.

All endpoints are organized by resource and documented in their respective files.

## Base URL

When running the backend locally:

```text
http://localhost:3001/api
```

For other environments, replace the host with the corresponding API URL.

## Authentication

Most endpoints require authentication using a JWT access token.

Send the token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Authentication endpoints that do not require an access token are documented in [Authentication](./authentication.md).

## Resources

| Resource       | Description                                                  | Documentation                            |
| -------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Authentication | Registration, login, token refresh, and logout               | [authentication.md](./authentication.md) |
| Users          | User profile, account data, password, and account management | [users.md](./users.md)                   |
| Projects       | Project management and project-related resources             | [projects.md](./projects.md)             |
| Tasks          | Task management, subtasks, and task-related resources        | [tasks.md](./tasks.md)                   |
| Tags           | Tag management and task-tag associations                     | [tags.md](./tags.md)                     |
| Folders        | Folder management and folder hierarchy                       | [folders.md](./folders.md)               |

## API Conventions

### HTTP Methods

The API uses standard HTTP methods according to the operation being performed:

- `GET` — retrieve resources
- `POST` — create resources
- `PATCH` — update resources
- `DELETE` — delete resources

### Request Format

Endpoints that accept request data use JSON:

```http
Content-Type: application/json
```

Example:

```http
POST /api/projects

Content-Type: application/json

{
  "name": "My Project"
}
```

### Authentication and Ownership

Protected resources use the authenticated user's identity from the JWT access token.

The client must not provide a `userId` to determine resource ownership.

Resources are only accessible or modifiable when they belong to the authenticated user.

Related resources are also validated for ownership where required. For example, operations involving a task and a tag must ensure that both resources belong to the authenticated user.

### Validation

Request data is validated before being processed by the application.

Invalid data is rejected and returns a standardized validation error response.

Validation rules and accepted fields are documented for each resource.

## HTTP Status Codes

The API uses standard HTTP status codes to indicate the result of a request.

| Status                      | Meaning                                                |
| --------------------------- | ------------------------------------------------------ |
| `200 OK`                    | Request completed successfully                         |
| `201 Created`               | Resource created successfully                          |
| `204 No Content`            | Request completed successfully without a response body |
| `400 Bad Request`           | Request contains invalid data                          |
| `401 Unauthorized`          | Authentication is missing or invalid                   |
| `404 Not Found`             | Resource was not found or is not accessible            |
| `409 Conflict`              | Request conflicts with existing data                   |
| `500 Internal Server Error` | Unexpected server-side error                           |

The exact status code and error code depend on the endpoint and the type of error.

## Error Responses

Errors are returned as JSON responses using a consistent structure:

```json
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

The `code` identifies the specific error and provides a stable value for clients to handle.

The `message` provides a human-readable description of the error.

Error codes, HTTP status codes, and messages are centrally defined by the backend and reused wherever the same error occurs.

### Common Error Codes

| Code                                  | Status | Description                           |
| ------------------------------------- | ------ | ------------------------------------- |
| `VALIDATION_ERROR`                    | `400`  | Request data is invalid               |
| `AUTHENTICATION_TOKEN_REQUIRED`       | `401`  | Authentication token is missing       |
| `INVALID_AUTHENTICATION_TOKEN`        | `401`  | Authentication token is invalid       |
| `AUTHENTICATION_FAILED`               | `401`  | Authentication failed                 |
| `INVALID_CREDENTIALS`                 | `401`  | E-mail or password is invalid         |
| `INVALID_REFRESH_TOKEN`               | `401`  | Refresh token is invalid              |
| `REFRESH_TOKEN_REVOKED`               | `401`  | Refresh token has been revoked        |
| `REFRESH_TOKEN_EXPIRED`               | `401`  | Refresh token has expired             |
| `USER_NOT_FOUND`                      | `404`  | User was not found                    |
| `PROJECT_NOT_FOUND`                   | `404`  | Project was not found                 |
| `TASK_NOT_FOUND`                      | `404`  | Task was not found                    |
| `TAG_NOT_FOUND`                       | `404`  | Tag was not found                     |
| `FOLDER_NOT_FOUND`                    | `404`  | Folder was not found                  |
| `ROUTE_NOT_FOUND`                     | `404`  | Requested route was not found         |
| `USER_ALREADY_EXISTS`                 | `409`  | User with the e-mail already exists   |
| `TAG_ALREADY_EXISTS`                  | `409`  | Tag with the same name already exists |
| `UPDATE_DATA_NOT_RECEIVED`            | `409`  | Update data was not provided          |
| `TASK_IS_SUBTASK`                     | `409`  | Task is already a subtask             |
| `TASK_CANNOT_BE_OWN_PARENT`           | `409`  | Task cannot be its own parent         |
| `FOLDER_CYCLE`                        | `409`  | Folder cannot be its own parent       |
| `TASK_TAG_ASSOCIATION_ALREADY_EXISTS` | `409`  | Task-tag association already exists   |
| `INTERNAL_SERVER_ERROR`               | `500`  | Unexpected server-side error          |

Resource-specific errors are documented in the corresponding API resource documentation.

## Related Documentation

### Project Documentation

- [Architecture](../architecture/README.md)
- [Security](../security/README.md)

### API Resources

- [Authentication](./authentication.md)
- [Users](./users.md)
- [Projects](./projects.md)
- [Tasks](./tasks.md)
- [Tags](./tags.md)
- [Folders](./folders.md)
