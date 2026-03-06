import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import {Family} from "../models/family.model.js";
import apiResponse from "../utils/apiresponse.js";
import {User} from "../models/user.model.js";
import {Document} from "../models/document.model.js";


const uploadDocument = asyncHandler(async(req,res)=>{

    const {title} = req.body;
    const memeberid = req.params;

    if (!title) {
        throw new ApiError(400, "Title is required and cannot be empty");
    }
    
    if (!req.files || !req.files.document) {
        throw new ApiError(400, "Document file is required");
    }

    const family = await Family.findOne({
      "members.user": req.user._id,
    });

    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    const ismemberexist = family.members.find(m => m.user.toString() === memeberid);
    if (!ismemberexist) {
      throw new ApiError(404, "Member not found in the family");
    }

    const localdocumentpath = req.files?.document[0].path;
    const documenttype = req.files?.document[0].mimetype;
    let filetype;

    if (documenttype === "application/pdf") {   
        filetype = "pdf";
    } else if (documenttype.startsWith("image/")) {
        filetype = "image";
    } else {
        throw new ApiError(400, "Unsupported file type. Only PDF and images are allowed.");
    }

    const uploadedDocument = await uploadonCloudinary(localdocumentpath);
    if (!uploadedDocument) {
        throw new ApiError(500, "Failed to upload document");
    }

    const document = await Document.create({
        title,
        fileUrl: uploadedDocument.url,
        publicId: uploadedDocument.public_id,
        fileType: filetype,
        uploadedBy: req.user._id,
        member: memeberid,
        family: family._id,
    });

    return res.status(201).json(apiResponse(res, 201, "Document uploaded successfully", document));
});

const getDocumentsByMember = asyncHandler(async(req,res)=>{
    const memeberid = req.params.memberid;
    const family = await Family.findOne({
        "members.user": req.user._id,
    });
    if (!family) {
        throw new ApiError(404, "Family not found");
    }
    const ismemberexist = family.members.find(m => m.user.toString() === memeberid);
    if (!ismemberexist) {
        throw new ApiError(404, "Member not found in the family");
    }   
    const documents = await Document.find({ member: memeberid, family: family._id });
    return res.status(200).json(apiResponse(res, 200, "Documents retrieved successfully", documents));
});


const removeDocument = asyncHandler(async(req,res)=>{
    const documentid = req.params.documentid;
    const document = await Document.findById(documentid);
    if (!document) {
        throw new ApiError(404, "Document not found");
    }
    const family = await Family.findOne({
        "members.user": req.user._id,
    });
    if (!family) {
        throw new ApiError(404, "Family not found");
    }
    const ismemberexist = family.members.find(m => m.user.toString() === document.member.toString());
    if (!ismemberexist) {
        throw new ApiError(404, "Member not found in the family");
    }   

    if 
    (
        member.role !== "admin" && document.uploadedBy.toString() !== req.user._id.toString()
     )
    {
        throw new ApiError(403, "You do not have permission to delete this document");
        
    }
    await cloudinary.uploader.destroy(document.publicId);
    await document.findByIdAndDelete(documentid);
    return res.status(200).json(apiResponse(res, 200, "Document removed successfully"));
}
);



export {uploadDocument, getDocumentsByMember, removeDocument  };        