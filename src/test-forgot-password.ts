import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendForgotPasswordEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT), 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false, // para puerto 2525
    });

    const testEmail = "usuario@ejemplo.com"; // Mailtrap atrapará cualquier correo

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: "Recuperación de contraseña - StreamFlix",
      html: `
        <h2>Hola!</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="#">Restablecer contraseña</a>
      `,
    });

    console.log("Correo de prueba enviado. ID:", info.messageId);
    console.log("Revisa tu inbox en Mailtrap Sandbox para verlo.");
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}

sendForgotPasswordEmail();