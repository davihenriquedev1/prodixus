import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const RefreshTokenRepository = {
  async create(refreshToken: Prisma.RefreshTokenCreateInput) {
    const token = await prisma.refreshToken.create({
      data: refreshToken,
    });
    return token;
  },
};
