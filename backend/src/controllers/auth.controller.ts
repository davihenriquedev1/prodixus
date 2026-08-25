import { AuthService } from "@/services/auth.service.js";
import { registerSchema } from "@/validators/auth.validator.js";
import type { Request, Response } from "express";

export const AuthController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.registerUser(data);
    return res.status(201).json(result);
  },
};
