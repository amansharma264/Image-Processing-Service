import { Image } from "../models/image.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Uploading image
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image found");

  // Upload file to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
  if (!cloudinaryResponse) throw new ApiError(500, "Image upload failed");

  // Save image info in MongoDB
  const image = await Image.create({
    url: cloudinaryResponse.secure_url,
    public_id: cloudinaryResponse.public_id,
    uploadedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Image uploaded successfully", image));
});

// Listing the images
const listImages = asyncHandler(async (req, res) => {
  const images = await Image.find({ uploadedBy: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

// Deleting image
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) throw new ApiError(404, "Image not found");

  // Delete from Cloudinary first
  const { v2: cloudinary } = await import("cloudinary");
  await cloudinary.uploader.destroy(image.public_id);

  // Delete from DB
  await image.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully"));
});

export { uploadImage, listImages, deleteImage };
