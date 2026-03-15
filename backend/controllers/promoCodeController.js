const asyncHandler = require("express-async-handler");
const PromoCode = require("../models/PromoCode");
const { sanitizeInput } = require("../utils/validation");

// @desc    Get all promo codes
// @route   GET /api/promocodes
// @access  Private/Admin
const getPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find({});
  res.json(promoCodes);
});

// @desc    Create a promo code
// @route   POST /api/promocodes
// @access  Private/Admin
const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discountPercentage, isActive } = req.body;

  if (!code || !discountPercentage) {
    res.status(400);
    throw new Error("Code et pourcentage de réduction requis");
  }

  const codeExists = await PromoCode.findOne({ code: sanitizeInput(code).toUpperCase() });
  if (codeExists) {
    res.status(400);
    throw new Error("Ce code promo existe déjà");
  }

  const promoCode = new PromoCode({
    code: sanitizeInput(code).toUpperCase(),
    discountPercentage: Number(discountPercentage),
    isActive: Boolean(isActive ?? true),
  });

  const createdPromoCode = await promoCode.save();
  res.status(201).json(createdPromoCode);
});

// @desc    Update a promo code
// @route   PUT /api/promocodes/:id
// @access  Private/Admin
const updatePromoCode = asyncHandler(async (req, res) => {
  const { code, discountPercentage, isActive } = req.body;

  const promoCode = await PromoCode.findById(req.params.id);

  if (promoCode) {
    if (code !== undefined) promoCode.code = sanitizeInput(code).toUpperCase();
    if (discountPercentage !== undefined) promoCode.discountPercentage = Number(discountPercentage);
    if (isActive !== undefined) promoCode.isActive = Boolean(isActive);

    const updatedPromoCode = await promoCode.save();
    res.json(updatedPromoCode);
  } else {
    res.status(404);
    throw new Error("Code promo introuvable");
  }
});

// @desc    Delete a promo code
// @route   DELETE /api/promocodes/:id
// @access  Private/Admin
const deletePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);

  if (promoCode) {
    await promoCode.deleteOne();
    res.json({ message: "Code promo supprimé" });
  } else {
    res.status(404);
    throw new Error("Code promo introuvable");
  }
});

// @desc    Validate/Apply a promo code
// @route   POST /api/promocodes/validate
// @access  Public
const validatePromoCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Veuillez fournir un code promo");
  }

  const promoCode = await PromoCode.findOne({ code: sanitizeInput(code).toUpperCase() });

  if (promoCode) {
    if (!promoCode.isActive) {
      res.status(400);
      throw new Error("Ce code promo n'est plus actif");
    }
    
    // Si d'autres validations nécessaires (Date etc.) ajoutez-les ici

    res.json({
      code: promoCode.code,
      discountPercentage: promoCode.discountPercentage,
    });
  } else {
    res.status(404);
    throw new Error("Code promo invalide");
  }
});

module.exports = {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
};
