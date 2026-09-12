import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator.js";
import { TaskRepository } from "@/repositories/task.repository.js";
import { ProjectRepository } from "@/repositories/project.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { TagRepository } from "@/repositories/tag.repository.js";
import { TaskTagRepository } from "@/repositories/task-tag.repository.js";

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
      throw new AppError(
        404,
        "TASK_NOT_FOUND",
        "Task not found or does not belong to user",
      );
    }

    return task;
  },
  async updateTask(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
    data: z.infer<typeof updateTaskSchema>,
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
      throw new AppError(
        404,
        "TASK_NOT_FOUND",
        "Task not found or does not belong to user",
      );
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      if (data.parentId === taskId) {
        throw new AppError(
          409,
          "TASK_CANNOT_BE_OWN_PARENT",
          "Task cannot be its own parent",
        );
      }

      const parentTask = await TaskRepository.findFirstByProjectId(
        projectId,
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
    };

    const taskUpdated = await TaskRepository.update(taskId, taskData);

    return taskUpdated;
  },
  async deleteTask(
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
      throw new AppError(
        404,
        "TASK_NOT_FOUND",
        "Task not found or does not belong to user",
      );
    }

    await TaskRepository.delete(taskId);
  },
  async associateTag(
    userId: string | undefined,
    projectId: string | undefined,
    taskId: string | undefined,
    tagId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError(409, "USER_ID_NOT_RECEIVED", "User id is required");
    }

    if (!projectId) {
      throw new AppError(
        409,
        "PROJECT_ID_NOT_RECEIVED",
        "Project id is required",
      );
    }

    if (!taskId) {
      throw new AppError(409, "TASK_ID_NOT_RECEIVED", "Task id is required");
    }

    if (!tagId) {
      throw new AppError(409, "TAG_ID_NOT_RECEIVED", "Tag id is required");
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
      throw new AppError(
        404,
        "TASK_NOT_FOUND",
        "Task not found or does not belong to user",
      );
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError(
        404,
        "TAG_NOT_FOUND",
        "Tag not found or does not belong to user",
      );
    }

    const taskTag = await TaskTagRepository.findByTaskIdAndTagId(taskId, tagId);

    if (taskTag) {
      throw new AppError(
        409,
        "TASK_TAG_ASSOCIATION_ALREADY_EXISTS",
        "Task tag association already exists",
      );
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
    projectId: string | undefined,
    taskId: string | undefined,
    tagId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError(409, "USER_ID_NOT_RECEIVED", "User id is required");
    }

    if (!projectId) {
      throw new AppError(
        409,
        "PROJECT_ID_NOT_RECEIVED",
        "Project id is required",
      );
    }

    if (!taskId) {
      throw new AppError(409, "TASK_ID_NOT_RECEIVED", "Task id is required");
    }

    if (!tagId) {
      throw new AppError(409, "TAG_ID_NOT_RECEIVED", "Tag id is required");
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
      throw new AppError(
        404,
        "TASK_NOT_FOUND",
        "Task not found or does not belong to user",
      );
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError(
        404,
        "TAG_NOT_FOUND",
        "Tag not found or does not belong to user",
      );
    }

    const taskTag = await TaskTagRepository.findByTaskIdAndTagId(taskId, tagId);

    if (!taskTag) {
      throw new AppError(
        404,
        "TASK_TAG_NOT_FOUND",
        "Task tag association not found",
      );
    }

    await TaskTagRepository.delete(taskId, tagId);
  },
};
