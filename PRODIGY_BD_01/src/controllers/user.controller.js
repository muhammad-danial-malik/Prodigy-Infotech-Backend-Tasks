import { v4 as uuid } from "uuid";
import { isValidUser } from "../utils/validate.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import users, { saveUsersToFile } from "../data/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const userList = Array.from(users.values());

  if (userList.length === 0) {
    throw new ApiError(404, "Users not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, userList, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;

  if (!isValidUser({ name, email, age })) {
    throw new ApiError(400, "Invalid user data");
  }

  const id = uuid();
  const newUser = { id, name, email, age };

  users.set(id, newUser);
  await saveUsersToFile();

  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User created successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!users.has(id)) {
    throw new ApiError(404, "User not found");
  }

  const { name, email, age } = req.body;

  if (!isValidUser({ name, email, age })) {
    throw new ApiError(400, "Invalid user data");
  }

  const updatedUser = { id, name, email, age };
  users.set(id, updatedUser);
  await saveUsersToFile();

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!users.has(id)) {
    throw new ApiError(404, "User not found");
  }

  const deletedUser = users.get(id);
  users.delete(id);
  await saveUsersToFile();

  res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
});
