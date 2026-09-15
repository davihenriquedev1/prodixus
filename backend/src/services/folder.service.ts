import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type {
  createFolderSchema,
  updateFolderSchema,
} from "@/validators/folder.validator.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { FolderRepository } from "@/repositories/folder.repository.js";
import type { Folder, Prisma } from "../../generated/prisma/client.js";

export const FolderService = {
  async createFolder(
    userId: string | undefined,
    data: z.infer<typeof createFolderSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_NOT_RECEIVED", "User id is required");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (data.parentId !== undefined) {
      const folder = await FolderRepository.findFirstByUserId(
        data.parentId,
        userId,
      );

      if (!folder) {
        throw new AppError(
          404,
          "FOLDER_NOT_FOUND",
          "Folder not found or does not belong to the user",
        );
      }
    }

    const folderData: Prisma.FolderCreateInput = {
      name: data.name,

      user: {
        connect: {
          id: userId,
        },
      },

      ...(data.parentId !== undefined && {
        parent: {
          connect: {
            id: data.parentId,
          },
        },
      }),
    };

    return FolderRepository.create(folderData);
  },
  async getFolders(userId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "USER_ID_NOT_RECEIVED", "User id is required");
    }

    return FolderRepository.findManyByUserId(userId);
  },
  async getFolder(userId: string | undefined, folderId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "USER_ID_NOT_RECEIVED", "User id is required");
    }

    if (!folderId) {
      throw new AppError(
        409,
        "FOLDER_ID_NOT_RECEIVED",
        "Folder id is required",
      );
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError(
        404,
        "FOLDER_NOT_FOUND",
        "Folder not found or does not belong to the user",
      );
    }

    return folder;
  },
  async updateFolder(
    userId: string | undefined,
    folderId: string | undefined,
    data: z.infer<typeof updateFolderSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_NOT_RECEIVED", "User id is required");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (!folderId) {
      throw new AppError(
        409,
        "FOLDER_ID_NOT_RECEIVED",
        "Folder id is required",
      );
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError(
        404,
        "FOLDER_NOT_FOUND",
        "Folder not found or does not belong to the user",
      );
    }

    if (data.parentId !== undefined) {
      if (data.parentId === folderId) {
        throw new AppError(
          409,
          "FOLDER_CYCLE",
          "Folder cannot be its own parent",
        );
      }

      const parentFolder = await FolderRepository.findFirstByUserId(
        data.parentId,
        userId,
      );

      if (!parentFolder) {
        throw new AppError(
          404,
          "FOLDER_NOT_FOUND",
          "Folder not found or does not belong to the user",
        );
      }

      let currentParent: Folder | null = parentFolder;

      while (currentParent) {
        if (currentParent.id === folderId) {
          throw new AppError(
            409,
            "FOLDER_CYCLE",
            "Folder cannot be moved into one of its subfolders",
          );
        }

        if (!currentParent.parentId) {
          break;
        }

        currentParent = await FolderRepository.findFirstByUserId(
          currentParent.parentId,
          userId,
        );
      }
    }

    const folderData: Prisma.FolderUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),

      ...(data.parentId !== undefined && {
        parent: {
          connect: {
            id: data.parentId,
          },
        },
      }),
    };

    return FolderRepository.update(folderId, folderData);
  },
  async deleteFolder(userId: string | undefined, folderId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "USER_ID_NOT_RECEIVED", "User id is required");
    }

    if (!folderId) {
      throw new AppError(
        409,
        "FOLDER_ID_NOT_RECEIVED",
        "Folder id is required",
      );
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError(
        404,
        "FOLDER_NOT_FOUND",
        "Folder not found or does not belong to the user",
      );
    }

    await FolderRepository.delete(folderId);
  },
};
