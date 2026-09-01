import { AppError } from "@/errors/app.error.js";
import { UserRepository } from "@/repositories/user.repository.js";
import bcrypt from "bcrypt";
import type { Prisma } from "../../generated/prisma/client.js";
import { z } from "zod";
import type {
  loginSchema,
  registerSchema,
} from "@/validators/auth.validator.js";
import { signAccessToken, signRefreshToken } from "@/utils/jwt.js";
import { RefreshTokenRepository } from "@/repositories/refresh-token.repository.js";

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

    const accessToken = signAccessToken({ userId: user.id }, "30m");
    const refreshToken = signRefreshToken({ userId: user.id }, "4d");

    const tokenHash = await bcrypt.hash(refreshToken, 10);

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

    const accessToken = signAccessToken({ userId: userDB.id }, "30m");
    const refreshToken = signRefreshToken({ userId: userDB.id }, "4d");

    const tokenHash = await bcrypt.hash(refreshToken, 10);

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
};
