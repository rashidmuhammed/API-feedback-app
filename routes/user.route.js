const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  updateUserById,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Define routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getAllUser").get(getAllUser);
router.route("/updateUser").put(updateUserById);
router.route("/delteUser").delete(deleteUser);

module.exports = router;
