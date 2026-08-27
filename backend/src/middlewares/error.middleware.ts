import type { NextFunction, Request, Response } from "express";

const errorHandler = (
  _err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  res.status(500).json({
    error: "Internal server error",
  });
};

export default errorHandler;
