import mongoose from "mongoose";

const connectDB= async() => {
    try{
        //"mongodb://localhost:27017/threadDB"  
      const MONGO_URI = process.env.MONGO_URI
      const connect = await mongoose.connect(MONGO_URI)
      console.log(`MongoDB Connected: ${connect.connection.host}`);
      
    }catch(error) {
      console.error(`Error: ${error.message}`);
      process.exit(1)
      
    }
}

export default connectDB