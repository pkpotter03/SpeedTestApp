// backend/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors()); 
const PORT = 5000;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (for download tests)
app.use(express.static(path.join(__dirname, "public")));

// Ping endpoint (low latency)
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Upload endpoint (streaming, no disk write)
app.post("/upload", (req, res) => {
  let totalBytes = 0;

  req.on("data", (chunk) => {
    totalBytes += chunk.length;
  });

  req.on("end", () => {
    res.json({
      message: "Upload complete",
      size: totalBytes,
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
