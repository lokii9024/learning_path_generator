import  {User} from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"
import fs from "fs";
import {sendEmail} from "../config/nodemailer.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
};

// password validation function (do this on frontend instead)
// min length 8, at least one uppercase, one lowercase, one digit, one special character
/* const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const isPasswordValid = (password) => {
    return passwordRegex.test(password);
} */

// email validation function (do this on frontend instead)
/* const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; */
/* const isEmailValid = (email) => {
    return emailRegex.test(email);
} */

//signup controller
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // TODO: validate email and password format here
    
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
      return res.status(500).json({message: "Error hashing password"});
    }
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const savedUser = await User.findOne({ email }).select("-password");

    //TODO: send welcome email

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions).status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Something went wrong while creating user",
        error: error.message,
      });
  }
};

// upload avatar controller
export const updateAvatar = async (req, res) => {
  console.log("Update avatar request received");
  const localFilePath = req.file?.path;
  if (!localFilePath) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Local file path:", localFilePath);
  // upload to cloudinary
  let result;

  try {
    const userId = req.user._id;
    //upload to cloudinary
    result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // if (!result || !result.secure_url) {
    //   return res.status(500).json({ message: "Error uploading avatar to cloudinary" });
    // }

    console.log(result);
    console.log("Avatar uploaded successfully");

    // delete local file after upload
    fs.unlinkSync(localFilePath);

    // find user by ID
    const user = await User.findById(userId);
    const avatarUrl = user.avatarUrl;

    // update user profile with avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result?.secure_url,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete old avatar from cloudinary if exists
    if (avatarUrl) {
      const publicId = avatarUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    // delete local file in case of error
    if (result?.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    fs.unlinkSync(localFilePath);
    res
      .status(500)
      .json({
        message: "Something went wrong while uploading avatar",
        error: error.message,
      });
  }
};

// remove avatar controller
export const removeAvatar = async (req, res) => {
  const userId = req.user._id;
  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    // delete avatar from cloudinary
    const avatarUrl = user.avatarUrl;
    if(!avatarUrl){
      return res.status(400).json({message: "No avatar to delete"});
    }
    const publicId = avatarUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    user.avatarUrl = "";

    await user.save();

    res.status(200).json({message: "Avatar removed successfully", userId});
  } catch (error) {
    res.status(500).json({message: "Error removing avatar", error: error.message});
  }
}

// TODO: edit avatar controller

// login controller
export const loginUser = async (req, res) => {
  console.log("Login request received");
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }
    console.log("User found:",user);
    const hashedPassword = user.password;
    if(!hashedPassword){
      return res.status(500).json({message: "Error retrieving user password"});
    }
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    console.log("Password is valid");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const userData = await User.findOne({ email }).select("-password");
    console.log("JWT token generated");
    res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Something went wrong while logging in",
        error: error.message,
      });
  }
};

// logout controller
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // true in production (requires HTTPS)
      sameSite: "lax", // helps prevent CSRF
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Something went wrong while logging out",
        error: error.message,
      });
  }
};

// get user profile controller
export const getUserProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user, message: "User info fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Something went wrong while fetching user profile",
        error: error.message,
      });
  }
};
