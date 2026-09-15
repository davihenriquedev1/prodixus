import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const FolderRepository = {
  async create(data: Prisma.FolderCreateInput) {
    return prisma.folder.create({
      data,
    });
  },
  async findFirstByUserId(id: string, userId: string) {
    return prisma.folder.findFirst({
      where: {
        id,
        userId,
      },
    });
  },
  async findManyByUserId(userId: string) {
    return prisma.folder.findMany({
      where: {
        userId,
      },
    });
  },
  async update(folderId: string, data: Prisma.FolderUpdateInput) {
    return prisma.folder.update({
      data,
      where: {
        id: folderId,
      },
    });
  },
};
