 import asyncHandler from "../utils/asynchandler.js";
 import jwt from "jsonwebtoken";
 import {User} from "../models/user.model.js";
 import ApiError from "../utils/apierror.js";


 
 
 const jwtverify = asyncHandler(async (req, res, next) => {
    try {

    const token= req.cookies?.accessToken || req.authorization?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401, "Access token is missing");
    }
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?.id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
        
    } catch (error) {
        console.error("JWT verification error:", error);
        throw new ApiError(401, "Invalid access token");
    }
 });

    export default jwtverify;