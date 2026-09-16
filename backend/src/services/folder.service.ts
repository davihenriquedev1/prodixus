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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    if (data.parentId !== undefined) {
      const folder = await FolderRepository.findFirstByUserId(
        data.parentId,
        userId,
      );

      if (!folder) {
        throw new AppError("FOLDER_NOT_FOUND");
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    return FolderRepository.findManyByUserId(userId);
  },
  async getFolder(userId: string | undefined, folderId: string | undefined) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!folderId) {
      throw new AppError("FOLDER_ID_NOT_RECEIVED");
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError("FOLDER_NOT_FOUND");
    }

    return folder;
  },
  async updateFolder(
    userId: string | undefined,
    folderId: string | undefined,
    data: z.infer<typeof updateFolderSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    if (!folderId) {
      throw new AppError("FOLDER_ID_NOT_RECEIVED");
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError("FOLDER_NOT_FOUND");
    }

    if (data.parentId !== undefined) {
      if (data.parentId === folderId) {
        throw new AppError("FOLDER_CYCLE");
      }

      const parentFolder = await FolderRepository.findFirstByUserId(
        data.parentId,
        userId,
      );

      if (!parentFolder) {
        throw new AppError("FOLDER_NOT_FOUND");
      }

      let currentParent: Folder | null = parentFolder;

      while (currentParent) {
        if (currentParent.id === folderId) {
          throw new AppError("FOLDER_CYCLE");
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
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    if (!folderId) {
      throw new AppError("FOLDER_ID_NOT_RECEIVED");
    }

    const folder = await FolderRepository.findFirstByUserId(folderId, userId);

    if (!folder) {
      throw new AppError("FOLDER_NOT_FOUND");
    }

    await FolderRepository.delete(folderId);
  },
};
