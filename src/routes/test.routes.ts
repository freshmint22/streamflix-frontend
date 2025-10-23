import express from "express";
import { sendEmail } from "../utils/sendEmail";

const router = express.Router();

router.post("/send-test-email", async (req, res) => {
  try {
    const { to } = req.body; // correo al que enviarás la prueba

    await sendEmail(
      to,
      "Correo de prueba desde StreamFlix",
      "<h2>¡Hola!</h2><p>Este es un correo de prueba enviado desde tu backend con Mailtrap.</p>"
    );

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar correo", error });
  }
});

export default router;
