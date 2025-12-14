// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI); // بدون أي options إضافية
//     await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("DB connection error:", error.message);
//     process.exit(1); // يوقف السيرفر لو الاتصال فشل
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
