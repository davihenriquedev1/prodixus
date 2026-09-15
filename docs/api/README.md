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

Invalid data is rejected and the corresponding endpoint returns an appropriate client error response.

Validation rules and accepted fields are documented for each resource.

## HTTP Status Codes

The API uses standard HTTP status codes to indicate the result of a request.

| Status             | Meaning                                                |
| ------------------ | ------------------------------------------------------ |
| `200 OK`           | Request completed successfully                         |
| `201 Created`      | Resource created successfully                          |
| `204 No Content`   | Request completed successfully without a response body |
| `400 Bad Request`  | Request contains invalid data                          |
| `401 Unauthorized` | Authentication is missing or invalid                   |
| `404 Not Found`    | Resource was not found or is not accessible            |
| `409 Conflict`     | Request conflicts with existing data                   |

The exact status codes and response bodies are documented with each endpoint.

## Error Responses

Errors are returned as JSON responses.

The response structure and error codes are documented according to the current API implementation.

Example:

```json
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project not found"
}
```

The exact error code and message depend on the endpoint and the error that occurred.

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
