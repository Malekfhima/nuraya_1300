const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} = require("../controllers/promoCodeController");

router.route("/")
  .get(protect, admin, getPromoCodes)
  .post(protect, admin, createPromoCode);

router.route("/validate").post(validatePromoCode);

router.route("/:id")
  .put(protect, admin, updatePromoCode)
  .delete(protect, admin, deletePromoCode);

module.exports = router;
