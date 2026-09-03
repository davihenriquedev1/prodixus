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
      throw new AppError(
        409,
        "USER_ALREADY_EXISTS",
        "User with this email already exists",
      );
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
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid e-mail or password",
      );
    }

    const passwordIsValid = await bcrypt.compare(
      data.password,
      userDB.passwordHash,
    );
    if (!passwordIsValid) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid e-mail or password",
      );
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
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid Refresh Token");
    }

    const tokenHash = hashRefreshToken(data.refreshToken);

    const storedToken = await RefreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    if (storedToken.revokedAt) {
      throw new AppError(
        401,
        "REFRESH_TOKEN_REVOKED",
        "Refresh token has been revoked",
      );
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new AppError(
        401,
        "REFRESH_TOKEN_EXPIRED",
        "Refresh token has expired",
      );
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user || storedToken.userId !== user.id) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
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
    // Verificar a assinatura do refresh token
    const decoded = verifyRefreshToken(data.refreshToken);

    // Validar o payload
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid Refresh Token");
    }

    // Gerar o hash SHA-256
    const tokenHash = hashRefreshToken(data.refreshToken);

    // Buscar o refresh token no banco
    const storedToken = await RefreshTokenRepository.findByTokenHash(tokenHash);

    // Se não existir → token inválido.
    if (!storedToken) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    // Verificar se já foi revogado
    if (storedToken.revokedAt) {
      throw new AppError(
        401,
        "REFRESH_TOKEN_REVOKED",
        "Refresh token has been revoked",
      );
    }

    // Verificar expiração
    if (storedToken.expiresAt <= new Date()) {
      throw new AppError(
        401,
        "REFRESH_TOKEN_EXPIRED",
        "Refresh token has expired",
      );
    }

    // Validar o usuário
    const user = await UserRepository.findById(decoded.userId);

    // Confirmar que o userId do token corresponde ao userId do registro RefreshToken.
    if (!user || storedToken.userId !== user.id) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    // Revogar o token
    await RefreshTokenRepository.revoke(storedToken.id);
  },
};
