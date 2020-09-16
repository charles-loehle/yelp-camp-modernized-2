const Campground = require('../models/Campground');

// @desc      Show all campgrounds page
// @route     GET /campgrounds
// @access    Public
exports.getCampgrounds = async (req, res) => {
  console.log(req.user);
  try {
    const allCampgrounds = await Campground.find();
    res.render('campgrounds/index', {
      campgrounds: allCampgrounds,
      currentUser: req.user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc      Show the create new campground page
// @route     GET /campgrounds/new
// @access    Public
exports.showCreateCampground = (req, res) => {
  res.render('campgrounds/new');
};

// @desc      Create new campground
// @route     POST /campgrounds
// @access    Private
exports.createCampground = async (req, res) => {
  const { name, image, description } = req.body;

  try {
    await Campground.create({ name, image, description });
    res.redirect('/campgrounds');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc      Get a single campground
// @route     GET /campgrounds/:id
// @access    Public
exports.getCampground = async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      'comments'
    );

    if (!campground)
      return res.status(404).json({ msg: 'Campground not found' });

    res.render('campgrounds/show', { campground });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
