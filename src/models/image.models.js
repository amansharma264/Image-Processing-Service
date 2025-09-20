import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true, // required to delete image from Cloudinary
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transformations: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Image = mongoose.model("Image", imageSchema);
