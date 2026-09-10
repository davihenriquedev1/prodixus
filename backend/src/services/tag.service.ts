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
};
