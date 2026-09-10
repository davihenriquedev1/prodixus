import { TagController } from "@/controllers/tag.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, (req, res) => TagController.create(req, res));

export default router;
