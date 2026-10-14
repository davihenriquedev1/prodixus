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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError("USER_NOT_FOUND");
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError("USER_NOT_FOUND");
    }

    if (!data.name && !data.email) {
      throw new AppError("UPDATE_DATA_NOT_RECEIVED");
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError("USER_NOT_FOUND");
    }

    if (!(await bcrypt.compare(data.curPassword, userDB.passwordHash))) {
      throw new AppError("INVALID_CURRENT_PASSWORD");
    }

    const newHash = await bcrypt.hash(data.newPassword, 10);

    await UserRepository.changePassword(userId, newHash);

    await RefreshTokenRepository.revokeAllByUserId(userId);
  },
  async deleteAccount(userId: string | undefined) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const userDB = await UserRepository.findById(userId);

    if (!userDB) {
      throw new AppError("USER_NOT_FOUND");
    }

    await UserRepository.delete(userId);
  },
};
