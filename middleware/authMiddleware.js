const Campground = require('../models/Campground');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('isLoggedIn middleware ran');
  res.redirect('/auth/login');
};

exports.checkCampgroundOwnership = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    // .equals is a mongoosejs method
    if (campground.author.id.equals(req.user._id)) {
      next();
    } else {
      res.redirect('back');
    }
  } catch (err) {
    res.send('YOU NEED TO BE LOGGED IN TO DO THAT');
  }
};
