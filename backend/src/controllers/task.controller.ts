import { TaskService } from "@/services/task.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator.js";
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

  async update(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const data = updateTaskSchema.parse(req.body);
    const result = await TaskService.updateTask(
      req.userId,
      projectId,
      taskId,
      data,
    );
    return res.status(200).json(result);
  },
  async delete(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    await TaskService.deleteTask(req.userId, projectId, taskId);
    return res.sendStatus(204);
  },
  async associateTag(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const tagId = req.params.tagId as string;
    const result = await TaskService.associateTag(
      req.userId,
      projectId,
      taskId,
      tagId,
    );
    return res.status(201).json(result);
  },
  async removeTag(req: Request, res: Response) {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const tagId = req.params.tagId as string;
    await TaskService.removeTag(req.userId, projectId, taskId, tagId);
    return res.sendStatus(204);
  },
};
