import { AppError } from "@/errors/app.error.js";
import jwt, { type SignOptions } from "jsonwebtoken";

const privateKey = process.env.JWT_PRIVATE_KEY as string;
const publicKey = process.env.JWT_PUBLIC_KEY as string;

export const signAccessToken = (
  payload: object,
  expiresIn: NonNullable<SignOptions["expiresIn"]>,
) => {
  return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
};

export const signRefreshToken = (
  payload: object,
  expiresIn: NonNullable<SignOptions["expiresIn"]>,
) => {
  return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
};

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    decoded.type !== "access"
  ) {
    throw new Error("Invalid access token");
  }

  return decoded;
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      decoded.type !== "refresh"
    ) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }
};
