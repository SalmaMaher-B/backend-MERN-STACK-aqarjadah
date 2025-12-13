// // import express from "express";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import connectDB from "./config/db.js";
// // import authRoute from "./routes/authRoute.js";
// // import adRoute from "./routes/adRoute.js";


// // dotenv.config();

// // const app = express();

// // app.use(cors());
// // app.use(express.json({ limit: "10mb" }));

// // // Connect to MongoDB (مناسب لـ Vercel)
// // connectDB()
// //   .then(() => console.log("MongoDB Connected"))
// //   .catch(err => console.error(err));

// // // Test route
// // app.get("/", (req, res) => {
// //   res.send("API is running on Vercel ");
// // });

// // // Routes
// // app.use("/api/auth", authRoute);
// // app.use("/api/ads", adRoute);


// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => console.log(Server running on port ${PORT}));


// // export default app;

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import authRoute from "./routes/authRoute.js";
// import adRoute from "./routes/adRoute.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "10mb" }));

// // Connect to MongoDB
// connectDB().catch(err => console.error("DB Connection Error:", err));

// app.get("/", (req, res) => {
//   res.send("API is running on Vercel");
// });

// app.use("/api/auth", authRoute);
// app.use("/api/ads", adRoute);

// export default app;


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import licenseRoutes from "../routes/license.js";

dotenv.config();

const app = express();

// ✅ CORS مظبوط للـ production والـ development
app.use(
  cors({
    origin: [
      "https://ebalady-momra-gov-sa-commercial-fac.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS لكل الـ routes (مهم جدًا على Vercel)
app.options("*", cors());

app.use(express.json());

// ✅ MongoDB Connection محسنة لـ Serverless (تجنب connections كتير)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ✅ Fake admin login
const adminUser = { email: "admin@balady.com", password: "607080" };

app.post("/api/login", async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    if (email === adminUser.email && password === adminUser.password) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ token, email });
    }

    return res.status(401).json({ message: "Invalid Credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Homepage
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.send("أهلاً بك في Backend Balady! السيرفر شغال 🚀");
  } catch (error) {
    res.status(500).send("Database connection failed");
  }
});

// ✅ License routes (مع connect لكل request)
app.use("/api/licenses", async (req, res, next) => {
  try {
    await connectToDatabase();
    licenseRoutes(req, res, next);
  } catch (error) {
    console.error("DB connection error in licenses:", error);
    res.status(500).json({ message: "Database Error" });
  }
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ❌ لا app.listen أبدًا على Vercel
export default app;

