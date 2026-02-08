const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const { getContactFormEmail } = require('../utils/emailTemplates');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const html = getContactFormEmail({ name, email, subject, message });

  try {
    await sendEmail({
      email: process.env.FROM_EMAIL, // Send to site owner
      subject: `[Nuraya Contact] ${subject}`,
      html,
    });

    res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
});

module.exports = { sendContactEmail };
