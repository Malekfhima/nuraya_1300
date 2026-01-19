const asyncHandler = require('express-async-handler');
const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email');
  }

  const exists = await Newsletter.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error('Email already subscribed');
  }

  await Newsletter.create({ email });

  res.status(201).json({ message: 'Subscribed successfully' });
});

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
});

module.exports = { subscribeNewsletter, getSubscribers };
