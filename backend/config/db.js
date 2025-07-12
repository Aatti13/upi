import mongoose from 'mongoose';


export class Database {
  constructor() {
    this.connection = null;
  }

  async connectDB() {
    try{
      this.connection = await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to DB');
    }catch(error) {
      throw new Error(error.message);
    }
  }

  async disconnect() {
    if(!this.connection) {
      await mongoose.disconnect();
      console.log("DB disconnected");
    }
  }
  
}


