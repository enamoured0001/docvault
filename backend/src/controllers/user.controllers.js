import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {User} from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiresponse.js";
 import jwt from "jsonwebtoken";
import crypto from "crypto";
import { isSmtpConfigured, sendVerificationOtpEmail } from "../utils/email.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};

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

const buildVerificationResponse = (user) => ({
    user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified
    },
    emailVerificationRequired: !user.isEmailVerified
});

const sendEmailVerificationOtp = async (user) => {
    const otp = user.generateEmailVerificationOTP();
    await user.save({ validateBeforeSave: false });

    const otpDelivered = await sendVerificationOtpEmail({
        email: user.email,
        username: user.username,
        otp
    });

    if (!otpDelivered) {
        throw new ApiError(503, "Unable to send OTP email right now. Please configure the email service and try again.");
    }
};

const findUserByEmailOrThrow = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    validateEmail(normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const sanitizeUserForResponse = async (userId) => {
    return User.findById(userId).select("-password -refreshToken -emailVerificationOTP");
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

    if (!isSmtpConfigured()) {
        throw new ApiError(503, "Email service is not configured. Add Brevo API settings in backend/.env to send OTP emails.");
    }

    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    const existingUsernameUser = await User.findOne({ username: normalizedUsername });

    const usernameBelongsToDifferentUser =
        existingUsernameUser &&
        (!existingEmailUser || existingUsernameUser._id.toString() !== existingEmailUser._id.toString());

    if (existingEmailUser && existingEmailUser.isEmailVerified !== false) {
        throw new ApiError(409, "Email is already registered");
    }

    if (usernameBelongsToDifferentUser) {
        throw new ApiError(409, "Username is already registered");
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

    if (existingEmailUser && existingEmailUser.isEmailVerified === false) {
        existingEmailUser.username = normalizedUsername;
        existingEmailUser.password = password;
        existingEmailUser.avatar = avatar.url;

        await existingEmailUser.save();
        await sendEmailVerificationOtp(existingEmailUser);

        const updatedUnverifiedUser = await sanitizeUserForResponse(existingEmailUser._id);

        return res.status(200).json({
            success: true,
            message: "Your account already exists but email is not verified. We sent a fresh OTP to your email.",
            data: buildVerificationResponse(updatedUnverifiedUser)
        });
    }

    let newuser;

    try {
        newuser = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password,
            avatar: avatar.url
        });

        await sendEmailVerificationOtp(newuser);
    } catch (error) {
        if (newuser?._id) {
            await User.findByIdAndDelete(newuser._id);
        }

        throw error;
    }

    const createduser = await sanitizeUserForResponse(newuser._id);

    if(!createduser){
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email with the OTP we sent.",
        data: buildVerificationResponse(createduser)
    });
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

    if (user.isEmailVerified === false) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

   const ispasswordcorrect = await user.comparepassword(password);
   if(!ispasswordcorrect){
    throw new ApiError(401, "Invalid password");
   }

    const { accesstoken, refreshtoken } = await generatetokens(user._id);
    const loggedinuser= await User.findById(user._id).select("-password -refreshToken");


     return res.status(200)
     .cookie("accessToken", accesstoken, cookieOptions)
     .cookie("refreshToken", refreshtoken, cookieOptions)
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
    res.clearCookie("accessToken", cookieOptions); 
    res.clearCookie("refreshToken", cookieOptions);
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

         const { accesstoken, refreshtoken } = await generatetokens(user._id);

     return res.status(200)
     .cookie("accessToken", accesstoken, cookieOptions)
     .cookie("refreshToken", refreshtoken, cookieOptions)
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

const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await findUserByEmailOrThrow(email);

    if (user.isEmailVerified) {
        return res.status(200).json(
            apiResponse(res, 200, "Email is already verified", {
                email: user.email,
                isEmailVerified: true
            })
        );
    }

    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpiresAt) {
        throw new ApiError(400, "No OTP found. Please request a new OTP");
    }

    if (user.emailVerificationOTPExpiresAt.getTime() < Date.now()) {
        throw new ApiError(400, "OTP has expired. Please request a new OTP");
    }

    const otpHash = crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
    if (otpHash !== user.emailVerificationOTP) {
        throw new ApiError(400, "Invalid OTP");
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        apiResponse(res, 200, "Email verified successfully", {
            email: user.email,
            isEmailVerified: true
        })
    );
});

const resendEmailOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await findUserByEmailOrThrow(email);

    if (user.isEmailVerified) {
        return res.status(200).json(
            apiResponse(res, 200, "Email is already verified", {
                email: user.email,
                isEmailVerified: true
            })
        );
    }

    if (
        user.emailVerificationLastSentAt &&
        Date.now() - user.emailVerificationLastSentAt.getTime() < 60 * 1000
    ) {
        throw new ApiError(429, "Please wait 60 seconds before requesting another OTP");
    }

    if (!isSmtpConfigured()) {
        throw new ApiError(503, "Email service is not configured. Add Brevo API settings in backend/.env to send OTP emails.");
    }

    await sendEmailVerificationOtp(user);

    return res.status(200).json({
        success: true,
        message: "A new OTP has been sent to your email",
        data: {
            email: user.email
        }
    });
});

export { registeruser, loginuser, logoutuser,updatedrefreshtoken,getCurrentuser, updateCurrentuser, verifyEmailOtp, resendEmailOtp};
