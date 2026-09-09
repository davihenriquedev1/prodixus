import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type { createTaskSchema } from "@/validators/task.validator.js";
import { TaskRepository } from "@/repositories/task.repository.js";
import { ProjectRepository } from "@/repositories/project.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TaskService = {
  async createTask(
    userId: string | undefined,
    projectId: string | undefined,
    data: z.infer<typeof createTaskSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "USER_ID_REQUIRED", "User id not received");
    }

    if (!projectId) {
      throw new AppError(409, "PROJECT_ID_REQUIRED", "Project id not received");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found or does not belong to user",
      );
    }

    if (data.parentId !== undefined) {
      const parentTask = await TaskRepository.findFirstByProjectId(
        project.id,
        data.parentId,
      );

      if (!parentTask) {
        throw new AppError(
          404,
          "PARENT_NOT_FOUND",
          "Parent task not found or does not belong to user",
        );
      }

      if (parentTask.parentId) {
        throw new AppError(409, "TASK_IS_SUBTASK", "Task already is a subtask");
      }
    }

    const taskData: Prisma.TaskCreateInput = {
      title: data.title,

      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.archived !== undefined && { archived: data.archived }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.estimatedDuration !== undefined && {
        estimatedDuration: data.estimatedDuration,
      }),
      ...(data.startAt !== undefined && { startAt: data.startAt }),
      ...(data.dueAt !== undefined && { dueAt: data.dueAt }),

      project: {
        connect: {
          id: projectId,
        },
      },

      ...(data.parentId !== undefined && {
        parentTask: {
          connect: {
            id: data.parentId,
          },
        },
      }),
    };

    return TaskRepository.create(taskData);
  },
  async getTasks(userId: string | undefined, projectId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    if (!projectId) {
      throw new AppError(409, "ID_REQUIRED", "Project id not received");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found or does not belong to user",
      );
    }

    return TaskRepository.findManyByProjectId(projectId);
  },
  async getTask(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    if (!projectId) {
      throw new AppError(409, "ID_REQUIRED", "Project id not received");
    }

    if (!taskId) {
      throw new AppError(409, "ID_REQUIRED", "Task id not received");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found or does not belong to user",
      );
    }

    const task = await TaskRepository.findFirstByProjectId(projectId, taskId);

    if (!task) {
      throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    }

    return task;
  },
};
