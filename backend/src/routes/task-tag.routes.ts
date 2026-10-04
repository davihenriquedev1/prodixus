import { TaskTagController } from "@/controllers/task-tag.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/:tagId", authMiddleware, (req, res) =>
  TaskTagController.associateTag(req, res),
);

router.delete("/:tagId", authMiddleware, (req, res) =>
  TaskTagController.removeTag(req, res),
);

export default router;
