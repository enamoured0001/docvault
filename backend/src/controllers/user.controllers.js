import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {User} from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiresponse.js";
 import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Enter a valid email address");
    }
};

const validateUsername = (username) => {
    if (!usernameRegex.test(username)) {
        throw new ApiError(400, "Username must be 3-20 characters and only use letters, numbers, or underscore");
    }
};

const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
        throw new ApiError(400, "Password must be at least 6 characters and include at least one letter and one number");
    }
};






// generate  access token and refresh token
const generatetokens = async(userid) => {
    console.log(userid);
    try {
        const user = await User.findById(userid);
        const  accesstoken = user.generateaccesstoken();
        const refreshtoken = user.generaterefreshtoken();
        user.refreshToken = refreshtoken;
        await user.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (error) {
        console.log("Error generating tokens:", error);
        throw new ApiError(500, "Failed to generate tokens");
    }
}

// Example controller function to get user profile
const registeruser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received data:", { username, email, password });

        // Validate input
        if(
            [username,email,password].some((field) =>!field || field?.trim() === "")
        )
        {
           
           throw new ApiError (400, "All fields are required and cannot be empty");

        }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    validateUsername(normalizedUsername);
    validateEmail(normalizedEmail);
    validatePassword(password);

    // Check if user already exists
    const existeduser = await User.findOne({$or: [{ email: normalizedEmail }, { username: normalizedUsername }]});
    if(existeduser){
        throw new ApiError(409, "User with this email or username already exists");
    }


    // upload avatar if provided
    const localavatarpath = req.files?.avatar[0]?.path;
    if(!localavatarpath){
        throw new ApiError(400, "Avatar is required");
    }


    const avatar = await uploadonCloudinary(localavatarpath);
    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar");
    }

    // Create new user
    const newuser = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        avatar: avatar.url
    });

    const createduser = await User.findById(newuser._id).select("-password -refreshToken");

    if(!createduser){
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(
        apiResponse(res, 201, "User registered successfully", createduser)
    );
});
  

const loginuser = asyncHandler(async (req, res) => {
    // Implement login logic here
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    validateEmail(normalizedEmail);
    validatePassword(password);
    const user = await User.findOne({ email: normalizedEmail });
    if(!user){
        throw new ApiError(404, "User not found");
    }

   const ispasswordcorrect = await user.comparepassword(password);
   if(!ispasswordcorrect){
    throw new ApiError(401, "Invalid password");
   }

    const { accesstoken, refreshtoken } = await generatetokens(user._id);
    const loggedinuser= await User.findById(user._id).select("-password -refreshToken");


  const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};


     return res.status(200)
     .cookie("accessToken", accesstoken, options)
     .cookie("refreshToken", refreshtoken, options)
     .json(
        apiResponse(res, 200, "User logged in successfully", {
            user: loggedinuser,
            accesstoken,
            refreshtoken
        })
     );
     
    
    
});


const logoutuser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); 
    if(!user){
        throw new ApiError(404, "User not found");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    const options = {
        httponly: true,
        secure: true,
    };
    res.clearCookie("accessToken", options); 
    res.clearCookie("refreshToken", options);
    return res.status(200).json(
        apiResponse(res, 200, "User logged out successfully")
    );
});

const updatedrefreshtoken= asyncHandler(async(req,res)=>{
    const token =  req.cookies?.refreshToken || req.body.refreshToken;
    if(!token){
        throw new ApiError(401, "refresh token is missing");
    }
     const decodedtoken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   
    

      const user = await User.findById(decodedtoken?.id).select("-password  ");
    if(!user){
        throw new ApiError(404, "User not found");
    }

    if( token != user.refreshToken){
        throw new ApiError(401, "refresh token is expired")
    }

     const options = {
        httponly: true,
        secure: true,};

         const { accesstoken, refreshtoken } = await generatetokens(user._id);

     return res.status(200)
     .cookie("accessToken", accesstoken, options)
     .cookie("refreshToken", refreshtoken, options)
     .json(
        apiResponse(res, 200, "User logged in successfully", {
            user: user,
            accesstoken,
            refreshtoken
        
}))
});


const getCurrentuser = asyncHandler(async(req,res)=>{
    
    return res.status(200).json(
       apiResponse(res, 200, "User profile retrieved successfully", req.user)
    );
});

const updateCurrentuser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { username, email } = req.body;

    if (username && username.trim()) {
        validateUsername(username.trim());
        const existingUsername = await User.findOne({
            username: username.trim().toLowerCase(),
            _id: { $ne: user._id }
        });

        if (existingUsername) {
            throw new ApiError(409, "Username already exists");
        }

        user.username = username.trim().toLowerCase();
    }

    if (email && email.trim()) {
        validateEmail(email.trim().toLowerCase());
        const existingEmail = await User.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: user._id }
        });

        if (existingEmail) {
            throw new ApiError(409, "Email already exists");
        }

        user.email = email.trim().toLowerCase();
    }

    const localavatarpath = req.files?.avatar?.[0]?.path;

    if (localavatarpath) {
        const avatar = await uploadonCloudinary(localavatarpath);
        user.avatar = avatar.url;
    }

    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        apiResponse(res, 200, "User updated successfully", updatedUser)
    );
});





export { registeruser, loginuser, logoutuser,updatedrefreshtoken,getCurrentuser, updateCurrentuser};
