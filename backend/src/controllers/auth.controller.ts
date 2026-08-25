import { AuthService } from "@/services/auth.service.js";
import { registerSchema } from "@/validators/auth.validator.js";
import type { Request } from "express";

export const AuthController = {
  async register(req: Request) {
    const { name, email, password } = req.body;
    const data = registerSchema.parse({ name, email, password });
    const response = await AuthService.registerUser(data);
    return response;
  },
};
