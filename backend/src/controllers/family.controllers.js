import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {Family} from "../models/family.model.js";
import apiResponse from "../utils/apiresponse.js";
import {User} from "../models/user.model.js";

const generateInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const ensureFamilyInviteCode = async (family) => {
    if (family.inviteCode) {
        return family;
    }

    let inviteCode = generateInviteCode();
    while (await Family.findOne({ inviteCode })) {
        inviteCode = generateInviteCode();
    }

    family.inviteCode = inviteCode;
    await family.save();
    return family;
};


 const createfamily = asyncHandler(async(req,res)=>{
    const { familyname } = req.body;
    if(!familyname ){    
        throw new ApiError(400, "Family name is required and cannot be empty");
    }

    const existingfamily = await Family.findOne({ "members.user": req.user._id });
    if(existingfamily){
        throw new ApiError(409, "User already belongs to a family");
    }

   let inviteCode = generateInviteCode();
   while (await Family.findOne({ inviteCode })) {
      inviteCode = generateInviteCode();
   }

   const family = await Family.create({
        name: familyname,
        inviteCode,
        createdby: req.user._id,
        members: [{ user: req.user._id, role: "admin" }]
    });

    return apiResponse(res, 201, "Family created successfully", family);
    });

    const getMyFamily = asyncHandler(async(req,res)=>{
        const family = await Family.findOne({ "members.user": req.user._id }).populate("members.user", "username email avatar");
   if(!family){
      return apiResponse(res, 200, "No family found", { hasFamily:false });
   }

   await ensureFamilyInviteCode(family);

   return apiResponse(res, 200, "Family retrieved successfully", {
      hasFamily:true,
      family
   });
    });

    const joinFamily = asyncHandler(async(req,res)=>{
        const { inviteCode } = req.body;

        if (!inviteCode || !inviteCode.trim()) {
            throw new ApiError(400, "Invite code is required");
        }

        const existingfamily = await Family.findOne({ "members.user": req.user._id });
        if(existingfamily){
            throw new ApiError(409, "User already belongs to a family");
        }

        const family = await Family.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!family) {
            throw new ApiError(404, "Invalid family invite code");
        }

        const existingMember = family.members.find(m => m.user.toString() === req.user._id.toString());
        if (existingMember) {
            throw new ApiError(409, "User is already a member of this family");
        }

        family.members.push({ user: req.user._id, role: "member" });
        await family.save();

        return apiResponse(res, 200, "Joined family successfully", family);
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
        await ensureFamilyInviteCode(family);
        const existingMember = family.members.find(m => m.user.toString() === user._id.toString());
        if (existingMember) {
            throw new ApiError(409, "User is already a member of the family");
        }
        family.members.push({ user: user._id, role: "member" });
        await family.save();
        return apiResponse(res, 200, "Member added to family successfully", family);
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
        await ensureFamilyInviteCode(family);
         if (memberid === req.user._id.toString()) {
      throw new ApiError(400, "Admin cannot remove himself");
   }
        const memberIndex = family.members.findIndex(m => m.user.toString() === memberid);
        if (memberIndex === -1) {
            throw new ApiError(404, "Member not found in family");
        }
        family.members.splice(memberIndex, 1);
        await family.save();
        return apiResponse(res, 200, "Member removed from family successfully", family);
    });
    export { createfamily, getMyFamily, joinFamily, addMemberToFamily, removeMemberFromFamily };
