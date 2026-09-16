import { errorTypes } from "@/errors/error.types.js";
import { AppError } from "@/errors/app.error.js";

import type { NextFunction, Request, Response } from "express";

import z from "zod";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    const error = errorTypes.VALIDATION_ERROR;

    return res.status(error.statusCode).json({
      code: "VALIDATION_ERROR",
      message: error.message,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  const error = errorTypes.INTERNAL_SERVER_ERROR;

  return res.status(error.statusCode).json({
    code: "INTERNAL_SERVER_ERROR",
    message: error.message,
  });
};

export default errorHandler;
