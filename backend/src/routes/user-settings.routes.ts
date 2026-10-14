import { UserSettingsController } from "@/controllers/user-settings.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/", authMiddleware, (req, res) =>
  UserSettingsController.get(req, res),
);

router.patch("/", authMiddleware, (req, res) =>
  UserSettingsController.update(req, res),
);

export default router;
