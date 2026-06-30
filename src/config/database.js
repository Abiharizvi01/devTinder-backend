
//mongodb+srv://abiharizvi01_db_user:mPv3yWKYEQQyGO2f@cluster0.ihiwtdn.mongodb.net/?appName=Cluster0
import mongoose from "mongoose";

const DB_CONNECTION_STRING = "mongodb+srv://abiharizvi01_db_user:lPfQr0f0vRKBCFgr@cluster0.ihiwtdn.mongodb.net/devTinder?appName=Cluster0";

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