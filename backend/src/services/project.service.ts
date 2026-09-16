import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type {
  createProjectSchema,
  updateProjectSchema,
} from "@/validators/project.validator.js";
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    if (data.folderId !== undefined) {
      const folder = await FolderRepository.findFirstByUserId(
        data.folderId,
        userId,
      );
      if (!folder) {
        throw new AppError("FOLDER_NOT_FOUND");
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    return ProjectRepository.findManyByUserId(userId);
  },
  async getProject(userId: string | undefined, projectId: string | undefined) {
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

    return project;
  },
  async updateProject(
    userId: string | undefined,
    projectId: string | undefined,
    data: z.infer<typeof updateProjectSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    if (data.folderId !== undefined) {
      const folder = await FolderRepository.findFirstByUserId(
        data.folderId,
        userId,
      );
      if (!folder) {
        throw new AppError("FOLDER_NOT_FOUND");
      }
    }

    const projectData: Prisma.ProjectUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),

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

      ...(data.folderId !== undefined && {
        folder: {
          connect: {
            id: data.folderId,
          },
        },
      }),
    };

    const project = await ProjectRepository.update(
      userId,
      projectId,
      projectData,
    );

    if (project == null) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    return project;
  },
  async deleteProject(
    userId: string | undefined,
    projectId: string | undefined,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }
    if (!projectId) {
      throw new AppError("PROJECT_ID_NOT_RECEIVED");
    }

    const project = await ProjectRepository.delete(userId, projectId);

    if (project == null) {
      throw new AppError("PROJECT_NOT_FOUND");
    }

    return project;
  },
};
