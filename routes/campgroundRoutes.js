const express = require('express');
const {
  getCampground,
  getCampgrounds,
  showCreateCampground,
  createCampground,
  editCampground,
  updateCampground,
} = require('../controllers/campgroundControllers');
const { isLoggedIn } = require('../middleware/authMiddleware');

const router = express.Router();

// /campgrounds
router.route('/').get(getCampgrounds).post(isLoggedIn, createCampground);

// /campgrounds/new
router.route('/new').get(isLoggedIn, showCreateCampground);

// /campgrounds/:id
router.route('/:id').get(getCampground).put(updateCampground);

router.route('/:id/edit').get(editCampground);

module.exports = router;
