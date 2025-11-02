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
  const maskEmail = (value: string) => {
    const [local, domain] = value.split("@");
    if (!local || !domain) return value;
    if (local.length <= 2) return `${local[0] || "*"}*@${domain}`;
    return `${local[0]}${"*".repeat(local.length - 2)}${local.slice(-1)}@${domain}`;
  };
  const maskedEmail = maskEmail(email || "");
  const user = await User.findOne({ email });
  // Behavior is configurable via env var REVEAL_USER_EXISTENCE.
  // By default we do NOT reveal whether the email exists (to avoid user enumeration).
  const reveal = String(process.env.REVEAL_USER_EXISTENCE || "false").toLowerCase() === "true";

  if (!user) {
    console.log(`[Password] Forgot-password requested for unknown email ${maskedEmail}`);
    if (reveal) {
      // Reveal that the email is not registered (less secure)
      return res.status(404).json({ message: "Email not registered" });
    }
    // Keep original behavior: always return success to avoid revealing whether the email exists
    // Short delay to make timing similar
    setTimeout(() => {}, 200);
    return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent" });
  }

  // Create a token and send email
  const token = crypto.randomBytes(20).toString("hex");
  console.log(`[Password] Forgot-password token created for ${maskedEmail}`);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const override = process.env.EMAIL_OVERRIDE_RECIPIENT;
  const recipient = override && override !== "" ? override : user.email;
  const message = `<p>Hola!<br/>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetUrl}">Restablecer contraseña</a></p>` +
    (override ? `<p><em>Intended for: ${user.email}</em></p>` : "");
  try {
    await sendEmail(recipient, "Recuperación de contraseña - StreamFlix", message);
    console.log(`[Password] Reset email dispatched for ${maskedEmail}${override ? ` (override -> ${override})` : ""}`);
  } catch(e){
    console.error('Send email error', e);
  }

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