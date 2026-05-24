import mongoose from "mongoose";

const connectDb = async () => {
    const uri = process.env.MONGODB_URI; 
    
    if (!uri) {
        console.error("❌ Error: MONGODB_URI is not defined in .env file.");
        process.exit(1); // Stop the server if DB is missing
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ SakshatAI Database Connected");
    } catch (error) {
        console.error(`❌ Database Connection Failed: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;