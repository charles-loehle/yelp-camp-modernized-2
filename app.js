const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

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

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); // instead of bodyParser
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// seedDB();

app.get('/', function (req, res) {
  res.render('landing');
});

// ===========================
// CAMPGROUNDS ROUTES
// ===========================
// //INDEX - show all campgrounds
// app.get('/campgrounds', function (req, res) {
//   // Get all campgrounds from DB
//   Campground.find({}, function (err, allCampgrounds) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('index', { campgrounds: allCampgrounds });
//     }
//   });
// });

// @desc      Show all campgrounds page
// @route     GET /campgrounds
// @access    Public
app.get('/campgrounds', async (req, res) => {
  try {
    const allCampgrounds = await Campground.find();
    res.render('index', { campgrounds: allCampgrounds });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// //CREATE - add new campground to DB
// app.post('/campgrounds', function (req, res) {
//   // get data from form and add to campgrounds array
//   var name = req.body.name;
//   var image = req.body.image;
//   var desc = req.body.description;
//   var newCampground = { name: name, image: image, description: desc };
//   // Create a new campground and save to DB
//   Campground.create(newCampground, function (err, newlyCreated) {
//     if (err) {
//       console.log(err);
//     } else {
//       //redirect back to campgrounds page
//       res.redirect('/campgrounds');
//     }
//   });
// });

// @desc      Create new campground
// @route     POST /campgrounds
// @access    Private
app.post('/campgrounds', async (req, res) => {
  const { name, image, description } = req.body;

  try {
    await Campground.create({ name, image, description });
    res.redirect('/campgrounds');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//NEW - show form to create new campground
// @desc      Show the create new campground page
// @route     GET /campgrounds/new
// @access    Public
app.get('/campgrounds/new', (req, res) => res.render('campgrounds/new'));

// // SHOW - shows more info about one campground
// app.get('/campgrounds/:id', function (req, res) {
//   //find the campground with provided ID
//   // console.log(req.params.id);
//   Campground.findById(req.params.id)
//     // populate the comments property of the Campgrounds model
//     .populate('comments')
//     .exec(function (err, foundCampground) {
//       if (err) {
//         console.log(err);
//       } else {
//         // console.log(`/campgrounds/:id route ${foundCampground}`);
//         //render show template with that campground
//         res.render('campgrounds/show', { campground: foundCampground });
//       }
//     });
// });

// @desc      Get a single campground
// @route     GET /campgrounds/:id
// @access    Public
app.get('/campgrounds/:id', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      'comments'
    );
    //console.log('req.params.id: ' + req.params.id);

    if (!campground)
      return res.status(404).json({ msg: 'Campground not found' });

    //console.log(campground);
    res.render('campgrounds/show', { campground });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ===========================
// COMMENTS ROUTES
// ===========================
// app.get('/campgrounds/:id/comments/new', (req, res) => {
//   // console.log(req.params.id);
//   Campground.findById(req.params.id, (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('comments/new', { campground });
//     }
//   });
// });

// @desc      Show the create new comment page
// @route     GET /campgrounds/:id/comments/new
// @access    Public
app.get('/campgrounds/:id/comments/new', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      return res.status(404).json({ msg: 'Campground not found' });
    }
    res.render('comments/new', { campground: campground });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/campgrounds/:id/comments', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    const comment = await Comment.create(req.body.comment);
    campground.comments.push(comment);
    campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    console.error(err.message);
    res.redirect('/campgrounds');
  }
  // Campground.findById(req.params.id, (err, campground) => {
  //   if (err) {
  //     console.log(err);
  //     res.redirect('/campgrounds');
  //   } else {
  //     Comment.create(req.body.comment, (err, comment) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         campground.comments.push(comment);
  //         campground.save();
  //         //console.log(`/campgrounds/${campground._id}`);
  //         res.redirect(`/campgrounds/${campground._id}`);
  //       }
  //     });
  //   }
  // });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
