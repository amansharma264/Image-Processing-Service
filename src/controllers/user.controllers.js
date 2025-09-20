import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Helper to generate tokens based on .env
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // "1d"
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // "10d"
  );

  return { accessToken, refreshToken };
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const tokens = generateTokens(user._id);

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens,
    })
  );
});

// Login user
const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const tokens = generateTokens(user._id);

  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens,
    })
  );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // If storing refresh tokens in DB, you could delete it here
  return res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});

export { registerUser, logIn, logoutUser };
