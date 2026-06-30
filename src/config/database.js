import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


const DB_CONNECTION_STRING = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log("Database connection established successfully! 🎉");
    } catch (error) {
        console.error("Database connection failed: ❌", error.message);
        process.exit(1);
    }
};

// ES Module export
export default connectDB;