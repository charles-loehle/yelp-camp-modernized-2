// whenever more than one model is required in a controller { mergeParams: true } needs to be passed in to express.Router() in the routes file
const Campground = require('../models/Campground');
const Comment = require('../models/Comment');

// @desc      Show all campgrounds page
// @route     GET /campgrounds
// @access    Public
exports.getCampgrounds = async (req, res) => {
  // console.log(req.user);
  try {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {
      campgrounds,
      currentUser: req.user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc      Show the create new campground page
// @route     GET /campgrounds/new
// @access    Private
exports.showCreateCampground = (req, res) => {
  res.render('campgrounds/new');
};

// @desc      Create new campground
// @route     POST /campgrounds
// @access    Private
exports.createCampground = async (req, res) => {
  const { name, image, description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  try {
    //const newlyCreated =
    await Campground.create({
      name,
      image,
      description,
      author,
    });
    // console.log(newlyCreated);
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

// @desc     Show the edit page
// @route     GET /campgrounds/:id/edit
// @access    Public
exports.editCampground = async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc      Update single campground
// @route     PUT /campgrounds/:id
// @access    Private
exports.updateCampground = async (req, res) => {
  const { name, image, description } = req.body;
  try {
    // console.log(name, image, description);
    await Campground.findByIdAndUpdate(req.params.id, {
      name,
      image,
      description,
    });
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    console.error(err.message);
    //res.redirect('/campgrounds');
    res.status(500).send('Server error');
  }
};

// @desc      Delete a campground
// @route     DELETE /campgrounds/:id
// @access    Private
exports.deleteCampground = async (req, res) => {
  try {
    const campground = await Campground.findByIdAndRemove(req.params.id);
    res.redirect('/campgrounds');
  } catch (err) {
    console.error(err.message);
    //res.redirect('/campgrounds');
    res.status(500).send('Server error');
  }
};
