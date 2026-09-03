import { AuthService } from "@/services/auth.service.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "@/validators/auth.validator.js";
import type { Request, Response } from "express";

export const AuthController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.registerUser(data);
    return res.status(201).json(result);
  },
  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.loginUser(data);
    return res.status(200).json(result);
  },
  async refreshToken(req: Request, res: Response) {
    const data = refreshTokenSchema.parse(req.body);
    const result = await AuthService.refreshToken(data);
    return res.status(200).json(result);
  },
  async logout(req: Request, res: Response) {
    const data = refreshTokenSchema.parse(req.body);
    await AuthService.logoutUser(data);
    return res.sendStatus(204);
  },
};
