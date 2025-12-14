import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adRoute from "./routes/adRoute.js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(cors({
  origin: "https://aqarjadah-salma-s-mern-stack.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// ✅ Connect MongoDB (Serverless Safe)
await connectDB();

// ✅ Test Route
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running on Vercel");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/ads", adRoute);

// ❌ ممنوع app.listen على Vercel
export default app;
