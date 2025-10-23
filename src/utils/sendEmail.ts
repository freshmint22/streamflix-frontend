import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * sendEmail helper — small wrapper around nodemailer.
 *
 * @param to recipient email address
 * @param subject email subject
 * @param html HTML body of the email
 * @returns nodemailer sendMail result
 * @throws If sending fails the error is re-thrown
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
      const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true only if using port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StreamFlix" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};