const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// for register
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, name, feedbac } = req.body;

  // Check for missing fields
  if (!email || !password || !role) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    name,
    feedbac,
  });

  console.log(`User created ${user}`);

  // Send response
  if (user) {
    res.status(201).json({ message: "user Created " });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({
    email,
  });
  console.log(email, password);

  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET, // Correct environment variable name
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

const getAllPaginatedUser = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("_id name role feedbac")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.query;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid User ID");
  }

  const editUserId = await User.findById(id);

  if (!editUserId) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!editUserId._id.equals(id)) {
    res.status(403);
    throw new Error("User doesn't have permission to update other users'");
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const delteUserId = await User.findById(id);

  if (!delteUserId) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!delteUserId._id.equals(id)) {
    res.status(403);
    throw new Error(
      "User doesn't have permission to update other users' contacts"
    );
  }
  await User.findByIdAndDelete(id);

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getAllPaginatedUser,
  updateUserById,
  deleteUser,
};
