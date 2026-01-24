const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const {
  getVerificationEmail,
  getForgotPasswordEmail,
} = require("../utils/emailTemplates");
const {
  isValidObjectId,
  sanitizeInput,
  isValidEmail,
  isStrongPassword,
} = require("../utils/validation");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Email invalide");
  }

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);

  const user = await User.findOne({ email: sanitizedEmail });
  if (user && (await user.matchPassword(sanitizedPassword))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error("Veuillez vérifier votre email avant de vous connecter");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, birthday } = req.body;

  // Validate and sanitize inputs
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400);
    throw new Error("Nom invalide");
  }

  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Email invalide");
  }

  if (!password || !isStrongPassword(password)) {
    res.status(400);
    throw new Error(
      "Mot de passe faible. Le mot de passe doit contenir au moins 6 caractères avec une combinaison de lettres et de chiffres."
    );
  }

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedName = sanitizeInput(name);
  const sanitizedPassword = sanitizeInput(password);

  const userExists = await User.findOne({ email: sanitizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password: sanitizedPassword,
    birthday,
    verificationCode,
    verificationCodeExpire,
  });

  if (user) {
    const html = getVerificationEmail(user.name, verificationCode);

    try {
      await sendEmail({
        email: user.email,
        subject: "Vérification de compte - Nuraya",
        html,
      });

      res.status(201).json({
        message: "Utilisateur enregistré. Veuillez vérifier votre email.",
      });
    } catch (err) {
      console.error(err);
      
      // In development, if email fails, log the code and proceed
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[DEV MODE] Verification Code for ${user.email}: ${verificationCode}`
            .yellow.bold
        );
        return res.status(201).json({
          message:
            "Utilisateur enregistré. (Email échoué en dev, voir la console pour le code)",
        });
      }

      // In production, delete the user if email fails so they can retry
      await User.findByIdAndDelete(user._id);
      res.status(500);
      throw new Error("L'email n'a pas pu être envoyé. Veuillez réessayer.");
    }
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
const verifyUser = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  // Validate email format
  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Email invalide");
  }

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedCode = sanitizeInput(code);

  const user = await User.findOne({
    email: sanitizedEmail,
    verificationCode: sanitizedCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Code de vérification invalide ou expiré");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  res.json({ message: "Compte vérifié avec succès !" });
});

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  // Validate email format
  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Email invalide");
  }

  // Sanitize the email input
  const sanitizedEmail = sanitizeInput(email);

  const user = await User.findOne({ email: sanitizedEmail });

  if (!user) {
    res.status(404);
    throw new Error("No user found with that email");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/resetpassword/${resetToken}`;
  const html = getForgotPasswordEmail(user.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Réinitialisation de mot de passe - Nuraya",
      html,
    });
    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("Email could not be sent");
  }
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Validate reset token format
  if (
    !req.params.token ||
    typeof req.params.token !== "string" ||
    req.params.token.length < 10
  ) {
    res.status(400);
    throw new Error("Invalid reset token");
  }

  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const newPassword = req.body.password;

  // Validate password strength
  if (!newPassword || !isStrongPassword(newPassword)) {
    res.status(400);
    throw new Error(
      "Mot de passe faible. Le mot de passe doit contenir au moins 6 caractères avec une combinaison de lettres et de chiffres."
    );
  }

  // Sanitize the password input
  const sanitizedPassword = sanitizeInput(newPassword);

  user.password = sanitizedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Mot de passe réinitialisé avec succès" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // Validate user ID
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Process name if provided
    if (req.body.name) {
      if (
        typeof req.body.name !== "string" ||
        req.body.name.trim().length === 0
      ) {
        res.status(400);
        throw new Error("Nom invalide");
      }
      user.name = sanitizeInput(req.body.name);
    }

    // Process email if provided
    if (req.body.email) {
      if (!isValidEmail(req.body.email)) {
        res.status(400);
        throw new Error("Email invalide");
      }
      user.email = sanitizeInput(req.body.email);
    }

    // Process password if provided
    if (req.body.password) {
      if (!isStrongPassword(req.body.password)) {
        res.status(400);
        throw new Error(
          "Mot de passe faible. Le mot de passe doit contenir au moins 6 caractères avec une combinaison de lettres et de chiffres."
        );
      }
      user.password = sanitizeInput(req.body.password);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Validate user ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Validate product ID to prevent NoSQL injection
  if (!productId || !isValidObjectId(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  // Validate user ID
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    if (user.wishlist.includes(productId)) {
      res.status(400);
      throw new Error("Product already in wishlist");
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(201).json({ message: "Added to wishlist" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  // Validate user ID
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  // Validate product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.id.toString()
    );
    await user.save();
    res.json({ message: "Removed from wishlist" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  // Validate user ID
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.user._id).populate("wishlist");
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
