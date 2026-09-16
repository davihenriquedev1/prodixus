import { AppError } from "@/errors/app.error.js";

import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "@/utils/jwt.js";

export const authMiddleware: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("AUTHENTICATION_TOKEN_REQUIRED");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("INVALID_AUTHENTICATION_TOKEN");
  }

  try {
    const decoded = verifyAccessToken(token);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      throw new AppError("INVALID_AUTHENTICATION_TOKEN");
    }

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("INVALID_AUTHENTICATION_TOKEN");
    }

    throw new AppError("AUTHENTICATION_FAILED");
  }
};
