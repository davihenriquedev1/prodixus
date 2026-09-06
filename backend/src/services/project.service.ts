import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type { createProjectSchema } from "@/validators/project.validator.js";
import { ProjectRepository } from "@/repositories/project.repository.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { FolderRepository } from "@/repositories/folder.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const ProjectService = {
  async createProject(
    userId: string | undefined,
    data: z.infer<typeof createProjectSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (data.folderId !== undefined) {
      const folder = await FolderRepository.findById(data.folderId);

      if (!folder) {
        throw new AppError(404, "FOLDER_NOT_FOUND", "Folder not found");
      }

      if (folder.userId !== userId) {
        throw new AppError(
          403,
          "FORBIDDEN",
          "Folder does not belong to the user",
        );
      }
    }

    const projectData: Prisma.ProjectCreateInput = {
      name: data.name,

      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.archived !== undefined && { archived: data.archived }),
      ...(data.estimatedDuration !== undefined && {
        estimatedDuration: data.estimatedDuration,
      }),
      ...(data.dueAt !== undefined && { dueAt: data.dueAt }),
      ...(data.primaryColor !== undefined && {
        primaryColor: data.primaryColor,
      }),
      ...(data.accentColor !== undefined && {
        accentColor: data.accentColor,
      }),
      ...(data.errorColor !== undefined && {
        errorColor: data.errorColor,
      }),

      user: {
        connect: {
          id: userId,
        },
      },

      ...(data.folderId !== undefined && {
        folder: {
          connect: {
            id: data.folderId,
          },
        },
      }),
    };

    return ProjectRepository.create(projectData);
  },
  async getProjects(userId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "ID_REQUIRED", "User id not received");
    }

    return ProjectRepository.findManyByUserId(userId);
  },
  async getProject(userId: string | undefined, projectId: string | undefined) {
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
      throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    return project;
  },
};
