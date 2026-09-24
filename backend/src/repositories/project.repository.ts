import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

type PrismaTransaction = Prisma.TransactionClient;

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
  async update(
    userId: string,
    projectId: string,
    data: Prisma.ProjectUpdateInput,
    tx: PrismaTransaction = prisma,
  ) {
    const project = await tx.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return null;

    return tx.project.update({
      where: {
        id: projectId,
      },
      data,
    });
  },
  async delete(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return null;

    return prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  },
};
