import { AppError } from "@/errors/app.error.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import type {
  changePasswordSchema,
  updateProfileSchema,
  userProfileSchema,
} from "@/validators/user.validator.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { RefreshTokenRepository } from "@/repositories/refresh-token.repository.js";

export const UserService = {
  async me(userId?: string) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    const safeUser: z.infer<typeof userProfileSchema> = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      createdAt: userDB.createdAt,
      updatedAt: userDB.updatedAt,
    };

    return {
      user: safeUser,
    };
  },
  async updateProfile(
    userId: string | undefined,
    data: z.infer<typeof updateProfileSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (!data.name && !data.email) {
      throw new AppError(409, "DATA_REQUIRED", "Data required for update");
    }

    const userData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) {
      userData.name = data.name;
    }

    if (data.email !== undefined) {
      userData.email = data.email;
    }

    const user = await UserRepository.update(userId, userData);

    const safeUser: z.infer<typeof userProfileSchema> = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: safeUser,
    };
  },
  async changePassword(
    userId: string | undefined,
    data: z.infer<typeof changePasswordSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (!(await bcrypt.compare(data.curPassword, userDB.passwordHash))) {
      throw new AppError(401, "UNAUTHORIZED", "Incorrect password");
    }

    const newHash = await bcrypt.hash(data.newPassword, 10);

    await UserRepository.changePassword(userId, newHash);

    await RefreshTokenRepository.revokeAllByUserId(userId);
  },
};
