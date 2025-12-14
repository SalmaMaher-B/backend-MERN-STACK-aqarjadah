import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adRoute from "./routes/adRoute.js";

const app = express();

/* ================= CORS (مهم جداً) ================= */
app.use(cors({
  origin: "https://aqarjadah-salma-s-mern-stack.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ رد على preflight
app.options("*", cors());

/* =================================================== */

app.use(express.json({ limit: "10mb" }));

// DB
await connectDB();

// Test
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running on Vercel");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/ads", adRoute);

export default app;
