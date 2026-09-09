import { TaskService } from "@/services/task.service.js";
import { createTaskSchema } from "@/validators/task.validator.js";
import type { Request, Response } from "express";

export const TaskController = {
  async create(req: Request, res: Response) {
    const data = createTaskSchema.parse(req.body);
    const projectId = req.params.projectId as string;
    const result = await TaskService.createTask(req.userId, projectId, data);
    return res.status(201).json(result);
  },
  async getTasks(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const result = await TaskService.getTasks(req.userId, projectId);
    return res.status(200).json(result);
  },

  async getTask(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const result = await TaskService.getTask(req.userId, projectId, taskId);
    return res.status(200).json(result);
  },
};
