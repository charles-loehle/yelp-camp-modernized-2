const express = require('express');
const {
  getCampground,
  getCampgrounds,
  showCreateCampground,
  createCampground,
  editCampground,
  updateCampground,
  deleteCampground,
} = require('../controllers/campgroundControllers');
const {
  isLoggedIn,
  checkCampgroundOwnership,
} = require('../middleware/authMiddleware');

// mergeParams is needed since campgroundControllers.js is requiring in two models, Campground and Comment
const router = express.Router({ mergeParams: true });

// /campgrounds
router.route('/').get(getCampgrounds).post(isLoggedIn, createCampground);

// /campgrounds/new
router.route('/new').get(isLoggedIn, showCreateCampground);

// /campgrounds/:id
router
  .route('/:id')
  .get(getCampground)
  .put(checkCampgroundOwnership, updateCampground)
  .delete(checkCampgroundOwnership, deleteCampground);

router.route('/:id/edit').get(checkCampgroundOwnership, editCampground);

module.exports = router;
