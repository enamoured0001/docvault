import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {        // cloudinary delete ke liye
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "image"],
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    member: {          // jis member ka document hai
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
