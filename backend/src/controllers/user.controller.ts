import { UserService } from "@/services/user.service.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/validators/user.validator.js";
import type { Request, Response } from "express";

export const UserController = {
  async me(req: Request, res: Response) {
    const result = await UserService.me(req.userId);
    return res.status(200).json(result);
  },
  async updateProfile(req: Request, res: Response) {
    const data = updateProfileSchema.parse(req.body);
    const result = await UserService.updateProfile(req.userId, data);
    return res.status(200).json(result);
  },
  async changePassword(req: Request, res: Response) {
    const data = changePasswordSchema.parse(req.body);
    await UserService.changePassword(req.userId, data);
    return res.sendStatus(204);
  },
};
