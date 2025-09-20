import { Image } from "../models/image.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFile } from "../utils/fileHandler.js";

// Uploading image
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image found");

  // Save image info in MongoDB
  const image = await Image.create({
    url: `/images/${req.file.filename}`, // Local URL
    fileName: req.file.filename,
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

  // Delete from local storage first
  await deleteFile(image.fileName);

  // Delete from DB
  await image.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully"));
});

export { uploadImage, listImages, deleteImage };