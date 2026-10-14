import { TagController } from "@/controllers/tag.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, (req, res) => TagController.create(req, res));
router.get("/", authMiddleware, (req, res) => TagController.getTags(req, res));
router.get("/:tagId", authMiddleware, (req, res) =>
  TagController.getTag(req, res),
);
router.patch("/:tagId", authMiddleware, (req, res) =>
  TagController.update(req, res),
);
router.delete("/:tagId", authMiddleware, (req, res) =>
  TagController.delete(req, res),
);
router.get("/:tagId/tasks", authMiddleware, (req, res) =>
  TagController.getTasks(req, res),
);
export default router;
