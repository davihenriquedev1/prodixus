import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TaskTagRepository = {
  async create(data: Prisma.TaskTagCreateInput) {
    return prisma.taskTag.create({ data });
  },
  async findByTaskIdAndTagId(taskId: string, tagId: string) {
    return prisma.taskTag.findUnique({
      where: {
        taskId_tagId: {
          tagId,
          taskId,
        },
      },
    });
  },
  async delete(taskId: string, tagId: string) {
    return prisma.taskTag.delete({
      where: {
        taskId_tagId: {
          tagId,
          taskId,
        },
      },
    });
  },
};
