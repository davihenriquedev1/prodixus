import { prisma } from "@/config/prisma.js";

export const UserSettingsRepository = {
  async findByUserId(userId: string) {
    return prisma.userSettings.findUnique({
      where: { userId },
    });
  },

  async upsertByUserId(userId: string, theme: "light" | "dark" | "system") {
    return prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        theme,
      },
      update: {
        theme,
      },
    });
  },
};
