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
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import adRoute from "./routes/adRoute.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Wrap DB connection in async function
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("API is running on Vercel");
});

app.use("/api/auth", authRoute);
app.use("/api/ads", adRoute);

export default app;


