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

// Transforming an image
const transformImage = asyncHandler(async (req, res) => {
    const { transformations } = req.body;
    const { id } = req.params;

    if (!transformations || Object.keys(transformations).length === 0) {
        throw new ApiError(400, "Transformations are required");
    }

    const image = await Image.findById(id);
    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    // Call Cloudinary to apply the transformations
    const transformedResponse = await uploadOnCloudinary(image.url, transformations);
    if (!transformedResponse) {
        throw new ApiError(500, "Failed to apply transformation on Cloudinary");
    }

    // Update the image entry in the database with the new URL and transformations
    image.url = transformedResponse.url;
    image.transformations = { ...image.transformations, ...transformations };
    await image.save();

    return res.status(200).json(new ApiResponse(200, "Image transformed successfully", image));
});

export { uploadImage, listImages, deleteImage, transformImage };