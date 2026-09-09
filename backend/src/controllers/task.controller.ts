import { TaskService } from "@/services/task.service.js";
import { createTaskSchema } from "@/validators/task.validator.js";
import type { Request, Response } from "express";

export const TaskController = {
  async create(req: Request, res: Response) {
    const data = createTaskSchema.parse(req.body);
    const result = await TaskService.createTask(req.userId, data);
    return res.status(201).json(result);
  },
};
