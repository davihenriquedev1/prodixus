import { TagController } from "@/controllers/tag.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, (req, res) => TagController.create(req, res));
router.get("/", authMiddleware, (req, res) => TagController.getTags(req, res));
router.get("/:id", authMiddleware, (req, res) =>
  TagController.getTag(req, res),
);
router.patch("/:id", authMiddleware, (req, res) =>
  TagController.update(req, res),
);
router.delete("/:id", authMiddleware, (req, res) =>
  TagController.delete(req, res),
);

export default router;
