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
  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
};
