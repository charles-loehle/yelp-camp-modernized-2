const User = require('./models/User');

router.post('/register', async function (req, res) {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    emailToken: crypto.randomBytes(64).toString('hex'),
    isVerified: false,
  };
  // register the user
  User.register(newUser, req.body.password, async function (err, user) {
    // if there is an error, redirect
    if (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
    // build the msg object to pass in to .send
    const msg = {
      from: 'noreply@gmail.com',
      to: user.email,
      subject: 'Yelpcamp email verification',
      text: `email registration verification for ${req.body.username}`,
      html: `<p>Click the link below to verify your account.</p>
      <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}>Verify your account</a>`,
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
});

router.get('/verify-email', async (req, res, next) => {
  try {
    // check if user exists
    const user = await User.findOne({ emailToken: req.query.token });
    // if no user, send error message to the client and redirect
    if (!user) {
      req.flash('error', 'Token is invalid');
      return res.redirect('/');
    }
    user.emailToken = null;
    user.isVerified = true;
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
});
