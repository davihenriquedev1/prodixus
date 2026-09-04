import { UserController } from "@/controllers/user.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/me", authMiddleware, (req, res) => UserController.me(req, res));
router.patch("/me", authMiddleware, (req, res) =>
  UserController.updateProfile(req, res),
);
router.patch("/me/password", authMiddleware, (req, res) =>
  UserController.changePassword(req, res),
);

export default router;
