import { errorTypes } from "@/errors/error.types.js";

import type { Request, Response } from "express";

const notFound = (_req: Request, res: Response) => {
  const error = errorTypes.ROUTE_NOT_FOUND;

  res.status(error.statusCode).json({
    code: "ROUTE_NOT_FOUND",
    message: error.message,
  });
};

export default notFound;
