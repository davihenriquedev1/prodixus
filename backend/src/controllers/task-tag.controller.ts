import { TaskTagService } from "@/services/task-tag.service.js";
import type { Request, Response } from "express";

export const TaskTagController = {
  async associateTag(req: Request, res: Response) {
    const taskId = req.params.taskId as string;
    const tagId = req.params.tagId as string;
    const result = await TaskTagService.associateTag(req.userId, taskId, tagId);
    return res.status(201).json(result);
  },
  async removeTag(req: Request, res: Response) {
    const taskId = req.params.taskId as string;
    const tagId = req.params.tagId as string;
    await TaskTagService.removeTag(req.userId, taskId, tagId);
    return res.sendStatus(204);
  },
};
