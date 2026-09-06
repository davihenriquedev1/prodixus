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
      notes: data.notes,
      completed: data.completed,
      archived: data.archived,
      estimatedDuration: data.estimatedDuration,
      dueAt: data.dueAt,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      errorColor: data.errorColor,
      user: {
        connect: {
          id: userId,
        },
      },
      ...(data.folderId && {
        folder: {
          connect: {
            id: data.folderId,
          },
        },
      }),
    };

    return ProjectRepository.create(projectData);
  },
};
