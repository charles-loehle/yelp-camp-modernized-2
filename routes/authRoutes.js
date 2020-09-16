const express = require('express');
const passport = require('passport');
const {
  showLogin,
  showRegister,
  register,
  login,
  logout,
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
      //successRedirect: '/auth/secret',
      failureRedirect: '/auth/login',
    }),
    login
  );

//  /auth/logout
router.route('/logout').get(logout);

module.exports = router;
