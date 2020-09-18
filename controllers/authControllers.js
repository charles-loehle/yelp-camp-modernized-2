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
      req.flash('error', err.message);
      return res.render('auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to this app ' + user.username);
      res.redirect('/campgrounds');
    });
  });
};

// @desc      Show the login page
// @route     GET /auth/login
// @access    Public
exports.showLogin = (req, res) => {
  // console.log(req.flash('info', 'what'));
  res.render('auth/login', { message: req.flash('error') });
};

// @desc      Login
// @route     POST /auth/login
// @access    Public
exports.login = (req, res) => {
  req.flash('success', 'You are successfully logged in');
  res.redirect('/campgrounds');
};

// @desc      Logout
// @route     GET /auth/logout
// @access    Private
exports.logout = (req, res) => {
  // passport method
  req.logout();
  req.flash('success', 'You are successfully logged out');
  res.redirect('/campgrounds');
};
