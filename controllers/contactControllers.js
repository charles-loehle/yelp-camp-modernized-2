const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc      Show contact page
// @route     GET /contact
// @access    Public
exports.showContactForm = (req, res) => {
  res.render('contact/contact');
};

// @desc      Contact form submission
// @route     POST /contact
// @access    Public
exports.contactFormSubmission = async (req, res) => {
  let { name, email, message } = req.body;
  name = req.sanitize(name);
  email = req.sanitize(email);
  message = req.sanitize(message);
  const msg = {
    to: 'clguitar1@gmail.com',
    from: email,
    subject: `Yelpcamp contact form submission from ${name}`,
    text: message,
    html: `<strong>${message}</strong>`,
  };

  try {
    await sgMail.send(msg);
    req.flash('success', 'Your email has been sent');
    res.redirect('/contact');
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    req.flash('error', 'Something went wrong with sending the email');
    res.redirect('back');
  }
};
