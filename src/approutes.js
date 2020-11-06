const express = require('express');

const router = express.Router();

// ===Other files===
const dbController = require('./dbcontroller');

const db = new dbController();

const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.redirect('/');
};

router.get('/', (req, res) => {
  if (req.isAuthenticated()) res.redirect('/home');
  else res.render('login');
});

router.get('/home', isLoggedIn, async (_, res) => {
  const categories = await db.getCategories();
  res.render('home', { categories });
});

router.get('/category/:name', isLoggedIn, async (req, res) => {
  const { name } = req.params;

  const instalaciones = await db.getAllServices(name);
  res.render('category', { name, instalaciones });
});

router.get('/profile', isLoggedIn, (req, res) => {
  //const { name } = req.params;
  const data = {
    name: 'Paola Rijo',
    email: 'masiel.107@gamil.com',
    campus: 'Monterrey',
    history: [
      {
        reviewname: 'Servilletero',
        rating: '★★★★★'
      },
      {
        reviewname: 'Dona tota',
        rating: '★★★★☆'
      },
      {
        reviewname: 'Chilaquiles tec',
        rating: '★★☆☆☆'
      },
      {
        reviewname: 'Mitec',
        rating: '★★★★☆'
      },
      {
        reviewname: 'Mode hibrido',
        rating: '★★☆☆☆'
      }
    ],
    img:
      'https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/c3dd6161-07a9-4ef5-b9bd-008c808a0fed'
  };
  // const { name, picture: img, email } = req.user;
  res.render('profile', data);
  // res.render('profile', { name, img, email, campus: 'Monterrey' });
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

  // console.log(serviceData);

  res.render('review', data);
});

router.post('/review', (req, res) => {
  // console.log(req.body);
  // console.log(req.user);
  const { comment, rating, service } = req.body;
  const { id } = req.user;

  // console.log({ comment, id, service, rating });

  db.addReview(comment, id, service, rating);

  res.send('Review added');
});

module.exports = router;
