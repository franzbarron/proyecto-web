const express = require('express');

const router = express.Router();

// ===Other files===
const dbController = require('./dbcontroller');

const db = new dbController();

const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else if (req.method === 'POST') res.sendStatus(401);
  else res.status(401).redirect('/');
};

router.get('/', (req, res) => {
  if (req.isAuthenticated()) res.redirect('/home');
  else res.render('login');
});

router.get('/home', isLoggedIn, async (req, res) => {
  const categories = await db.getCategories();
  const { given_name } = req.user;
  const mostRecentlyReviewed = await db.getLatestReviewedServices(3);
  res.render('home', { given_name, categories, mostRecentlyReviewed });
});

router.get('/category/:name', isLoggedIn, async (req, res) => {
  const { name } = req.params;

  const servicios = await db.getAllServices(name);

  res.render('category', { name, servicios });
});

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const userData = await db.getFullUserData(id);
  const userReviews = await db.getUserReviews(id);

  const data = {
    campus: 'Monterrey',
    history: userReviews,
    ...userData
  };

  res.render('profile', data);
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const { name, id, picture: img, email } = req.user;
  const userReviews = await db.getUserReviews(id);
  const userData = await db.getUserData(id);

  const data = {
    name,
    email,
    campus: 'Monterrey',
    img,
    history: userReviews,
    ...userData
  };
  res.render('profile', data);
});

router.get('/review/:name', isLoggedIn, async (req, res) => {
  const { name } = req.params;

  const serviceData = await db.getService(name);
  const reviewComments = await db.getServiceReviews(name);

  const { avg } = await db.getServiceAverage(name);

  // Data to send
  const data = {
    name,
    image: serviceData.img,
    rating: Math.round(avg) || 0,
    'total-reviews': reviewComments.length,
    reviews: reviewComments
  };

  res.render('review', data);
});

router.post('/review', isLoggedIn, (req, res) => {
  const { comment, rating, service } = req.body;
  const { id } = req.user;

  db.addReview(comment, id, service, rating);

  res.send('Review added');
});

module.exports = router;
