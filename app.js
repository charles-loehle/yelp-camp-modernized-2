const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const User = require('./models/user');
const expressSanitizer = require('express-sanitizer');
// const seedDB = require('./seeds');

require('dotenv').config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
connectDB();

app.set('view engine', 'ejs');

// session data is stored server side, the session id is stored in a cookie
app.use(
  session({
    secret: 'app secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // save sessions in the db
  })
);
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); // needed to get form data
app.use(express.json()); // needed to get params from url
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(expressSanitizer());
// seedDB();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const authRoutes = require('./routes/authRoutes');
const campgroundRoutes = require('./routes/campgroundRoutes');
const commentRoutes = require('./routes/commentRoutes');
const contactRoutes = require('./routes/contactRoutes');

// res.locals: make currentUser, error and success available throughout the app
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.get('/', (req, res) => {
  res.render('landing');
});

// Routers
app.use('/auth', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/contact', contactRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
