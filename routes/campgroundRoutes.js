const express = require('express');
const {
  getCampground,
  getCampgrounds,
  showCreateCampground,
  createCampground,
} = require('../controllers/campgroundControllers');

const router = express.Router();

// /campgrounds
router.route('/').get(getCampgrounds).post(createCampground);

// /campgrounds/new
router.route('/new').get(showCreateCampground);

// /campgrounds/:id
router.route('/:id').get(getCampground);

module.exports = router;
