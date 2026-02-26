import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => { 
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); 
console.log(`\n Connected to MongoDB successfully  DB_HOST: ${mongoose.connection.host} DB_PORT: ${mongoose.connection.port} DB_NAME: ${mongoose.connection.name} \n`);     
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
        
    }
}

export default connectDB;