import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {Family} from "../models/family.model.js";




const isAdmin = asyncHandler(async (req, res, next) => {
   try {
     const family = await Family.findOne({ "members.user": req.user._id });
     if (!family) {
         throw new  ApiError(404, "Family not found");
     }
     const member = family.members.find(m => m.user.toString() === req.user._id.toString());
     if (!member || member.role !== "admin") {
         throw new ApiError(403, "Access denied: Admins only");
     }
     next();
   } catch (error) {
     throw error;
   }
});

export default isAdmin;