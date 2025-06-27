// Imports
import mongoose from "mongoose";

// Function to connect to MongoDB
// This function connects to the MongoDB database using the URI stored in the environment variable MONGO_URI(AATT/NAV/SAM)
// If the connection is successful, it logs a success message; if it fails, it logs the error and exits the process.
// It is typically called when the server starts to ensure the database connection is established before handling requests.
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_AATT);
    console.log("MongoDB connected successfully");
  }catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
