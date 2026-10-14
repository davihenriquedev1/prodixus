import { TagService } from "@/services/tag.service.js";
import { TaskService } from "@/services/task.service.js";
import {
  createTagSchema,
  updateTagSchema,
} from "@/validators/tag.validator.js";
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
    const tagId = req.params.tagId as string;
    const result = await TagService.getTag(req.userId, tagId);
    return res.status(200).json(result);
  },
  async update(req: Request, res: Response) {
    const tagId = req.params.tagId as string;
    const data = updateTagSchema.parse(req.body);
    const result = await TagService.updateTag(req.userId, tagId, data);
    return res.status(200).json(result);
  },
  async delete(req: Request, res: Response) {
    const tagId = req.params.tagId as string;
    await TagService.deleteTag(req.userId, tagId);
    return res.sendStatus(204);
  },
  async getTasks(req: Request, res: Response) {
    const tagId = req.params.tagId as string;
    const tasks = await TaskService.getTasksByTagId(req.userId, tagId);
    return res.status(200).json(tasks);
  },
};
