import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

connectDB()
.then(
    () => {
        app.on("error", (error) => {
            console.error("Error starting the server:", error);
            process.exit(1); // Exit the process with an error code
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    }
)
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
});