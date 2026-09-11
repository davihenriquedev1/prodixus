import { TagService } from "@/services/tag.service.js";
import { createTagSchema } from "@/validators/tag.validator.js";
import type { Request, Response } from "express";

export const TagController = {
  async create(req: Request, res: Response) {
    const data = createTagSchema.parse(req.body);
    const result = await TagService.createTag(req.userId, data);
    return res.status(201).json(result);
  },
  async getTags(req: Request, res: Response) {
    const result = await TagService.getTags(req.userId);
    return res.status(200).json(result);
  },
  async getTag(req: Request, res: Response) {
    const id = req.params.id as string;
    const result = await TagService.getTag(req.userId, id);
    return res.status(200).json(result);
  },
};
