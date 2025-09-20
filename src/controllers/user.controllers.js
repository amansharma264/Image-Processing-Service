import {User} from "../models/user.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found while generating tokens");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};


// registering the user

const registerUser = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body;
    if(!(name || email || password)){
        throw new ApiError(400, "All field required");
    }

    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    return res 
    .status(201)
    .json(
        new ApiResponse(201, "User registered successfully", {
            user : {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        })
    )
})

// login user

const logIn = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    if(!(email || password)){
        throw new ApiError(400, "Email and password are required");
    }
    const user = await User.findOne({email}).select("+password");
    if(!user) throw new ApiError(404, "User not found");

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials");
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(201)
    .json(
        new ApiResponse(200, "User logged in successfully", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        })

    )
});

// logout user

const logoutUser = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user._id);
    if(!user) throw new ApiError(404, "User not found");

    user.refreshToken = null;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, "User logout Successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) =>{
    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token") 
    }
})

export {registerUser,
    logIn,
    logoutUser
}
