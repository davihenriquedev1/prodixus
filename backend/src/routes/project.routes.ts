import { ProjectController } from "@/controllers/project.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, (req, res) =>
  ProjectController.create(req, res),
);

export default router;
