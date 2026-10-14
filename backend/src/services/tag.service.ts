import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type {
  createTagSchema,
  updateTagSchema,
} from "@/validators/tag.validator.js";
import { TagRepository } from "@/repositories/tag.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TagService = {
  async createTag(
    userId: string | undefined,
    data: z.infer<typeof createTagSchema>,
  ) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    const tagExists = await TagRepository.findByUserIdAndName(
      userId,
      data.name,
    );

    if (tagExists) {
      throw new AppError("TAG_ALREADY_EXISTS");
    }

    const tagData: Prisma.TagCreateInput = {
      name: data.name,
      color: data.color,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return TagRepository.create(tagData);
  },
  async getTags(userId: string | undefined) {
    if (!userId) {
      throw new AppError("USER_ID_NOT_RECEIVED");
    }

    return TagRepository.findManyByUserId(userId);
  },
  async getTag(userId: string | undefined, tagId: string | undefined) {
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

    return tag;
  },
  async updateTag(
    userId: string | undefined,
    tagId: string | undefined,
    data: z.infer<typeof updateTagSchema>,
  ) {
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

    if (data.name === undefined && data.color === undefined) {
      throw new AppError("UPDATE_DATA_NOT_RECEIVED");
    }

    if (data.name) {
      const tagExists = await TagRepository.findByUserIdAndName(
        userId,
        data.name,
      );
      if (tagExists && tagExists.id !== tagId) {
        throw new AppError("TAG_ALREADY_EXISTS");
      }
    }

    const tagData: Prisma.TagUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.color !== undefined && { color: data.color }),
    };

    return TagRepository.update(tagData, tagId);
  },
  async deleteTag(userId: string | undefined, tagId: string | undefined) {
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

    return TagRepository.delete(tagId);
  },
};
