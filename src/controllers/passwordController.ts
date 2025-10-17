import { Request, Response } from "express";
import User from "../models/Users";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

/**
 * Start password recovery flow.
 * POST /auth/forgot-password
 * Body: { email }
 *
 * Note: responds 200 even when the email is not found to avoid user enumeration.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return success to avoid revealing whether the email exists
  if (!user) {
    // Short delay to make timing similar
    setTimeout(() => {}, 200);
    return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent" });
  }

  // Create a token and send email
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const message = `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`;
  try { await sendEmail(user.email, "Password Reset", message); } catch(e){ console.error('Send email error', e) }

  return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent" });
};

/**
 * Complete password reset using a token previously emailed to the user.
 * POST /auth/reset-password
 * Body: { token, password }
 *
 * Responses:
 *  - 200: password reset successful
 *  - 400: invalid or expired token
 */
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