import asyncHandler from "../utils/asynchandler.js";

// Example controller function to get user profile
const registeruser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User registered successfully"
    });
});

export { registeruser };