import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || "5000";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn("⚠️ No MONGO_URI set; starting API without DB connection");
    } else {
      try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Conectado a MongoDB Atlas");
      } catch (dbErr: any) {
        const msg = dbErr?.message || String(dbErr);
        console.error(`❌ Error conectando a MongoDB: ${msg}`);
        if (
          msg.includes("ENOTFOUND") ||
          msg.includes("getaddrinfo") ||
          msg.includes("ECONNREFUSED") ||
          msg.includes("EAI_AGAIN") ||
          dbErr?.code === "ECONNREFUSED" ||
          dbErr?.name === "MongoParseError" ||
          dbErr?.name === "MongoNetworkError"
        ) {
          console.warn(
            "⚠️ Error de red o DNS al conectar MongoDB. Continuando sin conexión a BD para desarrollo."
          );
        } else {
          throw dbErr;
        }
      }
    }
    const server = app.listen(Number(PORT), () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err && (err as any).message ? (err as any).message : err);
      process.exit(1);
    });
  } catch (err: any) {
    console.error("❌ Error al iniciar el servidor:", err?.message || err);
    process.exit(1);
  }
}

start();