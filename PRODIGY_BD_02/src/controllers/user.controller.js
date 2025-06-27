import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    throw new ApiError(404, "Users not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;

  const newUser = await User.create({ name, email, age });

  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User created successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, age },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
});