import exprees from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = exprees();
const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = Array.from(
    new Set([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        ...configuredOrigins
    ])
);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));
app.use(exprees.json({limit: "16kb"}));
app.use(exprees.urlencoded({extended: true, limit: "16kb"}));
app.use(exprees.static("public"));
app.use(cookieParser());




// Importing routes
import userRouter from "./routers/user.router.js";
import familyRouter from "./routers/family.router.js";
import documentRouter from "./routers/document.router.js";


// Using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/families", familyRouter);
app.use("/api/v1/documents", documentRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error"
    });
});


export default app;
