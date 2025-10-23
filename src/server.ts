import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import passwordRoutes from "./routes/password.routes";

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


    const server = app.listen(Number(PORT), '127.0.0.1', () => {
      try {
        const addr = server.address();
        console.log(`🚀 Server running on port ${PORT} address=127.0.0.1 details=${JSON.stringify(addr)}`);
      } catch (e) {
        console.log(`🚀 Server running on port ${PORT} address=127.0.0.1`);
      }

      // Log process id to help correlate with netstat / tasklist
      console.log(`PID=${process.pid}`);

      // Small self-test: try connecting to the local /health endpoint via IPv4
      try {
        // import here to avoid top-level require in TS environment
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const http = require('http');
        setTimeout(() => {
          const opts = { host: '127.0.0.1', port: Number(PORT), path: '/health', timeout: 2000 } as any;
          const req = http.get(opts, (res: any) => {
            console.log('[SELF-TEST] statusCode=', res.statusCode);
            res.resume();
          });
          req.on('error', (e: any) => {
            console.error('[SELF-TEST] error:', e && e.message ? e.message : e);
          });
          req.on('timeout', () => {
            console.error('[SELF-TEST] timeout connecting to local health');
            req.abort();
          });
        }, 200);
      } catch (e) {
        console.error('[SELF-TEST] failed to run internal test', e);
      }
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