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
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      error: "Invalid request data",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
};

export default errorHandler;
