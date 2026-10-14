import { UserSettingsService } from "@/services/user-settings.service.js";
import { updateUserSettingsSchema } from "@/validators/user-settings.validator.js";
import type { Request, Response } from "express";

export const UserSettingsController = {
  async get(req: Request, res: Response) {
    const result = await UserSettingsService.get(req.userId);
    return res.status(200).json(result);
  },

  async update(req: Request, res: Response) {
    const data = updateUserSettingsSchema.parse(req.body);
    const result = await UserSettingsService.update(req.userId, data);

    return res.status(200).json(result);
  },
};
