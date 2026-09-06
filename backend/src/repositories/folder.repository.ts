import { prisma } from "@/config/prisma.js";

export const FolderRepository = {
  async findById(id: string) {
    return prisma.folder.findUnique({
      where: {
        id,
      },
    });
  },
};
