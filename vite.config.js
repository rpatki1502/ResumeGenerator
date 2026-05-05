import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();
const DEFAULT_ANTHROPIC_MODEL = "claude-3-5-haiku-20241022";

export default defineConfig({
  plugins: [
    {
      name: "anthropic-local-proxy",
      configureServer(server) {
        server.middlewares.use("/api/health", (_req, res) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        });

        server.middlewares.use("/api/anthropic/messages", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }

          const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              error: "Server is missing ANTHROPIC_API_KEY. Add it to .env and restart."
            }));
            return;
          }

          try {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", async () => {
              let payload;
              try {
                payload = JSON.parse(body || "{}");
              } catch {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid JSON body" }));
                return;
              }

              const model = (process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL).trim();
              payload.model = model;

              const upstream = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  "x-api-key": apiKey,
                  "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify(payload)
              });

              const raw = await upstream.text();
              res.statusCode = upstream.status;
              res.setHeader("Content-Type", "application/json");
              res.end(raw);
            });
          } catch (err) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              error: "Proxy request failed",
              details: err?.message || "unknown error"
            }));
          }
        });
      }
    }
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true
  }
});
