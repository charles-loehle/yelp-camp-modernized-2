const express = require('express');
const {
  showCreateComment,
  createComment,
} = require('../controllers/commentControllers');

// mergeParams is needed since commentControllers.js is requiring in two models, Campground and Comment
const router = express.Router({ mergeParams: true });

// GET /campgrounds/:id/comments/new
// show the create comment form
router.route('/new').get(showCreateComment);

// POST /campgrounds/:id/comments
// create a comment
router.route('/').post(createComment);

module.exports = router;
