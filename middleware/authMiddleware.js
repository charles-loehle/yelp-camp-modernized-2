exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('isLoggedIn middleware ran');
  res.redirect('/auth/login');
};
