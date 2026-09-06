import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const ProjectRepository = {
  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  },
  async findManyByUserId(userId: string) {
    return prisma.project.findMany({
      where: {
        userId,
      },
    });
  },
  async findFirstByUserId(userId: string, projectId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
    });
  },
};
