import { Router } from "express";
import { uploadImage, listImages, deleteImage } from "../controllers/image.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Upload Image
router.route("/upload").post(
  verifyJWT,
  uploadImage
);

// Get all images
router.route("/").get(verifyJWT, listImages);

// Delete image by ID
router.route("/:id").delete(verifyJWT, deleteImage);

export default router;