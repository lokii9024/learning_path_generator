import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

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

//signup controller
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save().select("-password");
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions).status(201).json({
      message: "User registered successfully",
      user: savedUser,
      token,
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
export const uploadAvatar = async (req, res) => {
  const localFilePath = req.file.path;
  if (!localFilePath) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const userId = req.user._id;
    //upload to cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(result);
    console.log("Avatar uploaded successfully");

    // delete local file after upload
    fs.unlinkSync(localFilePath);

    // update user profile with avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: result.secure_url,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    fs.unlinkSync(localFilePath);
    res
      .status(500)
      .json({
        message: "Something went wrong while uploading avatar",
        error: error.message,
      });
  }
};

// TODO: edit avatar controller

// login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      token,
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
