// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/your_database_name';
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
