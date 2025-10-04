import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // make sure .env variables are loaded

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file or URL to Cloudinary
const uploadOnCloudinary = async (filePathOrUrl) => {
  try {
    if (!filePathOrUrl) return null;

    // Cloudinary supports both remote URLs and local file paths
    const response = await cloudinary.uploader.upload(filePathOrUrl, {
      resource_type: "auto", // auto-detect image/video
    });

    console.log("✅ Cloudinary upload success:", response.secure_url);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    throw new Error("Cloudinary Upload Failed: " + error.message);
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Cloudinary delete:", response);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error.message);
    throw new Error("Cloudinary Delete Failed: " + error.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
