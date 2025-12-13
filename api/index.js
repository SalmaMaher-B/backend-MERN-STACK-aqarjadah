import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adRoute from "./routes/adRoute.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Connect to MongoDB (مناسب لـ Vercel)
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running on Vercel ");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/ads", adRoute);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(Server running on port ${PORT}));


export default app;

