import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TagRepository = {
  async create(data: Prisma.TagCreateInput) {
    return prisma.tag.create({ data });
  },
  async findByUserIdAndName(userId: string, name: string) {
    return prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
  },
  async findManyByUserId(userId: string) {
    return prisma.tag.findMany({
      where: {
        userId,
      },
    });
  },
  async findFirstByUserId(userId: string, tagId: string) {
    return prisma.tag.findFirst({
      where: {
        userId,
        id: tagId,
      },
    });
  },
};
