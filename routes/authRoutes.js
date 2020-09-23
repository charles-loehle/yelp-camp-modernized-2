const express = require('express');
const passport = require('passport');
const {
  showLogin,
  showRegister,
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  forgotPasswordPage,
  resetPassword,
  resetPasswordPage,
} = require('../controllers/authControllers');

const router = express.Router();

//  /auth/register
router.route('/register').get(showRegister).post(register);

//  /auth/login
router
  .route('/login')
  .get(showLogin)
  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
    }),
    login
  );

//  /auth/logout
router.route('/logout').get(logout);

//  /auth/verify-email
router.route('/verify-email').get(verifyEmail);

//  /auth/forgotPassword
router.route('/forgot').get(forgotPasswordPage).post(forgotPassword);

//  /auth/reset/:token
router.route('/reset/:token').get(resetPasswordPage).post(resetPassword);

module.exports = router;
