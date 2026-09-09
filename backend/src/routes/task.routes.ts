import { TaskController } from "@/controllers/task.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, (req, res) => TaskController.create(req, res));

export default router;
