import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    // TODO: Create a new user logic here
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
});

// Update user details
const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    // TODO: Update user details logic here
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) throw new ApiError('User not found', 404);
    res.json(user);
});

// Get user details
const getUserDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: Get user details logic here
    const user = await User.findById(userId);
    if (!user) throw new ApiError('User not found', 404);
    res.json(user);
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    // TODO: Get all users logic here
    const users = await User.find();
    res.json(users);
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: Delete user logic here
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new ApiError('User not found', 404);
    res.status(204).end();
});

export {
    createUser,
    updateUser,
    getUserDetails,
    getAllUsers,
    deleteUser
};
