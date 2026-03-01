import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {Family} from "../models/family.model.js";
import apiResponse from "../utils/apiresponse.js";
import {User} from "../models/user.model.js";



 const createfamily = asyncHandler(async(req,res)=>{
    const { familyname } = req.body;
    if(!familyname ){    
        throw new ApiError(400, "Family name is required and cannot be empty");
    }

    const existingfamily = await Family.findOne({ member: req.user._id});
    if(existingfamily){
        throw new ApiError(409, "Family with this name already exists");
    }

   const family = await Family.create({
        name: familyname,
        createdby: req.user._id,
        members: [{ user: req.user._id, role: "admin" }]
    });

    return res.status(201).json(apiResponse(res,200, "Family created successfully", family));
    });

    const getMyFamily = asyncHandler(async(req,res)=>{
        const family = await Family.findOne({ "members.user": req.user._id }).populate("members.user", "username email avatar");
        if(!family){
            throw new ApiError(404, "Family not found");
        }
        return res.status(200).json(apiResponse(res, 200, "Family retrieved successfully", family));
    });


    const addMemberToFamily = asyncHandler(async(req,res)=>{
        const { email } = req.body;
         if (!email) {
      throw new ApiError(400, "Email is required");
   }
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const family = await Family.findOne({ "members.user": req.user._id });
        if (!family) {
            throw new ApiError(404, "Family not found");
        }
        const existingMember = family.members.find(m => m.user.toString() === user._id.toString());
        if (existingMember) {
            throw new ApiError(409, "User is already a member of the family");
        }
        family.members.push({ user: user._id, role: "member" });
        await family.save();
        return res.status(200).json(apiResponse(res, 200, "Member added to family successfully", family));
    });

    const removeMemberFromFamily = asyncHandler(async(req,res)=>{
        const { memberid } = req.params;
        if (!memberid) {
            throw new ApiError(400, "Member ID is required");
        }
        const family = await Family.findOne({ "members.user": req.user._id });
        if (!family) {
            throw new ApiError(404, "Family not found");
        }
         if (memberid === req.user._id.toString()) {
      throw new ApiError(400, "Admin cannot remove himself");
   }
        const memberIndex = family.members.findIndex(m => m.user.toString() === memberid);
        if (memberIndex === -1) {
            throw new ApiError(404, "Member not found in family");
        }
        family.members.splice(memberIndex, 1);
        await family.save();
        return res.status(200).json(apiResponse(res, 200, "Member removed from family successfully", family));
    });
    export { createfamily, getMyFamily, addMemberToFamily, removeMemberFromFamily };