import { ProjectService } from "@/services/project.service.js";
import { createProjectSchema } from "@/validators/project.validator.js";
import type { Request, Response } from "express";

export const ProjectController = {
  async create(req: Request, res: Response) {
    const data = createProjectSchema.parse(req.body);
    const result = await ProjectService.createProject(req.userId, data);
    return res.status(201).json(result);
  },
};
