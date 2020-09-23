const express = require('express');
const {
  showContactForm,
  contactFormSubmission,
} = require('../controllers/contactControllers');
const { isLoggedIn } = require('../middleware/authMiddleware');

const router = express.Router();

// /contact
router.route('/').get(isLoggedIn, showContactForm).post(contactFormSubmission);

module.exports = router;
