import { FolderService } from "@/services/folder.service.js";
import {
  createFolderSchema,
  updateFolderSchema,
} from "@/validators/folder.validator.js";
import type { Request, Response } from "express";

export const FolderController = {
  async create(req: Request, res: Response) {
    const data = createFolderSchema.parse(req.body);
    const result = await FolderService.createFolder(req.userId, data);
    return res.status(201).json(result);
  },
  async getFolder(req: Request, res: Response) {
    const folderId = req.params.folderId as string;
    const result = await FolderService.getFolder(req.userId, folderId);
    return res.status(200).json(result);
  },
  async getFolders(req: Request, res: Response) {
    const result = await FolderService.getFolders(req.userId);
    return res.status(200).json(result);
  },
  async update(req: Request, res: Response) {
    const data = updateFolderSchema.parse(req.body);
    const folderId = req.params.folderId as string;
    const result = await FolderService.updateFolder(req.userId, folderId, data);
    return res.status(200).json(result);
  },
  async delete(req: Request, res: Response) {
    const folderId = req.params.folderId as string;
    await FolderService.deleteFolder(req.userId, folderId);
    return res.sendStatus(204);
  },
};
