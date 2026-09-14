import { FolderService } from "@/services/folder.service.js";
import { createFolderSchema } from "@/validators/folder.validator.js";
import type { Request, Response } from "express";

export const FolderController = {
  async create(req: Request, res: Response) {
    const data = createFolderSchema.parse(req.body);
    const result = await FolderService.createFolder(req.userId, data);
    return res.status(201).json(result);
  },
};
