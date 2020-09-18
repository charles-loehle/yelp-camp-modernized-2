const Campground = require('../models/Campground');
const Comment = require('../models/Comment');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/auth/login');
};

exports.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    // if authenticated
    // find a campground
    Campground.findById(req.params.id, function (err, foundCampground) {
      // if no campground found
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
    // if not authenticated
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

exports.checkCommentOwnership = async (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};
