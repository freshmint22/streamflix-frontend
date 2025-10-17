import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import passwordRoutes from "./routes/passwordRoutes";

const PORT = process.env.PORT || "5000";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

/**
 * Start the HTTP server and connect to MongoDB when available.
 *
 * Environment variables used:
 * - PORT: the port to listen on (default: 5000)
 * - MONGO_URI or MONGODB_URI: MongoDB connection string (optional for dev)
 */
async function start() {
  try {
    if (!MONGO_URI) {
      console.warn("⚠️ No MONGO_URI set; starting API without DB connection");
    } else {
      try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Conectado a MongoDB Atlas");
      } catch (dbErr: any) {
        // Don't crash the whole process for common DNS/connection issues during development.
        const msg = dbErr?.message || String(dbErr);
        console.error(`❌ Error conectando a MongoDB: ${msg}`);
        // Consider several common network/DNS errors as non-fatal in development so the API can run
        if (
          msg.includes('ENOTFOUND') ||
          msg.includes('getaddrinfo') ||
          msg.includes('ECONNREFUSED') ||
          msg.includes('EAI_AGAIN') ||
          dbErr?.code === 'ECONNREFUSED' ||
          dbErr?.name === 'MongoParseError' ||
          dbErr?.name === 'MongoNetworkError'
        ) {
          console.warn('⚠️ Error de red o DNS al conectar MongoDB. Continuando sin conexión a BD para desarrollo.');
        } else {
          // For other errors, rethrow to preserve the previous behavior.
          throw dbErr;
        }
      }
    }

  // 👇 Rutas antes del listen
  // passwordRoutes contiene endpoints para recuperación de contraseña
  // montamos en /password para no chocar con /auth que ya se monta en `app.ts`
  app.use("/password", passwordRoutes);

    app.listen(Number(PORT), () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("❌ Error al iniciar el servidor:", err?.message || err);
    // Keep exit behavior for unexpected critical errors
    process.exit(1);
  }
}

start();