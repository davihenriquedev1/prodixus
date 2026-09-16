export const errorTypes = {
  USER_ID_NOT_RECEIVED: {
    statusCode: 409,
    message: "User id is required",
  },

  PROJECT_ID_NOT_RECEIVED: {
    statusCode: 409,
    message: "Project id is required",
  },

  TASK_ID_NOT_RECEIVED: {
    statusCode: 409,
    message: "Task id is required",
  },

  TAG_ID_NOT_RECEIVED: {
    statusCode: 409,
    message: "Tag id is required",
  },

  FOLDER_ID_NOT_RECEIVED: {
    statusCode: 409,
    message: "Folder id is required",
  },

  USER_NOT_FOUND: {
    statusCode: 404,
    message: "User not found",
  },

  PROJECT_NOT_FOUND: {
    statusCode: 404,
    message: "Project not found",
  },

  TASK_NOT_FOUND: {
    statusCode: 404,
    message: "Task not found",
  },

  TAG_NOT_FOUND: {
    statusCode: 404,
    message: "Tag not found",
  },

  FOLDER_NOT_FOUND: {
    statusCode: 404,
    message: "Folder not found",
  },

  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: "Invalid e-mail or password",
  },

  INVALID_REFRESH_TOKEN: {
    statusCode: 401,
    message: "Invalid refresh token",
  },

  REFRESH_TOKEN_REVOKED: {
    statusCode: 401,
    message: "Refresh token has been revoked",
  },

  REFRESH_TOKEN_EXPIRED: {
    statusCode: 401,
    message: "Refresh token has expired",
  },

  INVALID_CURRENT_PASSWORD: {
    statusCode: 401,
    message: "Incorrect password",
  },

  UPDATE_DATA_NOT_RECEIVED: {
    statusCode: 409,
    message: "Some data is required for update",
  },

  USER_ALREADY_EXISTS: {
    statusCode: 409,
    message: "User with this email already exists",
  },

  TAG_ALREADY_EXISTS: {
    statusCode: 409,
    message: "Tag already exists with this name",
  },

  TASK_IS_SUBTASK: {
    statusCode: 409,
    message: "Task already is a subtask",
  },

  TASK_CANNOT_BE_OWN_PARENT: {
    statusCode: 409,
    message: "Task cannot be its own parent",
  },

  PARENT_TASK_NOT_FOUND: {
    statusCode: 404,
    message: "Parent task not found or does not belong to user",
  },

  FOLDER_CYCLE: {
    statusCode: 409,
    message: "Folder cannot be its own parent",
  },

  TASK_TAG_ASSOCIATION_ALREADY_EXISTS: {
    statusCode: 409,
    message: "Task tag association already exists",
  },

  TASK_TAG_NOT_FOUND: {
    statusCode: 404,
    message: "Task tag association not found",
  },

  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "Internal server error",
  },

  ROUTE_NOT_FOUND: {
    statusCode: 404,
    message: "Route not found",
  },

  VALIDATION_ERROR: {
    statusCode: 400,
    message: "Invalid request data",
  },

  AUTHENTICATION_TOKEN_REQUIRED: {
    statusCode: 401,
    message: "Authentication token is required",
  },

  INVALID_AUTHENTICATION_TOKEN: {
    statusCode: 401,
    message: "Invalid authentication token",
  },

  AUTHENTICATION_FAILED: {
    statusCode: 401,
    message: "Authentication failed",
  },
} as const;

export type ErrorCode = keyof typeof errorTypes;
