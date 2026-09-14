import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type { createFolderSchema } from "@/validators/folder.validator.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { FolderRepository } from "@/repositories/folder.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const FolderService = {
  async createFolder(
    userId: string | undefined,
    data: z.infer<typeof createFolderSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "ID_NOT_RECEIVED", "User is required");
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (data.parentId !== undefined) {
      const folder = await FolderRepository.findById(data.parentId, userId);

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
};
