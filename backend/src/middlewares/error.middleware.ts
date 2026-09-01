import { AppError } from "@/errors/app.error.js";
import type { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
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
