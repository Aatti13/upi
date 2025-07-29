import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import CustomLogger from './logger.js';

import Database from './config/database/db.connect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const logger = new CustomLogger().formatLogger;
const database = new Database();

// Pre-defined middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
);

app.listen(PORT, ()=>{
  database.connect();
  console.log(`Listening on: http://localhost:${PORT}`);
})
