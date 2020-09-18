// whenever more than one model is required in a controller { mergeParams: true } needs to be passed in to express.Router() in the routes file
const Campground = require('../models/Campground');
const Comment = require('../models/Comment');

// @desc      Show the create new comment page
// @route     GET /campgrounds/:id/comments/new
// @access    Public
exports.showCreateComment = async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      return res.status(404).json({ msg: 'Campground not found' });
    }
    // res.render('comments/new', { campground: campground });
    res.render('comments/new', { campground });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc      Create new comment
// @route     POST /campgrounds/:id/comments
// @access    Private
exports.createComment = async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);

    const comment = await Comment.create(req.body.comment);
    // set author.id and author.username properties of the Comment model to data from the form
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    comment.save();

    // push the comments onto the Campground model's comments array
    campground.comments.push(comment);
    campground.save();
    console.log(comment);
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    console.error(err.message);
    res.redirect('/campgrounds');
  }
};

// @desc      Show the edit comment page
// @route     GET /campgrounds/:id/comments/:comment_id/edit
// @access    Private
exports.showEditComment = (req, res) => {
  // find the right comment by id
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      // pass in :id and :comment_id
      res.render('comments/edit', {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
};

// @desc      Update a comment
// @route     PUT /campgrounds/:id/comments/:comment_id
// @access    Private
exports.updateComment = async (req, res) => {
  const { text } = req.body;
  console.log(text);
  try {
    await Comment.findByIdAndUpdate(req.params.comment_id, { text });
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    res.redirect('back');
  }
};

// @desc      Delete a comment
// @route     DELETE /campgrounds/:id/comments/:comment_id
// @access    Private
exports.deleteComment = async (req, res) => {
  //res.send('DELETE COMMENT ROUTE');
  try {
    await Comment.findByIdAndRemove(req.params.comment_id);
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    console.error(err.message);
    //res.redirect('/campgrounds');
    res.status(500).send('Server error');
  }
};
