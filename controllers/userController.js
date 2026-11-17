// iNoteBook - User Controller attached with Mongoose userSchema
const User = require("../models/userSchema");

// GET: Retrieve all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET: Retrieve a single user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST: Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT: Update user by ID
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      message: "User Updated",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE: Delete user by ID
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      id: deletedUser._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
