import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import passwordRoutes from "./routes/passwordRoutes";
import testRoutes from "./routes/test.routes";

const PORT = process.env.PORT || "5000";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn("⚠️ No MONGO_URI set; starting API without DB connection");
    } else {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Conectado a MongoDB Atlas");
    }

    // 👇 Rutas antes del listen
    app.use("/auth", passwordRoutes);
    app.use("/test", testRoutes); // 👈 para probar el envío de correos

    app.listen(Number(PORT), () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err: any) {
    console.error("❌ Error al iniciar el servidor:", err?.message || err);
    process.exit(1);
  }
}

start();