import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./env.js";
import { connectDB } from "./lib/db.js";
import { authMiddleware } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js";
import kanjiRoutes from "./routes/kanji.js";
import studyRoutes from "./routes/study.js";
import progressRoutes from "./routes/progress.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/kanji", kanjiRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/progress", progressRoutes);

const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

async function start() {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();
