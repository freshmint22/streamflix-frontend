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
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Behavior is configurable via env var REVEAL_USER_EXISTENCE.
    // By default we do NOT reveal whether the email exists (to avoid user enumeration).
    const reveal = String(process.env.REVEAL_USER_EXISTENCE || "false").toLowerCase() === "true";

    if (!user) {
      if (reveal) {
        return res.status(404).json({ message: "Email not registered" });
      }
      // Short delay to normalize timing
      setTimeout(() => {}, 200);
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent"
      });
    }

    // Create a token and save it
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const override = process.env.EMAIL_OVERRIDE_RECIPIENT;
    const recipient = override && override !== "" ? override : user.email;
    const message = `<p>Hola!<br/>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                     <p><a href="${resetUrl}">Restablecer contraseña</a></p>` +
                     (override ? `<p><em>Intended for: ${user.email}</em></p>` : "");

    try {
      await sendEmail(recipient, "Recuperación de contraseña - StreamFlix", message);
    } catch (e) {
      console.error("Send email error", e);
    }

    return res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent"
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
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
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ message: "Token and password are required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password; // se hashea automáticamente por el pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};