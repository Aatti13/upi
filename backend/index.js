// Pre-defined Libraries
// File: backend/index.js
// This file is the entry point of the backend application.
// It sets up the Express server, connects to the database, and defines routes.
// It also loads environment variables from a .env file.
import express from 'express';
import dotenv from 'dotenv';

// Database Connection Import
import { connectDB } from './config/db.js';

// Route Middleware Import
import authRoutes from './routes/auth.routes.js';
import accountRoutes from './routes/account.routes.js';

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User-defined Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

// Driver Code
app.listen(PORT, ()=>{
  connectDB();
  console.log(`Listening at: http://localhost:${PORT}`);
})
