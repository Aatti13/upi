import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import CustomLogger from './logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const logger = new CustomLogger().formatLogger;


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
  console.log(`Listening on: http://localhost:${PORT}`);
})
