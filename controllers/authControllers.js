const User = require('../models/user');
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc      Show the register page
// @route     GET /auth/register
// @access    Public
exports.showRegister = (req, res) => {
  res.render('auth/register');
};

// @desc      Register
// @route     POST /auth/register
// @access    Public
exports.register = async (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    emailToken: crypto.randomBytes(64).toString('hex'),
    isVerified: false,
  };

  // save the new user with an emailToken and isVerified set to false
  User.register(newUser, req.body.password, async function (err, user) {
    // if there is an error, redirect
    if (err) {
      req.flash('error', err.message);
      res.redirect('/auth/register');
    }

    // build the msg object to pass in to .send
    const msg = {
      to: user.email,
      from: 'noreply@yelpcamp.com',
      subject: 'Yelpcamp email verification',
      html: `<p>Email registration verification for ${req.body.username}</p>
      <p>Click the link below to verify your account.</p>
      <a href="http://${req.headers.host}/auth/verify-email?token=${user.emailToken}">Verify your account</a>`,
    };

    try {
      // send the verification email
      await sgMail.send(msg);
      // display a success message and redirect to '/'
      req.flash(
        'success',
        'Thamks for registering. Check your email to verify your account'
      );
      res.redirect('/');
    } catch (error) {
      req.flash('error', 'Something went wrong. Please try again');
      res.redirect('/');
    }
  });
};

// @desc      Email account verification
// @route     GET /auth/verify-email
// @access    Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // check if user has matching emailToken
    const user = await User.findOne({ emailToken: req.query.token });
    // if no user, send error message to the client and redirect
    if (!user) {
      req.flash('error', 'Token is invalid');
      return res.redirect('/');
    }
    user.emailToken = null;
    user.isVerified = true;
    // save the user with emailToken set to null and isVerified set to true
    await user.save();
    // passport.authenticate() exposes a req.login method
    await req.login(user, (err) => {
      // there is an error, exit the function
      if (err) return next(err);
      // if no error, flash a success message
      req.flash('success', `Welcome to Yelpcamp ${user.username}`);
      // redirectTo is passport.authenticate's successRedirect url in routes
      const redirectUrl = req.session.redirectTo || '/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl); // redirect to main page
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'Something went wrong.');
    res.redirect('/');
  }
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

// @desc      Show the forgot password page
// @route     GET /auth/forgot
// @access    Public
exports.forgotPasswordPage = (req, res) => {
  res.render('auth/forgot');
};

// @desc      Forgot password
// @route     POST /auth/forgot
// @access    Public
exports.forgotPassword = (req, res, next) => {
  async.waterfall(
    [
      // create token
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      // verifies the user with the token and saves it on the User model in the db
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            console.log('No account with that email address exists.');
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/auth/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      // send email with reset link
      function (token, user, done) {
        const msg = {
          to: user.email,
          from: 'noreply@yelpcamp.com',
          subject: 'Yelpcamp password reset',
          text: 'You requested to reset your password.',
          html: `<p>You requested a password reset link</p>\n
          <a href="http://${req.headers.host}/auth/reset/${token}">Password reset</a>`,
        };

        sgMail.send(msg, (err) => {
          console.log('mail sent');
          req.flash(
            'success',
            'An e-mail has been sent to ' +
              user.email +
              ' with further instructions.'
          );
          done(err, 'done');
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect('/auth/forgot');
    }
  );
};

// @desc      Show password reset page
// @route     GET /auth/reset/:token
// @access    Public
exports.resetPasswordPage = (req, res) => {
  // check for user with matching token
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/auth/forgot');
      }
      res.render('auth/reset', { token: req.params.token });
    }
  );
};

// @desc      Password reset
// @route     POST /auth/reset/:token
// @access    Public
exports.resetPassword = (req, res) => {
  async.waterfall(
    [
      // check if user's token matches token stored in the db and if it's not expired
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash('error', 'Password reset token is invalid or expired');
              return res.redirect('back');
            }
            // check if form input passwords match then delete token, expiration and save the user
            if (req.body.password === req.body.confirm) {
              // passport-local-mongoose
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  // passport.authenticate() exposes a req.login method
                  req.login(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash('error', 'Passwords do not match');
              return res.redirect('back');
            }
          }
        );
      },
      // send password reset confirmation email
      function (user, done) {
        const msg = {
          to: user.email,
          from: 'noreply@yelpcamp.com',
          subject: 'Your Yelpcamp password has been changed',
          html: `<p>Yelpcamp password has been changed for ${user.email}</p>`,
        };

        sgMail.send(msg, (err) => {
          console.log('mail sent');
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect('/campgrounds');
    }
  );
};
