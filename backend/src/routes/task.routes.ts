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
router.patch("/:taskId", authMiddleware, (req, res) =>
  TaskController.update(req, res),
);
router.delete("/:taskId", authMiddleware, (req, res) =>
  TaskController.delete(req, res),
);

// Task - Tag
router.post("/:taskId/tags/:tagId", authMiddleware, (req, res) =>
  TaskController.associateTag(req, res),
);
router.delete("/:taskId/tags/:tagId", authMiddleware, (req, res) =>
  TaskController.removeTag(req, res),
);

export default router;
