import { AppError } from "@/errors/app.error.js";
import { UserRepository } from "@/repositories/user.repository.js";
import bcrypt from "bcrypt";
import type { Prisma } from "../../generated/prisma/client.js";
import { z } from "zod";
import type {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "@/validators/auth.validator.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt.js";
import { RefreshTokenRepository } from "@/repositories/refresh-token.repository.js";
import { hashRefreshToken } from "@/utils/hash.js";

export const AuthService = {
  async registerUser(data: z.infer<typeof registerSchema>) {
    const userDB = await UserRepository.findByEmail(data.email);

    if (userDB) {
      throw new AppError("USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const userData: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
      passwordHash,
    };

    const user = await UserRepository.create(userData);

    const accessToken = signAccessToken(
      { userId: user.id, type: "access" },
      "30m",
    );
    const refreshToken = signRefreshToken(
      { userId: user.id, type: "refresh" },
      "4d",
    );

    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    await RefreshTokenRepository.create({
      tokenHash,
      user: {
        connect: {
          id: user.id,
        },
      },
      expiresAt,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },
  async loginUser(data: z.infer<typeof loginSchema>) {
    const userDB = await UserRepository.findByEmail(data.email);

    if (!userDB) {
      throw new AppError("INVALID_CREDENTIALS");
    }

    const passwordIsValid = await bcrypt.compare(
      data.password,
      userDB.passwordHash,
    );
    if (!passwordIsValid) {
      throw new AppError("INVALID_CREDENTIALS");
    }

    const accessToken = signAccessToken(
      { userId: userDB.id, type: "access" },
      "30m",
    );
    const refreshToken = signRefreshToken(
      { userId: userDB.id, type: "refresh" },
      "4d",
    );

    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    await RefreshTokenRepository.create({
      tokenHash,
      user: {
        connect: {
          id: userDB.id,
        },
      },
      expiresAt,
    });

    const safeUser = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },
  async refreshToken(data: z.infer<typeof refreshTokenSchema>) {
    const decoded = verifyRefreshToken(data.refreshToken);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    const tokenHash = hashRefreshToken(data.refreshToken);

    const storedToken = await RefreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    if (storedToken.revokedAt) {
      throw new AppError("REFRESH_TOKEN_REVOKED");
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new AppError("REFRESH_TOKEN_EXPIRED");
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user || storedToken.userId !== user.id) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    const accessToken = signAccessToken(
      { userId: user.id, type: "access" },
      "30m",
    );
    const refreshToken = signRefreshToken(
      { userId: user.id, type: "refresh" },
      "4d",
    );

    const newTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    await RefreshTokenRepository.revoke(storedToken.id);

    await RefreshTokenRepository.create({
      tokenHash: newTokenHash,
      user: {
        connect: {
          id: user.id,
        },
      },
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  },
  async logoutUser(data: z.infer<typeof refreshTokenSchema>) {
    const decoded = verifyRefreshToken(data.refreshToken);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    const tokenHash = hashRefreshToken(data.refreshToken);

    const storedToken = await RefreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    if (storedToken.revokedAt) {
      throw new AppError("REFRESH_TOKEN_REVOKED");
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new AppError("REFRESH_TOKEN_EXPIRED");
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user || storedToken.userId !== user.id) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    await RefreshTokenRepository.revoke(storedToken.id);
  },
};
