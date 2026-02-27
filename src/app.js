import exprees from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = exprees();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use(exprees.json({limit: "16kb"}));
app.use(exprees.urlencoded({extended: true, limit: "16kb"}));
app.use(exprees.static("public"));
app.use(cookieParser());




// Importing routes
import userRouter from "./routers/user.router.js";


// Using routes
app.use("/api/v1/users", userRouter);


 export default app;