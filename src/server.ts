// server.ts
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import app from "./app"; // Tu app principal con rutas
import passwordRoutes from "./routes/password.routes";

const PORT = process.env.PORT || "5000";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/streamflix";

async function start() {
  try {
    // ✅ Inicializa Express
    const server = express();

    // Middleware
    server.use(express.json());
    server.use(cors());
    server.use(helmet());

    // Rate limiting
    const limiter = rateLimit({ windowMs: 1000 * 60, max: 300 });
    server.use(limiter);

    // Conexión a MongoDB
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Conectado a MongoDB");
    } catch (dbErr: any) {
      console.error(`❌ Error conectando a MongoDB: ${dbErr.message || dbErr}`);
      if (
        dbErr.message.includes("ENOTFOUND") ||
        dbErr.message.includes("getaddrinfo") ||
        dbErr.message.includes("ECONNREFUSED") ||
        dbErr.message.includes("EAI_AGAIN") ||
        dbErr.code === "ECONNREFUSED" ||
        dbErr.name === "MongoParseError" ||
        dbErr.name === "MongoNetworkError"
      ) {
        console.warn("⚠️ Error de red o DNS al conectar MongoDB. Continuando sin conexión a BD para desarrollo.");
      } else {
        throw dbErr;
      }
    }

    // Rutas
    server.use("/password", passwordRoutes); // endpoints de recuperación de contraseña
    server.use("/auth", app); // tus rutas de auth, login, register, etc.

    // Ruta de prueba
    server.get("/health", (_req, res) => res.json({ status: "ok", message: "Servidor funcionando correctamente" }));

    // Inicia servidor
    server.listen(Number(PORT), () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err: any) {
    console.error("❌ Error al iniciar el servidor:", err.message || err);
    process.exit(1);
  }
}

start();