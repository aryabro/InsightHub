import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/teams.js";
import documentRoutes from "./routes/documents.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/insighthub";

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like iframes, mobile apps, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    // Allow iframe embedding
    optionsSuccessStatus: 200
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "InsightHub API running" });
});

// Mongo connection & server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


