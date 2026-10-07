import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

type PrismaTransaction = Prisma.TransactionClient;

export const TaskRepository = {
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data,
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async findFirstByProjectId(projectId: string, taskId: string) {
    return prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async findFirstByUserId(userId: string, taskId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId,
        },
      },
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async findManyByProjectId(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async findManyByTagId(userId: string, tagId: string) {
    return prisma.task.findMany({
      where: {
        project: {
          userId,
        },
        taskTags: {
          some: {
            tagId,
          },
        },
      },
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async update(
    taskId: string,
    data: Prisma.TaskUpdateInput,
    tx: PrismaTransaction = prisma,
  ) {
    return tx.task.update({
      data,
      where: {
        id: taskId,
      },
      include: {
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  async delete(taskId: string, tx: PrismaTransaction = prisma) {
    return tx.task.delete({
      where: {
        id: taskId,
      },
    });
  },
  async updateMany(
    projectId: string,
    data: Prisma.TaskUpdateManyMutationInput,
    tx: PrismaTransaction = prisma,
  ) {
    return tx.task.updateMany({
      where: {
        projectId,
      },
      data,
    });
  },
  async updateManyByParentId(
    parentId: string,
    data: Prisma.TaskUncheckedUpdateManyInput,
    tx: PrismaTransaction = prisma,
  ) {
    return tx.task.updateMany({
      where: {
        parentId,
      },
      data,
    });
  },
  async deleteManyByParentId(parentId: string, tx: PrismaTransaction = prisma) {
    return tx.task.deleteMany({
      where: {
        parentId,
      },
    });
  },
};
