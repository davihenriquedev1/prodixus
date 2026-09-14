import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const FolderRepository = {
  async create(data: Prisma.FolderCreateInput) {
    return prisma.folder.create({
      data,
    });
  },
  async findById(id: string, userId: string) {
    return prisma.folder.findFirst({
      where: {
        id,
        userId,
      },
    });
  },
};
