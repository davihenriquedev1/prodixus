import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TaskRepository = {
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({ data });
  },
  async findFirstByProjectId(projectId: string, taskId: string) {
    return prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
    });
  },
  async findManyByProjectId(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
    });
  },
  async update(taskId: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      data,
      where: {
        id: taskId,
      },
    });
  },
};
