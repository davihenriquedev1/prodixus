import { AppError } from "@/errors/app.error.js";
import { UserSettingsRepository } from "@/repositories/user-settings.repository.js";
import type { updateUserSettingsSchema } from "@/validators/user-settings.validator.js";
import type { z } from "zod";

export const UserSettingsService = {
  async get(userId?: string) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const settings = await UserSettingsRepository.findByUserId(userId);

    if (settings) {
      return {
        settings: {
          theme: settings.theme,
          updatedAt: settings.updatedAt,
        },
      };
    }

    const settingsCreated = await UserSettingsRepository.upsertByUserId(
      userId,
      "system",
    );

    return {
      settings: {
        theme: settingsCreated.theme,
        updatedAt: settingsCreated.updatedAt,
      },
    };
  },

  async update(
    userId: string | undefined,
    data: z.infer<typeof updateUserSettingsSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const settings = await UserSettingsRepository.upsertByUserId(
      userId,
      data.theme,
    );

    return {
      settings: {
        theme: settings.theme,
        updatedAt: settings.updatedAt,
      },
    };
  },
};
