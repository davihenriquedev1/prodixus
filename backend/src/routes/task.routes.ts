import { TaskController } from "@/controllers/task.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, (req, res) => TaskController.create(req, res));
router.get("/", authMiddleware, (req, res) =>
  TaskController.getTasks(req, res),
);
router.get("/:taskId", authMiddleware, (req, res) =>
  TaskController.getTask(req, res),
);

export default router;
