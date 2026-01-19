const mongoose = require("mongoose");

/**
 * Validates if a given value is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitizes user input to prevent NoSQL injection
 * @param {any} input - The input to sanitize
 * @returns {any} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    // Prevent NoSQL injection by removing dangerous characters/sequences
    // Remove MongoDB operators that could be injected
    let sanitized = input.replace(/\$.*?\b/g, "").trim();
    // Additional security: remove potential prototype pollution attempts
    sanitized = sanitized.replace(/__proto__/gi, "");
    sanitized = sanitized.replace(/constructor/gi, "");
    sanitized = sanitized.replace(/prototype/gi, "");
    return sanitized;
  }

  if (Array.isArray(input)) {
    return input
      .map((item) => sanitizeInput(item))
      .filter((item) => item !== null && item !== undefined);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (const key in input) {
      // Prevent injection through keys containing MongoDB operators
      if (
        key.startsWith("$") ||
        ["__proto__", "constructor", "prototype"].includes(key.toLowerCase())
      ) {
        continue; // Skip potentially dangerous keys
      }
      const sanitizedValue = sanitizeInput(input[key]);
      if (sanitizedValue !== null && sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }

  return input;
};

/**
 * Validates and sanitizes search query parameters
 * @param {Object} query - Query parameters from request
 * @returns {Object} - Sanitized query object
 */
const sanitizeQueryParams = (query) => {
  const sanitized = {};

  // Whitelist allowed query parameters
  const allowedParams = [
    "keyword",
    "category",
    "min",
    "max",
    "rating",
    "pageNumber",
    "query",
  ];

  for (const param in query) {
    if (allowedParams.includes(param)) {
      sanitized[param] = sanitizeInput(query[param]);
    }
  }

  return sanitized;
};

/**
 * Builds a safe MongoDB query from user input
 * @param {Object} userInput - User-provided search parameters
 * @returns {Object} - Safe MongoDB query object
 */
const buildSafeQuery = (userInput) => {
  const query = {};

  if (userInput.keyword) {
    // Validate and sanitize keyword input
    const sanitizedKeyword = sanitizeInput(String(userInput.keyword));
    query.$or = [
      { name: { $regex: sanitizedKeyword, $options: "i" } },
      { category: { $regex: sanitizedKeyword, $options: "i" } },
    ];
  }

  if (
    userInput.category &&
    userInput.category !== "All" &&
    userInput.category !== "Tout"
  ) {
    query.category = sanitizeInput(String(userInput.category));
  }

  if (userInput.min || userInput.max) {
    query.price = {};
    if (userInput.min) {
      query.price.$gte = Number(userInput.min);
    }
    if (userInput.max) {
      query.price.$lte = Number(userInput.max);
    }
  }

  if (userInput.rating) {
    query.rating = { $gte: Number(userInput.rating) };
  }

  return query;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if strong enough, false otherwise
 */
const isStrongPassword = (password) => {
  // Minimum 6 characters, at least one letter and one number
  return newFunction();

  function newFunction() {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  }
};

module.exports = {
  isValidObjectId,
  sanitizeInput,
  sanitizeQueryParams,
  buildSafeQuery,
  isValidEmail,
  isStrongPassword,
};
