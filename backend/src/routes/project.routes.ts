import { ProjectController } from "@/controllers/project.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, (req, res) =>
  ProjectController.create(req, res),
);
router.get("/", authMiddleware, (req, res) =>
  ProjectController.getProjects(req, res),
);
router.get("/:id", authMiddleware, (req, res) =>
  ProjectController.getProject(req, res),
);
router.patch("/:id", authMiddleware, (req, res) =>
  ProjectController.update(req, res),
);

export default router;
