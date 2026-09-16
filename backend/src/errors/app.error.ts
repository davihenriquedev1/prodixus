import { errorTypes, type ErrorCode } from "./error.types.js";

export class AppError extends Error {
  constructor(public readonly code: ErrorCode) {
    const error = errorTypes[code];

    super(error.message);

    this.name = "AppError";
  }

  get statusCode() {
    return errorTypes[this.code].statusCode;
  }
}
