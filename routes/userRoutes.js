const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// iNoteBook User CRUD Routes
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/update-user/:id", updateUser);
router.put("/users/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
