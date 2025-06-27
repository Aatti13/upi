import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()=>{
  connectDB();
  console.log(`Listening at: http://localhost:${PORT}`);
})
