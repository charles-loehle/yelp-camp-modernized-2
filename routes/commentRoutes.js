const express = require('express');
const {
  showCreateComment,
  createComment,
  showEditComment,
  updateComment,
} = require('../controllers/commentControllers');
const { isLoggedIn } = require('../middleware/authMiddleware');

// mergeParams is needed since commentControllers.js is requiring in two models, Campground and Comment
const router = express.Router({ mergeParams: true });
/**
 *   base route
 *   /campgrounds/:id/comments
 */

//  /campgrounds/:id/comments/new
router.route('/new').get(isLoggedIn, showCreateComment);

//  /campgrounds/:id/comments
router.route('/').post(isLoggedIn, createComment);

//  /campgrounds/:id/comments/:comment_id
router.route('/:comment_id').put(updateComment);

//  /campgrounds/:id/comments/:comment_id/edit
router.route('/:comment_id/edit').get(showEditComment);

module.exports = router;
