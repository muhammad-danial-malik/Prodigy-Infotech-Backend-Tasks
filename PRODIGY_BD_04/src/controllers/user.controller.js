import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import redisClient from "../config/redisClient.js";
import User from "../models/user.model.js";

const cookiesOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens", error);
  }
};

// Invalidate cache when user data changes
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({ username, email, password });
  await redisClient.del(process.env.USERS_CACHE_KEY);

  res.status(201).json(new ApiResponse(201, "User registered", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._Id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("refreshToken", cookiesOptions)
    .clearCookie("accessToken", cookiesOptions)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", user));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const cachedUsers = await redisClient.get(process.env.USERS_CACHE_KEY);
  if (cachedUsers) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All users (from cache)", JSON.parse(cachedUsers))
      );
  }

  const users = await User.find().select("-password -refreshToken");
  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(users)); // 1hr expiry
  res
    .status(200)
    .json(new ApiResponse(200, "All users fetched successfully", users));
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, age } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, email, age },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new ApiError(404, "User not found");

  await redisClient.del(process.env.USERS_CACHE_KEY);
  res.status(200).json(new ApiResponse(200, "User updated", updatedUser));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) throw new ApiError(404, "User not found");

  await redisClient.del(process.env.USERS_CACHE_KEY);
  res.status(200).json(new ApiResponse(200, "User deleted", deletedUser));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
  updateUser,
  deleteUser,
};
