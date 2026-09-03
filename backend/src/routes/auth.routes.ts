import { AuthController } from "@/controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));
router.post("/logout", (req, res) => AuthController.logout(req, res));
router.post("/refresh", (req, res) => AuthController.refreshToken(req, res));

export default router;
