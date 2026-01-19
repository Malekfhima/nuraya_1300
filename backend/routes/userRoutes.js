const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/verify", verifyUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/wishlist")
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.route("/wishlist/:id").delete(protect, removeFromWishlist);
router.route("/:id").delete(protect, admin, deleteUser);

module.exports = router;
