import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_AATT);
    console.log("MongoDB connected successfully");
  }catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
