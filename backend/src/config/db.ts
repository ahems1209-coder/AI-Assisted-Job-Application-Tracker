import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Force load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    
    if (!url) {
      console.log("-----------------------------------");
      console.error("❌ ERROR: MONGO_URI is UNDEFINED.");
      console.log("Check if your .env file is inside the /backend folder!");
      console.log("-----------------------------------");
      return;
    }

    const conn = await mongoose.connect(url);
    
    console.log(`-----------------------------------`);
    console.log(`✅ DATABASE STATUS: CONNECTED`);
    console.log(`🌐 Provider: MongoDB Atlas Cloud`);
    console.log(`-----------------------------------`);
  } catch (error: any) {
    console.log(`-----------------------------------`);
    console.error(`❌ DATABASE STATUS: FAILED`);
    console.error(`Error Detail: ${error.message}`);
    console.log(`-----------------------------------`);
  }
};

export default connectDB;