import { FolderController } from "@/controllers/folder.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, (req, res) =>
  FolderController.create(req, res),
);
router.get("/", authMiddleware, (req, res) =>
  FolderController.getFolders(req, res),
);
router.get("/:folderId", authMiddleware, (req, res) =>
  FolderController.getFolder(req, res),
);

export default router;
