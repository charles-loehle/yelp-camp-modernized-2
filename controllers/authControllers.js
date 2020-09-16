const User = require('../models/user');
const passport = require('passport');

// @desc      Show the register page
// @route     GET /auth/register
// @access    Public
exports.showRegister = (req, res) => {
  res.render('auth/register');
};

// @desc      Register
// @route     POST /auth/register
// @access    Public
exports.register = (req, res) => {
  const { username, password } = req.body;
  // passport-local-mongoose method
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
};

// @desc      Show the login page
// @route     GET /auth/login
// @access    Public
exports.showLogin = (req, res) => {
  res.render('auth/login');
};

// @desc      Login
// @route     POST /auth/login
// @access    Public
exports.login = (req, res) => {
  res.redirect('/campgrounds');
};

// @desc      Logout
// @route     GET /auth/logout
// @access    Private
exports.logout = (req, res) => {
  // passport method
  req.logout();
  res.redirect('/');
};
