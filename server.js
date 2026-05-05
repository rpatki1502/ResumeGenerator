import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

function getAnthropicApiKey() {
  return (process.env.ANTHROPIC_API_KEY || "").trim();
}

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/anthropic/messages", async (req, res) => {
  const anthropicApiKey = getAnthropicApiKey();
  if (!anthropicApiKey) {
    res.status(500).json({
      error: "Server is missing ANTHROPIC_API_KEY. Add it to .env and restart."
    });
    return;
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify(req.body)
    });

    const raw = await upstream.text();
    res.status(upstream.status).type("application/json").send(raw);
  } catch (err) {
    res.status(502).json({
      error: "Proxy request failed",
      details: err?.message || "unknown error"
    });
  }
});

const server = app.listen(PORT, "127.0.0.1", () => {
  const hasKey = getAnthropicApiKey().length > 0;
  console.log(`Proxy listening on http://127.0.0.1:${PORT}`);
  console.log(`ANTHROPIC_API_KEY loaded: ${hasKey ? "yes" : "no"}`);
});

server.on("close", () => {
  console.log("Proxy server closed");
});
