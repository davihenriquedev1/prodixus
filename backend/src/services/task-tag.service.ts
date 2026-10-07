import { AppError } from "@/errors/app.error.js";
import { TagRepository } from "@/repositories/tag.repository.js";
import { TaskTagRepository } from "@/repositories/task-tag.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { TaskRepository } from "@/repositories/task.repository.js";

export const TaskTagService = {
  async associateTag(
    userId: string | undefined,
    taskId: string | undefined,
    tagId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!taskId) {
      throw new AppError("TASK_ID_NOT_RECEIVED");
    }

    if (!tagId) {
      throw new AppError("TAG_ID_NOT_RECEIVED");
    }

    const task = await TaskRepository.findFirstByUserId(userId, taskId);

    if (!task) {
      throw new AppError("TASK_NOT_FOUND");
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError("TAG_NOT_FOUND");
    }

    const taskTag = await TaskTagRepository.findByTaskIdAndTagId(taskId, tagId);

    if (taskTag) {
      throw new AppError("TASK_TAG_ASSOCIATION_ALREADY_EXISTS");
    }

    const data: Prisma.TaskTagCreateInput = {
      tag: {
        connect: {
          id: tagId,
        },
      },
      task: {
        connect: {
          id: taskId,
        },
      },
    };

    return TaskTagRepository.create(data);
  },
  async removeTag(
    userId: string | undefined,
    taskId: string | undefined,
    tagId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!taskId) {
      throw new AppError("TASK_ID_NOT_RECEIVED");
    }

    if (!tagId) {
      throw new AppError("TAG_ID_NOT_RECEIVED");
    }

    const task = await TaskRepository.findFirstByUserId(userId, taskId);

    if (!task) {
      throw new AppError("TASK_NOT_FOUND");
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError("TAG_NOT_FOUND");
    }

    const taskTag = await TaskTagRepository.findByTaskIdAndTagId(taskId, tagId);

    if (!taskTag) {
      throw new AppError("TASK_TAG_NOT_FOUND");
    }

    await TaskTagRepository.delete(taskId, tagId);
  },
};
