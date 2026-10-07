import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator.js";
import { TaskRepository } from "@/repositories/task.repository.js";
import { ProjectRepository } from "@/repositories/project.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "@/config/prisma.js";
import { TagRepository } from "@/repositories/tag.repository.js";

function mapTaskWithTags<
  T extends {
    taskTags: Array<{
      tag: {
        id: string;
        name: string;
        color: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
  },
>(task: T) {
  const { taskTags, ...rest } = task;

  return {
    ...rest,
    tags: taskTags.map(({ tag }) => tag),
  };
}

export const TaskService = {
  async createTask(
    userId: string | undefined,
    projectId: string | undefined,
    data: z.infer<typeof createTaskSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    if (data.parentId !== undefined) {
      const parentTask = await TaskRepository.findFirstByProjectId(
        project.id,
        data.parentId,
      );

      if (!parentTask) {
        throw new AppError("PARENT_TASK_NOT_FOUND");
      }

      if (parentTask.parentId) {
        throw new AppError("TASK_IS_SUBTASK");
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

    const task = await TaskRepository.create(taskData);

    return mapTaskWithTags(task);
  },
  async getTasks(userId: string | undefined, projectId: string | undefined) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    const tasks = await TaskRepository.findManyByProjectId(projectId);

    return tasks.map(mapTaskWithTags);
  },
  async getTask(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    if (!taskId) {
      throw new AppError("TASK_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    const task = await TaskRepository.findFirstByProjectId(projectId, taskId);

    if (!task) {
      throw new AppError("TASK_NOT_FOUND");
    }

    return mapTaskWithTags(task);
  },
  async updateTask(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
    data: z.infer<typeof updateTaskSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    if (!taskId) {
      throw new AppError("TASK_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    const task = await TaskRepository.findFirstByProjectId(projectId, taskId);

    if (!task) {
      throw new AppError("TASK_NOT_FOUND");
    }

    if (data.projectId !== undefined) {
      const targetProject = await ProjectRepository.findFirstByUserId(
        userId,
        data.projectId,
      );

      if (!targetProject) {
        throw new AppError("PROJECT_NOT_FOUND");
      }

      if (targetProject.archived) {
        throw new AppError("PROJECT_ARCHIVED");
      }
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      if (data.parentId === taskId) {
        throw new AppError("TASK_CANNOT_BE_OWN_PARENT");
      }

      const parentTask = await TaskRepository.findFirstByProjectId(
        projectId,
        data.parentId,
      );

      if (!parentTask) {
        throw new AppError("PARENT_TASK_NOT_FOUND");
      }

      if (parentTask.parentId) {
        throw new AppError("TASK_IS_SUBTASK");
      }
    }

    const taskData: Prisma.TaskUpdateInput = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.archived !== undefined && { archived: data.archived }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.estimatedDuration !== undefined && {
        estimatedDuration: data.estimatedDuration,
      }),
      ...(data.startAt !== undefined && { startAt: data.startAt }),
      ...(data.dueAt !== undefined && { dueAt: data.dueAt }),

      ...(data.parentId !== undefined && {
        parentTask: data.parentId
          ? { connect: { id: data.parentId } }
          : { disconnect: true },
      }),

      ...(data.projectId !== undefined && {
        project: {
          connect: {
            id: data.projectId,
          },
        },
      }),
    };

    const taskUpdated = await prisma.$transaction(async (tx) => {
      const updatedTask = await TaskRepository.update(taskId, taskData, tx);

      if (
        data.projectId !== undefined &&
        data.projectId !== projectId &&
        !task.parentId
      ) {
        await TaskRepository.updateManyByParentId(
          taskId,
          { projectId: data.projectId },
          tx,
        );
      }

      if (data.archived === true && !task.parentId) {
        await TaskRepository.updateManyByParentId(
          taskId,
          { archived: true },
          tx,
        );
      }

      if (data.completed !== undefined && !task.parentId) {
        await TaskRepository.updateManyByParentId(
          taskId,
          { completed: data.completed },
          tx,
        );
      }

      return updatedTask;
    });

    return mapTaskWithTags(taskUpdated);
  },
  async deleteTask(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    if (!taskId) {
      throw new AppError("TASK_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.findFirstByUserId(
      userId,
      projectId,
    );

    if (!project) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    const task = await TaskRepository.findFirstByProjectId(projectId, taskId);

    if (!task) {
      throw new AppError("TASK_NOT_FOUND");
    }

    await prisma.$transaction(async (tx) => {
      await TaskRepository.deleteManyByParentId(taskId, tx);
      await TaskRepository.delete(taskId, tx);
    });
  },
  async getTasksByTagId(userId: string | undefined, tagId: string | undefined) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!tagId) {
      throw new AppError("TAG_ID_NOT_RECEIVED");
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError("TAG_NOT_FOUND");
    }

    const tasks = await TaskRepository.findManyByTagId(userId, tagId);

    return tasks.map(mapTaskWithTags);
  },
};
