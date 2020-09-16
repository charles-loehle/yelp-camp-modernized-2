const express = require('express');
const {
  showCreateComment,
  createComment,
} = require('../controllers/commentControllers');
const { isLoggedIn } = require('../middleware/authMiddleware');

// mergeParams is needed since commentControllers.js is requiring in two models, Campground and Comment
const router = express.Router({ mergeParams: true });

// GET /campgrounds/:id/comments/new
// show the create comment form
router.route('/new').get(isLoggedIn, showCreateComment);

// POST /campgrounds/:id/comments
// create a comment
router.route('/').post(isLoggedIn, createComment);

module.exports = router;
