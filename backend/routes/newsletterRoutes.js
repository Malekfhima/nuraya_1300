const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(subscribeNewsletter).get(protect, admin, getSubscribers);

module.exports = router;
