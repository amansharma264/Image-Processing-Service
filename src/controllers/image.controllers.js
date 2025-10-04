import { Image } from "../models/image.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Uploading image from URL
const uploadImage = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    throw new ApiError(400, "Image URL is required");
  }

  // Upload to cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(imageUrl);
  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  // Save image info in MongoDB
  const image = await Image.create({
    url: cloudinaryResponse.url,
    publicId: cloudinaryResponse.public_id,
    fileName: cloudinaryResponse.original_filename || cloudinaryResponse.url.split('/').pop().split('.')[0],
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

  // Delete from Cloudinary
  const result = await deleteFromCloudinary(image.publicId);
  if (result.result !== 'ok') {
      throw new ApiError(500, "Failed to delete image from Cloudinary");
  }

  // Delete from DB
  await image.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully"));
});

export { uploadImage, listImages, deleteImage };