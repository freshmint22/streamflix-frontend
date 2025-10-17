import { Request, Response } from "express";
import User from "../models/Users";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Crear token temporal
  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const message = `<p>Click <a href="${resetUrl}">aquí</a> para restablecer tu contraseña</p>`;

  await sendEmail(user.email, "Password Reset", message);

  res.status(200).json({ message: "Reset email sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password; // se hashea automáticamente por el pre-save
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};