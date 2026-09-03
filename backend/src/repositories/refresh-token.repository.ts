import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const RefreshTokenRepository = {
  async create(refreshToken: Prisma.RefreshTokenCreateInput) {
    const token = await prisma.refreshToken.create({
      data: refreshToken,
    });
    return token;
  },
  async findByTokenHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  },
  async revoke(id: string) {
    return prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
};
