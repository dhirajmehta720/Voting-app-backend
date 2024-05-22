import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, age, email, aadharNumber, password, role } = req.body;
  const admin = await User.findOne({ role: "admin" });

  if (admin && role === "admin") {
    throw new ApiError(401, "Admin already exists");
  }

  const user = await User.create({
    name,
    age,
    email,
    aadharNumber,
    password,
    role,
  });

  return res.status(201).json(new ApiResponse(200, user));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { aadharNumber, password } = req.body;

  if (!aadharNumber || !password) {
    throw new ApiError(401, "Fill the fields");
  }

  const user = await User.findOne({ aadharNumber });
  if (!user) {
    throw new ApiError(401, "User not exists");
  }
  
  const verifyPwd = await user.isPasswordCorrect(password);
  if(!verifyPwd) {
    throw new ApiError(401, "password is not correct");
  };

  const jwtToken = user.generateJWT();

  const options = {
    httpOnly: true, // by making them true we can modify cookies by server only not by frontend
    secure: true,
  };

  return res
    .cookie("token", jwtToken, options)
    .json(new ApiResponse(201, { user, jwt: jwtToken }));
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

//password change
const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const user = await User.findById(req.user._id);

  const verifyOldPwd = await user.isPasswordCorrect(oldpassword);

  if (!verifyOldPwd) {
    throw new ApiError(401, "old password is not correct");
  }

  user.password = newpassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { registerUser, loginUser, logoutUser, changePassword };
