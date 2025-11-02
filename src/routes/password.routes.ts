import express from "express";
import { forgotPassword, resetPassword } from "../controllers/passwordController";

const router = express.Router();

// POST /password/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /password/reset-password/:token
router.post("/reset-password/:token", (req, res) => {
  // Pasamos el token de params al body para que el controlador lo reciba igual
  req.body.token = req.params.token;
  return resetPassword(req, res);
});

export default router;