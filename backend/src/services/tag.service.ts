import { AppError } from "@/errors/app.error.js";
import { z } from "zod";
import type { createTagSchema } from "@/validators/tag.validator.js";
import { TagRepository } from "@/repositories/tag.repository.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const TagService = {
  async createTag(
    userId: string | undefined,
    data: z.infer<typeof createTagSchema>,
  ) {
    if (!userId) {
      throw new AppError(409, "USER_ID_REQUIRED", "User id not received");
    }

    const tagExists = await TagRepository.findByUserIdAndName(
      userId,
      data.name,
    );

    if (tagExists) {
      throw new AppError(
        409,
        "TAG_ALREADY_EXISTS",
        "Tag already exists with this name",
      );
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
      throw new AppError(409, "USER_ID_REQUIRED", "User id not received");
    }

    return TagRepository.findManyByUserId(userId);
  },
  async getTag(userId: string | undefined, tagId: string | undefined) {
    if (!userId) {
      throw new AppError(409, "USER_ID_REQUIRED", "User id not received");
    }

    if (!tagId) {
      throw new AppError(409, "TAG_ID_REQUIRED", "Tag id not received");
    }

    const tag = await TagRepository.findFirstByUserId(userId, tagId);

    if (!tag) {
      throw new AppError(
        404,
        "TAG_NOT_FOUND",
        "Tag not found or does not belong to user",
      );
    }

    return tag;
  },
};
