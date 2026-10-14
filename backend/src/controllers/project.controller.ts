import { ProjectService } from "@/services/project.service.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/validators/project.validator.js";
import type { Request, Response } from "express";

export const ProjectController = {
  async create(req: Request, res: Response) {
    const data = createProjectSchema.parse(req.body);
    const result = await ProjectService.createProject(req.userId, data);
    return res.status(201).json(result);
  },
  async getProjects(req: Request, res: Response) {
    const result = await ProjectService.getProjects(req.userId);
    return res.status(200).json(result);
  },
  async getProject(req: Request, res: Response) {
    const projectId = req.params.id as string;
    const result = await ProjectService.getProject(req.userId, projectId);
    return res.status(200).json(result);
  },
  async update(req: Request, res: Response) {
    const data = updateProjectSchema.parse(req.body);
    const projectId = req.params.id as string;
    const result = await ProjectService.updateProject(
      req.userId,
      projectId,
      data,
    );
    return res.status(200).json(result);
  },
  async delete(req: Request, res: Response) {
    const projectId = req.params.id as string;
    await ProjectService.deleteProject(req.userId, projectId);
    return res.sendStatus(204);
  },
};
