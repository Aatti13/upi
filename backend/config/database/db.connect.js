import mongoose from 'mongoose';

class Database {
  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to DB');
    }catch(error) {
      console.error(`Couldn't connect to MongoDB: ${error.message}`);
    }
  }
}

export default Database;