import jwt, { type SignOptions } from "jsonwebtoken";

const privateKey = process.env.JWT_PRIVATE_KEY as string;

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
